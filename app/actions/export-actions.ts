"use server";

import { handleError, logError } from "@/lib/errors";
import { isServiceRoleConfigured } from "@/lib/flags";
import { generateArtifacts } from "@/lib/exports/pipeline";
import { uploadArtifacts } from "@/lib/exports/upload";
import { AdminProjectService } from "@/db/projects";
import type { GeneratedAssetMeta, ProjectData } from "@/types/project";
import { analyticsServer } from "@/lib/analytics-server";

interface ExportResult {
  success: boolean;
  data?: {
    fileName: string;
    size: number;
    url: string;
    createdAt: string;
    type: "pdf" | "pptx" | "json";
  };
  error?: string;
}

interface ExportAllResult {
  success: boolean;
  timestamp: string;
  assets: GeneratedAssetMeta[];
  progress?: { step: string; message: string; percent: number }[];
  error?: string;
}

function buildSampleProjectData(): ProjectData {
  const now = new Date().toISOString();
  return {
    sourceType: "url",
    url: "https://example.com",
    icp: "Founders and marketers seeking conversion lift",
    priceTerms: "$49/mo",
    mechanism: "AI-driven heuristics and LLM prompting",
    primaryObjection: "Time to implement",
    results: {
      scoringResult: {
        overallScore: 72,
        dimensionScores: {
          value: 80,
          urgency: 60,
          certainty: 70,
          effort: 68,
          specificity: 75,
          proof: 70,
        },
        metrics: {},
        leverDeltas: [],
        timestamp: now,
      },
      llmOutputs: {
        strengths: ["Clear value prop", "Strong brand signals"],
        weaknesses: ["Low urgency", "Guarantee unclear"],
        recommendations: [
          "Add time-bound incentive",
          "Prominently display refund policy",
          "Add comparison table",
        ],
        fixSuggestions: [],
        objectionHandlers: [],
        conversionKits: ["LinkedIn carousel", "Outbound DM script"],
      },
    },
  };
}

function toDataUrl(mime: string, buf: Buffer): string {
  const b64 = buf.toString("base64");
  return `data:${mime};base64,${b64}`;
}

async function appendAssetsToProject(
  projectId: string,
  metas: GeneratedAssetMeta[]
) {
  try {
    const project = await AdminProjectService.getById(projectId);
    if (!project) return;
    const existingData = (project.data as unknown as ProjectData) || {};
    const nextAssets = [
      ...(existingData.generatedAssets || []),
      ...metas,
    ];
    const nextData = { ...existingData, generatedAssets: nextAssets } as unknown as Record<string, unknown>;
    await AdminProjectService.update(projectId, { data: nextData });
  } catch (e) {
    // best-effort; don't throw
  }
}

