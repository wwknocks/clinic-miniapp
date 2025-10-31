import type { Page } from "puppeteer";
import { getBrowser } from "./index";

export interface CTAProbeOptions {
  url?: string;
  html?: string;
  width?: number;
  foldHeight?: number;
}

export interface CTAProbeItem {
  text: string;
  tag: string;
  top: number;
  href?: string;
}

export interface CTAProbeResult {
  foundInFold: boolean;
  items: CTAProbeItem[];
  viewport: { width: number; height: number };
  foldHeight: number;
  confidence: number;
  error?: string;
}

export async function probeCTAInFold(
  options: CTAProbeOptions
): Promise<CTAProbeResult> {
  const width = options.width ?? 1200;
  const foldHeight = options.foldHeight ?? 1200;

  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setViewport({ width, height: foldHeight });

    if (options.html) {
      await page.setContent(options.html, { waitUntil: "networkidle0" });
    } else if (options.url) {
      await page.goto(options.url, { waitUntil: "networkidle2", timeout: 45000 });
    } else {
      throw new Error("Either url or html must be provided");
    }

    // Wait a bit for layout
    await page.waitForTimeout(250);

    const items = await page.evaluate((fold) => {
      const ctaPhrases = [
        "get started",
        "sign up",
        "try it free",
        "start free trial",
        "book a demo",
        "schedule a call",
        "contact us",
        "request a quote",
        "learn more",
        "download",
        "subscribe",
        "buy now",
        "shop now",
        "get a quote",
        "see pricing",
        "start your free trial",
      ];

      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          "a, button, [role=button], [data-cta], .cta, .cta-button, .btn, .button"
        )
      );

      const found: { text: string; tag: string; top: number; href?: string }[] = [];

      for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        if (!rect || rect.height === 0 || rect.top < 0) continue;
        if (rect.top > fold) continue;

        const text = (el.textContent || "").trim().toLowerCase();
        if (!text) continue;
        const match = ctaPhrases.some((p) => text.includes(p));
        if (!match) continue;

        const tag = el.tagName.toLowerCase();
        const href = (el as HTMLAnchorElement).href || undefined;
        found.push({ text: (el.textContent || "").trim(), tag, top: Math.round(rect.top), href });
      }

      return found;
    }, foldHeight);

    return {
      foundInFold: items.length > 0,
      items,
      viewport: { width, height: foldHeight },
      foldHeight,
      confidence: items.length > 0 ? 0.95 : 0.8,
    };
  } catch (error) {
    return {
      foundInFold: false,
      items: [],
      viewport: { width, height: foldHeight },
      foldHeight,
      confidence: 0,
      error: error instanceof Error ? error.message : "Probe failed",
    };
  } finally {
    if (page && !(page as any).isClosed?.()) {
      try {
        await page.close();
      } catch {}
    }
  }
}
