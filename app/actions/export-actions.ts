"use server";

import { handleError, logError } from "@/lib/errors";
import { isServiceRoleConfigured } from "@/lib/flags";

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

async function mockExport(type: "pdf" | "pptx" | "json"): Promise<ExportResult> {
  const now = new Date().toISOString();
  const meta = {
    fileName: `offer-analysis-${now}.${type === "json" ? "json" : type}`,
    size: type === "pdf" ? 256000 : type === "pptx" ? 512000 : 64000,
    url: `https://example.com/mock-${type}`,
    createdAt: now,
    type,
  } as const;
  return { success: true, data: meta };
}

export async function exportPDF(projectId: string): Promise<ExportResult> {
  try {
    // If backend not configured, return mocked metadata
    if (!isServiceRoleConfigured) {
      return await mockExport("pdf");
    }

    // TODO: Implement real PDF export when backend is connected
    return await mockExport("pdf");
  } catch (error) {
    logError(error, { action: "exportPDF", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}

export async function exportPPTX(projectId: string): Promise<ExportResult> {
  try {
    if (!isServiceRoleConfigured) {
      return await mockExport("pptx");
    }

    // TODO: Implement real PPTX export when backend is connected
    return await mockExport("pptx");
  } catch (error) {
    logError(error, { action: "exportPPTX", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}

export async function exportJSON(projectId: string): Promise<ExportResult> {
  try {
    if (!isServiceRoleConfigured) {
      return await mockExport("json");
    }

    // TODO: Implement real JSON export when backend is connected
    return await mockExport("json");
  } catch (error) {
    logError(error, { action: "exportJSON", projectId });
    const info = handleError(error);
    return { success: false, error: info.message };
  }
}
