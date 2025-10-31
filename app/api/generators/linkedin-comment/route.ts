import { NextResponse } from "next/server";
import { generateLinkedInComments, type LinkedInCommentInputs } from "@/lib/llm";
import type { LinkedInCommentOutput } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<LinkedInCommentInputs>;

    if (!body || !body.postContent || !body.responseAngle) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: postContent, responseAngle",
          errorType: "VALIDATION_ERROR",
          hint: "Provide postContent and responseAngle",
        },
        { status: 400 }
      );
    }

    const count = Math.min(20, Math.max(1, body.count || 5));

    const inputs: LinkedInCommentInputs = {
      postContent: body.postContent,
      responseAngle: body.responseAngle,
      count,
    } as LinkedInCommentInputs;

    try {
      const result = await generateLinkedInComments(inputs);
      const data: LinkedInCommentOutput = result.content;

      // Enforce deterministic count
      let comments = data.comments || [];
      if (comments.length < count && comments.length > 0) {
        const extended = [...comments];
        for (let i = comments.length; i < count; i++) {
          const base = comments[i % comments.length];
          extended.push({ text: `${base.text} (${i + 1})`, tone: base.tone });
        }
        comments = extended;
      } else if (comments.length > count) {
        comments = comments.slice(0, count);
      }

      if (!comments.length) {
        return NextResponse.json(
          { success: false, error: "Empty response from generator", errorType: "LLM_EMPTY" },
          { status: 200 }
        );
      }

      return NextResponse.json({ success: true, data: { comments }, usage: result.usage, cached: result.cached });
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
              : "Retry with shorter postContent.",
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
