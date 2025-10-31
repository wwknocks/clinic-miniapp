import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/scoring";
import { captureScreenshotWithFallback } from "@/lib/puppeteer";
import { probeCTAInFold } from "@/lib/puppeteer/dom-probe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || undefined;
  const projectId = searchParams.get("projectId") || "preview";
  const userId = searchParams.get("userId") || "anonymous";

  return handleAnalyze({ url, projectId, userId });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { url, html, projectId = "preview", userId = "anonymous" } = body || {};
    return handleAnalyze({ url, html, projectId, userId });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid request body",
        errorType: "VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }
}

async function handleAnalyze({
  url,
  html,
  projectId,
  userId,
}: {
  url?: string;
  html?: string;
  projectId: string;
  userId: string;
}) {
  try {
    let sourceHtml = html;

    if (!sourceHtml) {
      if (!url) {
        return NextResponse.json(
          { success: false, error: "Missing url or html", errorType: "VALIDATION_ERROR" },
          { status: 400 }
        );
      }

      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (OfferWindTunnelBot/1.0)" },
        });
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        sourceHtml = await res.text();
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            error: err instanceof Error ? err.message : "Failed to fetch URL",
            errorType: "FETCH_ERROR",
          },
          { status: 502 }
        );
      }
    }

    const analysis = await analyzeContent({ type: "html", content: sourceHtml });
    if (!analysis.success || !analysis.result) {
      return NextResponse.json(
        {
          success: false,
          error: analysis.error || "Failed to analyze content",
          errorType: "PARSE_ERROR",
        },
        { status: 200 }
      );
    }

    const probe = await probeCTAInFold({ url, html: sourceHtml, foldHeight: 1200 });

    // Merge confidence info (cta confidence boosted if DOM CTA found above the fold)
    const metrics = analysis.result.metrics as any;
    if (metrics?.ctaDetection) {
      const baseConf = metrics.ctaDetection.confidence ?? 0.7;
      metrics.ctaDetection.confidence = Math.max(baseConf, probe.foundInFold ? 0.95 : baseConf);
      metrics.ctaDetection.rawValue = metrics.ctaDetection.rawValue;
    }

    let foldScreenshotPath: string | undefined;
    let foldScreenshotSignedUrl: string | undefined;

    if (url) {
      const ss = await captureScreenshotWithFallback({
        url,
        projectId,
        userId,
        width: 1200,
        height: 1200,
        foldHeight: 1200,
      });
      if (ss.success) {
        foldScreenshotPath = ss.path;
        foldScreenshotSignedUrl = ss.signedUrl;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        overallScore: analysis.result.overallScore,
        dimensionScores: analysis.result.dimensionScores,
        metrics: analysis.result.metrics,
        leverDeltas: analysis.result.leverDeltas,
        timestamp: analysis.result.timestamp,
        domProbe: probe,
        foldScreenshotPath,
        foldScreenshotSignedUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected error",
        errorType: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
