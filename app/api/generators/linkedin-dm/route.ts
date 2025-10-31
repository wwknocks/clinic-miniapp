import { NextResponse } from "next/server";
import { generateLinkedInDMThread, type LinkedInDMInputs } from "@/lib/llm";
import type { LinkedInDMThreadOutput } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<LinkedInDMInputs> & {
      messageCount?: number;
    };

    if (!body || !body.prospect || !body.context || !body.goal) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: prospect, context, goal",
          errorType: "VALIDATION_ERROR",
          hint: "Provide prospect, context, and goal",
        },
        { status: 400 }
      );
    }

    const messageCount = Math.min(5, Math.max(2, body.messageCount || 4));

    const inputs: LinkedInDMInputs = {
      prospect: body.prospect,
      context: body.context,
      goal: body.goal,
      valueOffer: body.valueOffer,
    } as LinkedInDMInputs;

    try {
      const result = await generateLinkedInDMThread(inputs);
      const data: LinkedInDMThreadOutput = result.content;

      // Enforce deterministic message count
      let messages = data.messages || [];
      if (messages.length < messageCount && messages.length > 0) {
        const extended = [...messages];
        for (let i = messages.length; i < messageCount; i++) {
          const base = messages[i % messages.length];
          extended.push({
            sequence_number: i + 1,
            message: `${base.message} (follow-up ${i + 1})`,
            timing: base.timing,
            trigger: base.trigger,
          });
        }
        messages = extended;
      } else if (messages.length > messageCount) {
        messages = messages.slice(0, messageCount).map((m, idx) => ({ ...m, sequence_number: idx + 1 }));
      } else {
        messages = messages.map((m, idx) => ({ ...m, sequence_number: idx + 1 }));
      }

      if (!messages.length) {
        return NextResponse.json(
          { success: false, error: "Empty response from generator", errorType: "LLM_EMPTY" },
          { status: 200 }
        );
      }

      return NextResponse.json({ success: true, data: { messages }, usage: result.usage, cached: result.cached });
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
              : "Retry with shorter context.",
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
