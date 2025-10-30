"use server";

import { createClient } from "@/lib/supabase/server";
import { handleError, logError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const BUCKET_NAME = "pdf-uploads";

export interface UploadPDFResult {
  success: boolean;
  data?: {
    pdfId: string;
    pdfPath: string;
    pdfUrl: string;
  };
  error?: string;
}

export async function uploadPDF(formData: FormData): Promise<UploadPDFResult> {
  try {
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    if (file.type !== "application/pdf") {
      return { success: false, error: "Only PDF files are allowed" };
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: "File size must be less than 50MB" };
    }

    const supabase = await createClient();

    const fileExt = "pdf";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    logger.info("Uploading PDF", { fileName, filePath, size: file.size });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(uploadData.path, 60 * 60 * 24 * 30);

    if (!urlData) {
      throw new Error("Failed to create signed URL");
    }

    logger.info("PDF uploaded successfully", { path: uploadData.path });

    return {
      success: true,
      data: {
        pdfId: fileName,
        pdfPath: uploadData.path,
        pdfUrl: urlData.signedUrl,
      },
    };
  } catch (error) {
    logError(error, { action: "uploadPDF" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function deletePDF(
  pdfPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    logger.info("Deleting PDF", { pdfPath });

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([pdfPath]);

    if (error) {
      throw new Error(`Failed to delete PDF: ${error.message}`);
    }

    logger.info("PDF deleted successfully", { pdfPath });

    return { success: true };
  } catch (error) {
    logError(error, { action: "deletePDF", pdfPath });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function refreshSignedUrl(
  pdfPath: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(pdfPath, 60 * 60 * 24 * 30);

    if (error || !data) {
      throw new Error(`Failed to create signed URL: ${error?.message}`);
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    logError(error, { action: "refreshSignedUrl", pdfPath });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
