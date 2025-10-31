import { NextResponse } from "next/server";
import { generateObjectionPack, type ObjectionPackInputs } from "@/lib/llm";
import type { ObjectionPackOutput } from "@/lib/llm";

function buildError(message: string, errorType: string, hint?: string, status = 400) {
  return NextResponse.json({ success: false, error: message, errorType, hint }, { status });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<ObjectionPackInputs> & {
      handlerCount?: number;
    };

    if (!body || !body.offer || !body.icp) {
      return buildError(
        "Missing required fields: offer and icp",
        "VALIDATION_ERROR",
        "Provide both offer and icp in the request body"
      );
    }

    const inputs: ObjectionPackInputs = {
      offer: body.offer,
      icp: body.icp,
      pricePoint: body.pricePoint,
      primaryObjections: body.primaryObjections,
      competitors: body.competitors,
    } as ObjectionPackInputs;

    const desiredCount = Math.max(1, Math.min(50, body.handlerCount || 10));

    try {
      const result = await generateObjectionPack(inputs);
      const data: ObjectionPackOutput = result.content;

      // Deterministic shaping: enforce desired handler count
      let handlers = data.handlers || [];
      if (handlers.length < desiredCount && handlers.length > 0) {
        const toAdd = desiredCount - handlers.length;
        const extended = [...handlers];
        for (let i = 0; i < toAdd; i++) {
          const base = handlers[i % handlers.length];
          extended.push({
            objection: `${base.objection} (${handlers.length + i + 1})`,
            response: base.response,
            proof_points: [...base.proof_points],
            reframe: base.reframe,
          });
        }
        handlers = extended;
      } else if (handlers.length > desiredCount) {
        handlers = handlers.slice(0, desiredCount);
      }

      const shaped: ObjectionPackOutput = {
        handlers,
        preventative_copy: data.preventative_copy || [],
        trust_builders: data.trust_builders || [],
      };

      if (!shaped.handlers.length) {
        return buildError(
          "Empty response from generator",
          "LLM_EMPTY",
          "Try providing primaryObjections or reduce input length",
          200
        );
      }

      return NextResponse.json({ success: true, data: shaped, usage: result.usage, cached: result.cached });
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
              ? "Rate limited by provider. Wait and retry."
              : e.type === "token_limit"
              ? "Inputs too long. Reduce input size."
              : "Retry or simplify inputs.",
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
