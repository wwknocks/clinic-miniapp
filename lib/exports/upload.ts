import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Artifact } from "./pipeline";

const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "pdf-uploads";

export interface UploadedMeta {
  path: string;
  url: string;
  fileName: string;
  size: number;
  type: string;
  createdAt: string;
}

async function detectContentType(buf: Buffer, fallback: string): Promise<string> {
  try {
    const { fileTypeFromBuffer } = await import("file-type");
    const ft = await fileTypeFromBuffer(buf);
    if (ft?.mime) return ft.mime;
    return fallback;
  } catch {
    return fallback;
  }
}

export async function uploadArtifacts(
  projectId: string,
  timestamp: string,
  artifacts: Artifact[]
): Promise<UploadedMeta[]> {
  const supabase = await createServiceRoleClient();
  const results: UploadedMeta[] = [];

  for (const art of artifacts) {
    const contentType = await detectContentType(art.buffer, art.mimeType);
    const path = `exports/${projectId}/${timestamp}/${art.fileName}`;

    const withRetry = async <T>(fn: () => Promise<T>, attempts = 2): Promise<T> => {
      let lastErr: unknown;
      for (let i = 0; i < attempts; i++) {
        try {
          return await fn();
        } catch (e) {
          lastErr = e;
          await new Promise((r) => setTimeout(r, 300 * (i + 1)));
        }
      }
      throw lastErr instanceof Error ? lastErr : new Error("Upload failed");
    };

    await withRetry(async () => {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, art.buffer, { contentType, upsert: true });
      if (error) throw new Error(error.message);
    });

    const { data: signed, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 31536000); // 1y
    if (signErr) throw new Error(signErr.message);

    results.push({
      path,
      url: signed.signedUrl,
      fileName: art.fileName,
      size: art.size,
      type: art.type,
      createdAt: new Date().toISOString(),
    });
  }

  return results;
}
