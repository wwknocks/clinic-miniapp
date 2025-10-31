import type { Browser, Page } from "puppeteer";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "pdf-uploads";

export interface ScreenshotOptions {
  url?: string;
  html?: string;
  projectId: string;
  userId: string;
  width?: number;
  height?: number;
  foldHeight?: number;
}

export interface ScreenshotResult {
  success: boolean;
  path?: string;
  signedUrl?: string;
  error?: string;
}

let browserInstance: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (browserInstance && (browserInstance as any).connected !== false) {
    return browserInstance;
  }

  // Detect serverless/production environment (Vercel/AWS Lambda)
  const isServerless = Boolean(
    process.env.AWS_REGION || process.env.LAMBDA_TASK_ROOT || process.env.VERCEL
  );

  if (isServerless) {
    try {
      // Use @sparticuz/chromium + puppeteer-core on serverless
      const chromium = (await import("@sparticuz/chromium")).default as any;
      const puppeteerCore = (await import("puppeteer-core")).default as any;

      const executablePath: string = await chromium.executablePath();

      browserInstance = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });

      return browserInstance;
    } catch (_err) {
      // ignore and fall through to local fallback
    }
  }

  // Local/dev fallback to full puppeteer (bundled Chromium)
  const puppeteerFull = (await import("puppeteer")).default as any;
  browserInstance = await puppeteerFull.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

async function uploadToStorage(
  buffer: Buffer,
  path: string
): Promise<{ path?: string; signedUrl?: string; error?: string }> {
  try {
    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw new Error(error.message);

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(data.path, 31536000);

    if (signedUrlError) {
      return { path: data.path, error: signedUrlError.message };
    }

    return { path: data.path, signedUrl: signedUrlData?.signedUrl };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to upload screenshot",
    };
  }
}

export async function captureScreenshot(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  const {
    url,
    html,
    projectId,
    userId,
    width = 1200,
    height = 1200,
    foldHeight = 1200,
  } = options;

  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setViewport({ width, height: Math.max(height, foldHeight) });

    if (html) {
      await page.setContent(html, { waitUntil: "networkidle0" });
    } else if (url) {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    } else {
      throw new Error("Either url or html must be provided");
    }

    // Small delay to allow fonts/async content
    await page.waitForTimeout(500);

    const clip = { x: 0, y: 0, width, height: foldHeight } as const;

    const screenshotBuffer = (await page.screenshot({
      type: "png",
      fullPage: false,
      clip,
    })) as Buffer;

    const fileName = `fold-${projectId}-${Date.now()}.png`;
    const filePath = `${userId}/screenshots/${fileName}`;

    const uploaded = await uploadToStorage(screenshotBuffer, filePath);

    if (uploaded.path) {
      return { success: true, path: uploaded.path, signedUrl: uploaded.signedUrl };
    }

    return { success: false, error: uploaded.error || "Upload failed" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    if (page && !(page as any).isClosed?.()) {
      try {
        await page.close();
      } catch {}
    }
  }
}

export async function captureScreenshotWithFallback(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  try {
    return await captureScreenshot(options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Screenshot capture failed",
    };
  }
}
