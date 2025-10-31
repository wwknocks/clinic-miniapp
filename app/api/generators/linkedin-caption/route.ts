import { NextResponse } from "next/server";
import { generateLinkedInCaption, type LinkedInCaptionInputs } from "@/lib/llm";
import type { LinkedInCaptionOutput } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<LinkedInCaptionInputs>;

    if (!body || !body.topic || !body.keyMessage || !body.targetAudience) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: topic, keyMessage, targetAudience",
          errorType: "VALIDATION_ERROR",
          hint: "Provide topic, keyMessage, and targetAudience",
        },
        { status: 400 }
      );
    }

    const inputs: LinkedInCaptionInputs = {
      topic: body.topic,
      keyMessage: body.keyMessage,
      targetAudience: body.targetAudience,
      tone: body.tone,
      includeCTA: body.includeCTA,
    } as LinkedInCaptionInputs;

    try {
      const result = await generateLinkedInCaption(inputs);
      const data: LinkedInCaptionOutput = result.content;

      if (!data?.hook && !data?.body) {
        return NextResponse.json(
          { success: false, error: "Empty response from generator", errorType: "LLM_EMPTY" },
          { status: 200 }
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
              ? "Rate limited. Wait and retry."
              : e.type === "token_limit"
              ? "Inputs too long. Reduce input size."
              : "Retry with shorter keyMessage.",
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
