import { NextResponse } from "next/server";
import { generateLinkedInCarousel, type LinkedInCarouselInputs } from "@/lib/llm";
import type { LinkedInCarouselOutput } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<LinkedInCarouselInputs> & {
      slideCount?: number;
    };

    if (!body || !body.topic || !body.keyPoints || !Array.isArray(body.keyPoints) || !body.targetAudience) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: topic, keyPoints[], targetAudience",
          errorType: "VALIDATION_ERROR",
          hint: "Provide topic, keyPoints array, and targetAudience",
        },
        { status: 400 }
      );
    }

    const slideCount = Math.min(10, Math.max(3, body.slideCount || 7));

    const inputs: LinkedInCarouselInputs = {
      topic: body.topic,
      keyPoints: body.keyPoints,
      targetAudience: body.targetAudience,
      cta: body.cta,
    } as LinkedInCarouselInputs;

    try {
      const result = await generateLinkedInCarousel(inputs);
      const data: LinkedInCarouselOutput = result.content;

      // Deterministic shaping: enforce slide count
      let slides = data.slides || [];
      if (slides.length < slideCount && slides.length > 0) {
        const extended = [...slides];
        for (let i = slides.length; i < slideCount; i++) {
          const base = slides[i % slides.length];
          extended.push({
            slide_number: i + 1,
            headline: `${base.headline} (cont. ${i + 1})`,
            body: base.body,
            visual_suggestion: base.visual_suggestion,
          });
        }
        slides = extended;
      } else if (slides.length > slideCount) {
        slides = slides.slice(0, slideCount).map((s, idx) => ({ ...s, slide_number: idx + 1 }));
      } else {
        slides = slides.map((s, idx) => ({ ...s, slide_number: idx + 1 }));
      }

      const shaped: LinkedInCarouselOutput = {
        title: data.title || inputs.topic,
        hook: data.hook || "",
        slides,
        cta_slide: data.cta_slide || { headline: "", cta: inputs.cta || "" },
      };

      if (!shaped.slides.length) {
        return NextResponse.json(
          {
            success: false,
            error: "Empty response from generator",
            errorType: "LLM_EMPTY",
            hint: "Try increasing keyPoints or reducing input length",
          },
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
              : "Retry with fewer keyPoints or a shorter topic.",
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
