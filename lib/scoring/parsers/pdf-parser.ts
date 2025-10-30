import * as pdfParse from "pdf-parse";
import { ParsedContent } from "../models/types";

export async function parsePDF(buffer: Buffer): Promise<ParsedContent> {
  try {
    const pdf =
      (pdfParse as { default?: (buffer: Buffer) => Promise<{ text: string }> })
        .default || (pdfParse as (buffer: Buffer) => Promise<{ text: string }>);
    const data = await pdf(buffer);

    const text = data.text.replace(/\s+/g, " ").trim();
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = words.length;

    const headingPattern = /^[A-Z][A-Z\s]{2,}$/gm;
    const headings = text.match(headingPattern) || [];

    const linkPattern = /(https?:\/\/[^\s]+)/g;
    const linkMatches = text.match(linkPattern) || [];
    const links = linkMatches.map((href) => ({ text: href, href }));

    return {
      text,
      wordCount,
      headings,
      links,
      images: [],
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
        error instanceof Error ? error.message : "Unknown error parsing PDF",
    };
  }
}
