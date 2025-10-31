import { NextResponse } from "next/server";
import { analyzeContent } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { pdfBase64, pdfPath, url } = body || {};

    let buffer: Buffer | null = null;

    try {
      if (pdfBase64) {
        buffer = Buffer.from(pdfBase64, "base64");
      } else if (url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        const arr = await res.arrayBuffer();
        buffer = Buffer.from(arr);
      } else if (pdfPath) {
        // Expecting a server accessible path; in real env we'd fetch from Supabase
        // For local/testing, try reading from filesystem
        try {
          const fs = await import("fs");
          if (fs.existsSync(pdfPath)) {
            buffer = fs.readFileSync(pdfPath);
          } else {
            throw new Error("pdfPath not found on server");
          }
        } catch (fsErr) {
          throw fsErr instanceof Error ? fsErr : new Error("Failed to read pdfPath");
        }
      } else {
        return NextResponse.json(
          { success: false, error: "Missing pdf input", errorType: "VALIDATION_ERROR" },
          { status: 400 }
        );
      }
    } catch (fetchErr) {
      return NextResponse.json(
        {
          success: false,
          error: fetchErr instanceof Error ? fetchErr.message : "Failed to obtain PDF",
          errorType: "FETCH_ERROR",
        },
        { status: 502 }
      );
    }

    const analysis = await analyzeContent({ type: "pdf", content: buffer as Buffer });

    if (!analysis.success || !analysis.result) {
      return NextResponse.json(
        {
          success: false,
          error: analysis.error || "Failed to analyze PDF",
          errorType: "PARSE_ERROR",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis.result,
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
