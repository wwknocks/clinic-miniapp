import { parseHTML, parsePDF } from "./parsers";
import { calculateScores } from "./scoring-service";
import { ScoringResult } from "./models/types";

export interface AnalyzeOptions {
  type: "html" | "pdf";
  content: string | Buffer;
}

export interface AnalyzeResult {
  success: boolean;
  result?: ScoringResult;
  error?: string;
}

export async function analyzeContent(
  options: AnalyzeOptions
): Promise<AnalyzeResult> {
  try {
    let parsedContent;

    if (options.type === "html") {
      if (typeof options.content !== "string") {
        throw new Error("HTML content must be a string");
      }
      parsedContent = await parseHTML(options.content);
    } else if (options.type === "pdf") {
      if (!Buffer.isBuffer(options.content)) {
        throw new Error("PDF content must be a Buffer");
      }
      parsedContent = await parsePDF(options.content);
    } else {
      throw new Error(`Unsupported content type: ${options.type}`);
    }

    if (!parsedContent.success) {
      return {
        success: false,
        error: parsedContent.error || "Failed to parse content",
      };
    }

    const scoringResult = calculateScores(parsedContent);

    return {
      success: true,
      result: scoringResult,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function analyzeHTMLFile(filePath: string): Promise<AnalyzeResult> {
  try {
    const fs = await import("fs");
    const content = fs.readFileSync(filePath, "utf-8");
    return analyzeContent({ type: "html", content });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to read HTML file",
    };
  }
}

export async function analyzePDFFile(filePath: string): Promise<AnalyzeResult> {
  try {
    const fs = await import("fs");
    const content = fs.readFileSync(filePath);
    return analyzeContent({ type: "pdf", content });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to read PDF file",
    };
  }
}
