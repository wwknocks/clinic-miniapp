import * as cheerio from "cheerio";
import { ParsedContent } from "../models/types";

export async function parseHTML(html: string): Promise<ParsedContent> {
  try {
    const $ = cheerio.load(html);

    $("script, style, noscript").remove();

    const text = $("body").text().replace(/\s+/g, " ").trim();
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = words.length;

    const headings: string[] = [];
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const heading = $(el).text().trim();
      if (heading) {
        headings.push(heading);
      }
    });

    const links: Array<{ text: string; href: string }> = [];
    $("a[href]").each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href") || "";
      if (text && href) {
        links.push({ text, href });
      }
    });

    const images: Array<{ alt: string; src: string }> = [];
    $("img").each((_, el) => {
      const alt = $(el).attr("alt") || "";
      const src = $(el).attr("src") || "";
      images.push({ alt, src });
    });

    return {
      text,
      wordCount,
      headings,
      links,
      images,
      success: true,
    };
  } catch (error) {
    return {
      text: "",
      wordCount: 0,
      headings: [],
      links: [],
      images: [],
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error parsing HTML",
    };
  }
}
