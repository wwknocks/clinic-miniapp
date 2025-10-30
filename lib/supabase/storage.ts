import { createClient } from "./client";
import { createServiceRoleClient } from "./server";

const BUCKET_NAME = "pdf-uploads";

export interface UploadOptions {
  userId: string;
  fileName: string;
  file: File | Blob;
  contentType?: string;
}

export interface UploadResult {
  path: string;
  url: string;
}

export class StorageService {
  private supabase = createClient();

  /**
   * Upload a PDF file to the storage bucket
   * Files are organized by user ID: {userId}/{fileName}
   */
  async uploadPDF(options: UploadOptions): Promise<UploadResult> {
    const { userId, fileName, file, contentType = "application/pdf" } = options;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    const url = await this.getSignedUrl(data.path);
    return { path: data.path, url };
  }

  /**
   * Get a signed URL for a file (valid for 1 hour)
   */
  async getSignedUrl(path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, 3600); // 1 hour

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * List all files for a user
   */
  async listUserFiles(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .list(userId);

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data.map((file) => `${userId}/${file.name}`);
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(path: string) {
    const { data, error } = await this.supabase.storage
      .from(BUCKET_NAME)
      .list(path.split("/")[0], {
        search: path.split("/")[1],
      });

    if (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }

    return data[0];
  }
}

/**
 * Server-side storage service with service role access
 * Used for background jobs and admin operations
 */
export class AdminStorageService {
  /**
   * Clean up PDFs older than TTL_DAYS
   * This should be called from a cron job or edge function
   */
  static async cleanupExpiredPDFs(): Promise<void> {
    const supabase = await createServiceRoleClient();

    try {
      await supabase.rpc("cleanup_old_pdfs");
    } catch (error) {
      console.error("Failed to cleanup expired PDFs:", error);
      throw error;
    }
  }

  /**
   * Get all files in the bucket (admin access)
   */
  static async listAllFiles(): Promise<string[]> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
      throw new Error(`Failed to list all files: ${error.message}`);
    }

    return data.map((file) => file.name);
  }

  /**
   * Delete a file with service role access
   */
  static async deleteFile(path: string): Promise<void> {
    const supabase = await createServiceRoleClient();

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

export const storageService = new StorageService();
