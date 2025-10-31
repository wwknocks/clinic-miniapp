import { NextResponse } from "next/server";
import {
  generateCopyRewrite,
  type CopyRewriterInputs,
} from "@/lib/llm";
import type { CopyRewriteOutput } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function buildError(message: string, errorType: string, hint?: string) {
  return NextResponse.json({ success: false, error: message, errorType, hint }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<CopyRewriterInputs>;

    if (!body || !body.currentCopy || !body.icp) {
      return buildError(
        "Missing required fields: currentCopy and icp",
        "VALIDATION_ERROR",
        "Provide both currentCopy and icp in the request body"
      );
    }

    const inputs: CopyRewriterInputs = {
      currentCopy: body.currentCopy,
      icp: body.icp,
      primaryObjection: body.primaryObjection,
      valueProposition: body.valueProposition,
      proofPoints: body.proofPoints,
    } as CopyRewriterInputs;

    try {
      const result = await generateCopyRewrite(inputs);
      const data: CopyRewriteOutput = result.content;

      if (!data || (!data.headline && !data.body?.length)) {
        return buildError(
          "Empty response from generator",
          "LLM_EMPTY",
          "Try simplifying input or reducing length"
        );
      }

      return NextResponse.json({ success: true, data, usage: result.usage, cached: result.cached });
    } catch (err) {
      const e = err as { type?: string; message?: string; retryable?: boolean };
      return NextResponse.json(
        {
          success: false,
          error: e.message || "LLM call failed",
          errorType: e.type || "LLM_ERROR",
          retryable: !!e.retryable,
          hint:
            e.type === "rate_limit"
              ? "Rate limited by provider. Wait a moment and retry."
              : e.type === "token_limit"
              ? "Inputs too long. Reduce input size to fit token limits."
              : "Please retry. If the issue persists, reduce input size or try again later.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Invalid request", errorType: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