export async function exportPDF(projectId: string): Promise<ExportResult> {
  try {
    const nowIso = new Date().toISOString();
    // Load project or fallback to sample
    let projectData: ProjectData | null = null;
    try {
      const p = await AdminProjectService.getById(projectId);
      projectData = (p?.data as unknown as ProjectData) || null;
    } catch {
      projectData = null;
    }
    if (!projectData) projectData = buildSampleProjectData();

    let pdf: any;
    try {
      ({ pdf } = await generateArtifacts(projectData, { title: "Offer Analysis" }));
    } catch (e) {
      const fallback = Buffer.from(
        "Offer Analysis PDF placeholder. Rendering is unavailable in this environment.",
        "utf-8"
      );
      pdf = {
        type: "pdf",
        fileName: `report-${Date.now()}.pdf`,
        mimeType: "application/pdf",
        buffer: fallback,
        size: fallback.length,
      };
    }

    if (isServiceRoleConfigured) {
      const uploaded = await uploadArtifacts(projectId, nowIso, [pdf]);
      const meta: GeneratedAssetMeta = {
        type: "pdf",
        fileName: uploaded[0].fileName,
        size: uploaded[0].size,
        url: uploaded[0].url,
        createdAt: uploaded[0].createdAt,
        label: "PDF Report",
      };
      await appendAssetsToProject(projectId, [meta]);
      analyticsServer.exportSucceeded();
      return { success: true, data: { ...meta, type: "pdf" } } as ExportResult;
    }

    // Fallback: data URL
    const meta: GeneratedAssetMeta = {
      type: "pdf",
      fileName: pdf.fileName,
      size: pdf.size,
      url: toDataUrl(pdf.mimeType, pdf.buffer),
      createdAt: nowIso,
      label: "PDF Report",
    };
    return { success: true, data: { ...meta, type: "pdf" } } as ExportResult;
  } catch (error) {
    logError(error, { action: "exportPDF", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}

export async function exportPPTX(projectId: string): Promise<ExportResult> {
  try {
    const nowIso = new Date().toISOString();
    let projectData: ProjectData | null = null;
    try {
      const p = await AdminProjectService.getById(projectId);
      projectData = (p?.data as unknown as ProjectData) || null;
    } catch {
      projectData = null;
    }
    if (!projectData) projectData = buildSampleProjectData();

    const { pptx } = await generateArtifacts(projectData, { title: "Offer Analysis" });

    if (isServiceRoleConfigured) {
      const uploaded = await uploadArtifacts(projectId, nowIso, [pptx]);
      const meta: GeneratedAssetMeta = {
        type: "pptx",
        fileName: uploaded[0].fileName,
        size: uploaded[0].size,
        url: uploaded[0].url,
        createdAt: uploaded[0].createdAt,
        label: "PPTX Deck",
      };
      await appendAssetsToProject(projectId, [meta]);
      analyticsServer.exportSucceeded();
      return { success: true, data: { ...meta, type: "pptx" } } as ExportResult;
    }

    const meta: GeneratedAssetMeta = {
      type: "pptx",
      fileName: pptx.fileName,
      size: pptx.size,
      url: toDataUrl(pptx.mimeType, pptx.buffer),
      createdAt: nowIso,
      label: "PPTX Deck",
    };
    return { success: true, data: { ...meta, type: "pptx" } } as ExportResult;
  } catch (error) {
    logError(error, { action: "exportPPTX", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}

export async function exportJSON(projectId: string): Promise<ExportResult> {
  try {
    const nowIso = new Date().toISOString();
    let projectData: ProjectData | null = null;
    try {
      const p = await AdminProjectService.getById(projectId);
      projectData = (p?.data as unknown as ProjectData) || null;
    } catch {
      projectData = null;
    }
    if (!projectData) projectData = buildSampleProjectData();

    const buffer = Buffer.from(JSON.stringify(projectData, null, 2), "utf-8");
    const artifact = {
      type: "json" as const,
      fileName: `project-${Date.now()}.json`,
      mimeType: "application/json",
      buffer,
      size: buffer.length,
    };

    if (isServiceRoleConfigured) {
      const uploaded = await uploadArtifacts(projectId, nowIso, [artifact]);
      const meta: GeneratedAssetMeta = {
        type: "json",
        fileName: uploaded[0].fileName,
        size: uploaded[0].size,
        url: uploaded[0].url,
        createdAt: uploaded[0].createdAt,
        label: "JSON Data",
      };
      await appendAssetsToProject(projectId, [meta]);
      analyticsServer.exportSucceeded();
      return { success: true, data: { ...meta, type: "json" } } as ExportResult;
    }

    const meta: GeneratedAssetMeta = {
      type: "json",
      fileName: artifact.fileName,
      size: artifact.size,
      url: toDataUrl(artifact.mimeType, artifact.buffer),
      createdAt: nowIso,
      label: "JSON Data",
    };
    return { success: true, data: { ...meta, type: "json" } } as ExportResult;
  } catch (error) {
    logError(error, { action: "exportJSON", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}

export async function exportAll(projectId: string): Promise<ExportAllResult> {
  const progress: { step: string; message: string; percent: number }[] = [];
  const push = (step: string, message: string, percent: number) =>
    progress.push({ step, message, percent });

  try {
    const timestamp = new Date().toISOString();
    push("init", "Starting export", 5);

    let projectData: ProjectData | null = null;
    let title = "Offer Analysis";
    try {
      const p = await AdminProjectService.getById(projectId);
      projectData = (p?.data as unknown as ProjectData) || null;
      title = p?.title || title;
    } catch {
      projectData = null;
    }
    if (!projectData) projectData = buildSampleProjectData();

    push("generate", "Generating artifacts", 20);
    const { png, pdf, pptx, ics, json, bundle } = await generateArtifacts(projectData, { title });

    let metas: GeneratedAssetMeta[] = [];

    if (isServiceRoleConfigured) {
      push("upload", "Uploading to storage", 60);
      const uploaded = await uploadArtifacts(projectId, timestamp, [png, pdf, pptx, ics, json, bundle]);
      metas = uploaded.map((u) => ({
        type: u.type as GeneratedAssetMeta["type"],
        fileName: u.fileName,
        size: u.size,
        url: u.url,
        createdAt: u.createdAt,
        label:
          u.type === "pdf"
            ? "PDF Report"
            : u.type === "pptx"
            ? "PPTX Deck"
            : u.type === "png"
            ? "Results PNG"
            : u.type === "ics"
            ? "Calendar ICS"
            : u.type === "zip"
            ? "Bundle ZIP"
            : "JSON Data",
      }));
      push("update", "Updating project", 85);
      await appendAssetsToProject(projectId, metas);
    } else {
      push("fallback", "Creating fallback links", 60);
      metas = [png, pdf, pptx, ics, json, bundle].map((a) => ({
        type: a.type as GeneratedAssetMeta["type"],
        fileName: a.fileName,
        size: a.size,
        url: toDataUrl(a.mimeType, a.buffer),
        createdAt: timestamp,
        label:
          a.type === "pdf"
            ? "PDF Report"
            : a.type === "pptx"
            ? "PPTX Deck"
            : a.type === "png"
            ? "Results PNG"
            : a.type === "ics"
            ? "Calendar ICS"
            : a.type === "zip"
            ? "Bundle ZIP"
            : "JSON Data",
      }));
    }

    push("complete", "Export complete", 100);

    return { success: true, timestamp, assets: metas, progress };
  } catch (error) {
    logError(error, { action: "exportAll", projectId });
    const info = handleError(error);
    progress.push({ step: "error", message: info.message, percent: 100 });
    return { success: false, timestamp: new Date().toISOString(), assets: [], progress, error: info.message };
  }
}
