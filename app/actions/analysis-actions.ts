"use server";

import { ProjectService, AdminProjectService } from "@/db/projects";
import { handleError, logError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { analyzeContent } from "@/lib/scoring";
import { generateOfferAnalysis, OfferAnalysisInputs } from "@/lib/llm";
import { captureScreenshotWithFallback } from "@/lib/puppeteer";
import { analyticsServer } from "@/lib/analytics-server";
import { computeInputsHash, isCacheValid } from "@/lib/analysis/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

export interface AnalysisProgress {
  stage:
    | "initializing"
    | "deterministic"
    | "llm"
    | "screenshot"
    | "complete"
    | "error";
  progress: number;
  message: string;
}

export interface RunAnalysisResult {
  success: boolean;
  error?: string;
  cached?: boolean;
}

async function fetchContentFromUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; OfferAnalysisBot/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  return await response.text();
}

async function fetchPdfContent(pdfPath: string): Promise<Buffer> {
  const supabase = await createServiceRoleClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "pdf-uploads")
    .download(pdfPath);

  if (error || !data) {
    throw new Error(
      `Failed to download PDF: ${error?.message || "Unknown error"}`
    );
  }

  return Buffer.from(await data.arrayBuffer());
}

export async function runAnalysis(
  projectId: string
): Promise<RunAnalysisResult> {
  const startTime = Date.now();

  try {
    logger.info("Starting analysis", { projectId });

    const project = await ProjectService.getById(projectId);
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const projectData = project.data as Record<string, unknown>;

    if (isCacheValid(projectData)) {
      logger.info("Using cached results", { projectId });
      return { success: true, cached: true };
    }

    await AdminProjectService.update(projectId, {
      status: "analyzing",
    });

    analyticsServer.analysisRun(projectId, project.user_id || undefined);

    const results: Record<string, unknown> = {
      inputsHash: computeInputsHash({
        sourceType: (projectData.sourceType as string) || undefined,
        url: (projectData.url as string) || undefined,
        pdfPath: (projectData.pdfPath as string) || undefined,
        icp: (projectData.icp as string) || undefined,
        priceTerms: (projectData.priceTerms as string) || undefined,
        proofLinks: (projectData.proofLinks as string[]) || undefined,
        mechanism: (projectData.mechanism as string) || undefined,
        primaryObjection: (projectData.primaryObjection as string) || undefined,
        goal: (projectData.goal as string) || undefined,
      }),
      cachedAt: new Date().toISOString(),
    };

    logger.info("Running deterministic analysis", { projectId });

    let content: string | Buffer | null = null;
    let contentType: "html" | "pdf" = "html";

    if (projectData.sourceType === "url" && projectData.url) {
      content = await fetchContentFromUrl(projectData.url as string);
      contentType = "html";
    } else if (projectData.sourceType === "pdf" && projectData.pdfPath) {
      content = await fetchPdfContent(projectData.pdfPath as string);
      contentType = "pdf";
    }

    if (content) {
      const analysisResult = await analyzeContent({
        type: contentType,
        content,
      });

      if (analysisResult.success && analysisResult.result) {
        results.scoringResult = analysisResult.result;
        logger.info("Deterministic analysis complete", {
          projectId,
          score: analysisResult.result.overallScore,
        });
      }
    }

    logger.info("Running LLM analysis", { projectId });
    const llmStartTime = Date.now();

    let pdfText: string | undefined;
    if (projectData.sourceType === "pdf" && projectData.pdfPath) {
      try {
        const pdfBuffer = await fetchPdfContent(projectData.pdfPath as string);
        const pdfParse = await import("pdf-parse");
        const parsed = await pdfParse.default(pdfBuffer);
        pdfText = parsed.text;
      } catch (error) {
        logger.warn("Failed to extract PDF text for LLM", { projectId, error });
      }
    }

    const llmInputs: OfferAnalysisInputs = {
      url: (projectData.url as string) || undefined,
      pdfText,
      icp: (projectData.icp as string) || undefined,
      priceTerms: (projectData.priceTerms as string) || undefined,
      mechanism: (projectData.mechanism as string) || undefined,
      primaryObjection: (projectData.primaryObjection as string) || undefined,
      goal: (projectData.goal as string) || undefined,
    };

    const llmOutputs = await generateOfferAnalysis(llmInputs);
    results.llmOutputs = llmOutputs;

    const llmDuration = Date.now() - llmStartTime;
    analyticsServer.llmCallCompleted(
      projectId,
      llmDuration,
      project.user_id || undefined
    );

    logger.info("LLM analysis complete", { projectId, duration: llmDuration });

    if (projectData.sourceType === "url" && projectData.url) {
      logger.info("Capturing screenshot", { projectId });

      const screenshotResult = await captureScreenshotWithFallback({
        url: projectData.url as string,
        projectId,
        userId: project.user_id || "anonymous",
      });

      if (
        screenshotResult.success &&
        screenshotResult.path &&
        screenshotResult.signedUrl
      ) {
        results.screenshot = {
          path: screenshotResult.path,
          signedUrl: screenshotResult.signedUrl,
        };
        analyticsServer.screenshotCaptured(
          projectId,
          true,
          project.user_id || undefined
        );
        logger.info("Screenshot captured", {
          projectId,
          path: screenshotResult.path,
        });
      } else {
        analyticsServer.screenshotCaptured(
          projectId,
          false,
          project.user_id || undefined
        );
        logger.warn("Screenshot capture failed", {
          projectId,
          error: screenshotResult.error,
        });
      }
    }

    const updatedData = {
      ...projectData,
      results,
    };

    await AdminProjectService.update(projectId, {
      data: updatedData,
      status: "complete",
      updated_at: new Date().toISOString(),
    });

    const scoringResult = results.scoringResult as
      | { overallScore?: number }
      | undefined;
    if (scoringResult?.overallScore) {
      analyticsServer.firstScoreShown(
        projectId,
        scoringResult.overallScore,
        project.user_id || undefined
      );
    }

    const totalDuration = Date.now() - startTime;
    logger.info("Analysis complete", { projectId, duration: totalDuration });
    analyticsServer.analysisCompleted(projectId, totalDuration);

    return { success: true };
  } catch (error) {
    logError(error, { action: "runAnalysis", projectId });

    await AdminProjectService.update(projectId, {
      status: "draft",
    }).catch(() => {});

    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function getAnalysisStatus(projectId: string) {
  try {
    const project = await ProjectService.getById(projectId);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    return {
      success: true,
      data: {
        status: project.status,
        hasResults: !!(project.data as Record<string, unknown>)?.results,
        updatedAt: project.updated_at,
      },
    };
  } catch (error) {
    logError(error, { action: "getAnalysisStatus", projectId });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
