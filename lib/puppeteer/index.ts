import puppeteer, { Browser, Page } from "puppeteer";
import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "pdf-uploads";

export interface ScreenshotOptions {
  url: string;
  projectId: string;
  userId: string;
  width?: number;
  height?: number;
}

export interface ScreenshotResult {
  success: boolean;
  path?: string;
  signedUrl?: string;
  error?: string;
}

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  browserInstance = await puppeteer.launch({
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

export async function captureScreenshot(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  const { url, projectId, userId, width = 1920, height = 1080 } = options;

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await getBrowser();
    page = await browser.newPage();

    await page.setViewport({
      width: width * 2,
      height: height * 2,
      deviceScaleFactor: 2,
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const screenshotBuffer = await page.screenshot({
      type: "png",
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: width * 2,
        height: height * 2,
      },
    });

    await page.close();

    const fileName = `screenshot-${projectId}-${Date.now()}.png`;
    const filePath = `${userId}/screenshots/${fileName}`;

    const supabase = await createServiceRoleClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, screenshotBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload screenshot: ${error.message}`);
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(data.path, 31536000);

    if (signedUrlError) {
      console.warn("Failed to create signed URL:", signedUrlError);
    }

    return {
      success: true,
      path: data.path,
      signedUrl: signedUrlData?.signedUrl,
    };
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    if (page && !page.isClosed()) {
      await page.close().catch(() => {});
    }
  }
}

export async function captureScreenshotWithFallback(
  options: ScreenshotOptions
): Promise<ScreenshotResult> {
  try {
    const result = await captureScreenshot(options);
    return result;
  } catch (error) {
    console.error("Screenshot capture failed, returning fallback:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Screenshot capture failed",
    };
  }
}
