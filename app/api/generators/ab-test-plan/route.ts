import { NextResponse } from "next/server";
import { generate7DayABPlan, type ABTestPlanInputs } from "@/lib/llm";
import type { ABTestPlanOutput } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<ABTestPlanInputs> & {
      days?: number;
    };

    if (!body || !body.currentMetrics || typeof body.currentMetrics.conversionRate !== "number" || !body.offerDescription || !body.targetAudience) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: currentMetrics.conversionRate, offerDescription, targetAudience",
          errorType: "VALIDATION_ERROR",
          hint: "Provide currentMetrics.conversionRate, offerDescription, and targetAudience",
        },
        { status: 400 }
      );
    }

    const days = Math.min(14, Math.max(3, body.days || 7));

    const inputs: ABTestPlanInputs = {
      currentMetrics: body.currentMetrics as ABTestPlanInputs["currentMetrics"],
      offerDescription: body.offerDescription,
      targetAudience: body.targetAudience,
      primaryWeaknesses: body.primaryWeaknesses,
      testingGoals: body.testingGoals,
    } as ABTestPlanInputs;

    try {
      const result = await generate7DayABPlan(inputs);
      const data: ABTestPlanOutput = result.content;

      // Deterministic shaping: enforce number of test days
      let test_days = data.test_days || [];
      if (test_days.length < days && test_days.length > 0) {
        const extended = [...test_days];
        for (let i = test_days.length; i < days; i++) {
          const base = test_days[i % test_days.length];
          extended.push({
            day: i + 1,
            focus: `${base.focus} (Day ${i + 1})`,
            variants: base.variants,
            metrics_to_track: base.metrics_to_track,
            success_criteria: base.success_criteria,
          });
        }
        test_days = extended;
      } else if (test_days.length > days) {
        test_days = test_days.slice(0, days).map((d, idx) => ({ ...d, day: idx + 1 }));
      } else {
        test_days = test_days.map((d, idx) => ({ ...d, day: idx + 1 }));
      }

      const shaped: ABTestPlanOutput = {
        overview: data.overview || `A ${days}-day test plan`,
        baseline_metrics: data.baseline_metrics || [],
        test_days,
        analysis_framework: data.analysis_framework || "",
        rollout_strategy: data.rollout_strategy || "",
      };

      if (!shaped.test_days.length) {
        return NextResponse.json(
          { success: false, error: "Empty response from generator", errorType: "LLM_EMPTY" },
          { status: 200 }
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
              ? "Rate limited. Wait and retry."
              : e.type === "token_limit"
              ? "Inputs too long. Reduce input size."
              : "Retry with shorter offerDescription.",
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
