import { NextResponse } from "next/server";
import {
  generateCopyRewrite,
  generateObjectionPack,
  generateLinkedInCarousel,
  generateLinkedInCaption,
  generateLinkedInComments,
  generateLinkedInDMThread,
  generate7DayABPlan,
  parallelLLMCalls,
  type CopyRewriterInputs,
  type ObjectionPackInputs,
  type LinkedInCarouselInputs,
  type LinkedInCaptionInputs,
  type LinkedInCommentInputs,
  type LinkedInDMInputs,
  type ABTestPlanInputs,
} from "@/lib/llm";
import type {
  CopyRewriteOutput,
  LinkedInCarouselOutput,
  LinkedInCaptionOutput,
  LinkedInCommentOutput,
  LinkedInDMThreadOutput,
  ObjectionPackOutput,
  ABTestPlanOutput,
} from "@/lib/llm";

export type GeneratorTask =
  | { id: string; type: "copy_rewrite"; inputs: CopyRewriterInputs }
  | { id: string; type: "objection_pack"; inputs: ObjectionPackInputs; options?: { handlerCount?: number } }
  | { id: string; type: "linkedin_carousel"; inputs: LinkedInCarouselInputs; options?: { slideCount?: number } }
  | { id: string; type: "linkedin_caption"; inputs: LinkedInCaptionInputs }
  | { id: string; type: "linkedin_comment"; inputs: LinkedInCommentInputs }
  | { id: string; type: "linkedin_dm"; inputs: LinkedInDMInputs; options?: { messageCount?: number } }
  | { id: string; type: "ab_test_plan"; inputs: ABTestPlanInputs; options?: { days?: number } };

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { tasks?: GeneratorTask[] };

    if (!body?.tasks || !Array.isArray(body.tasks) || body.tasks.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing tasks[]", errorType: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    // Build call functions
    const calls = body.tasks.map((task) => async () => {
      switch (task.type) {
        case "copy_rewrite": {
          const r = await generateCopyRewrite(task.inputs as CopyRewriterInputs);
          return { id: task.id, type: task.type, data: r.content as CopyRewriteOutput, usage: r.usage, cached: r.cached };
        }
        case "objection_pack": {
          const r = await generateObjectionPack(task.inputs as ObjectionPackInputs);
          const desiredCount = Math.max(1, Math.min(50, task.options?.handlerCount || 10));
          let handlers = (r.content as ObjectionPackOutput).handlers || [];
          if (handlers.length < desiredCount && handlers.length > 0) {
            const extended = [...handlers];
            for (let i = handlers.length; i < desiredCount; i++) {
              const base = handlers[i % handlers.length];
              extended.push({
                objection: `${base.objection} (${i + 1})`,
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
            preventative_copy: (r.content as ObjectionPackOutput).preventative_copy || [],
            trust_builders: (r.content as ObjectionPackOutput).trust_builders || [],
          };
          return { id: task.id, type: task.type, data: shaped, usage: r.usage, cached: r.cached };
        }
        case "linkedin_carousel": {
          const r = await generateLinkedInCarousel(task.inputs as LinkedInCarouselInputs);
          const slideCount = Math.min(10, Math.max(3, task.options?.slideCount || 7));
          let slides = (r.content as LinkedInCarouselOutput).slides || [];
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
            title: (r.content as LinkedInCarouselOutput).title,
            hook: (r.content as LinkedInCarouselOutput).hook,
            slides,
            cta_slide: (r.content as LinkedInCarouselOutput).cta_slide,
          };
          return { id: task.id, type: task.type, data: shaped, usage: r.usage, cached: r.cached };
        }
        case "linkedin_caption": {
          const r = await generateLinkedInCaption(task.inputs as LinkedInCaptionInputs);
          return { id: task.id, type: task.type, data: r.content as LinkedInCaptionOutput, usage: r.usage, cached: r.cached };
        }
        case "linkedin_comment": {
          const r = await generateLinkedInComments(task.inputs as LinkedInCommentInputs);
          const count = Math.min(20, Math.max(1, (task.inputs as LinkedInCommentInputs).count || 5));
          let comments = (r.content as LinkedInCommentOutput).comments || [];
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
          return { id: task.id, type: task.type, data: { comments }, usage: r.usage, cached: r.cached };
        }
        case "linkedin_dm": {
          const r = await generateLinkedInDMThread(task.inputs as LinkedInDMInputs);
          const messageCount = Math.min(5, Math.max(2, task.options?.messageCount || 4));
          let messages = (r.content as LinkedInDMThreadOutput).messages || [];
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
          return { id: task.id, type: task.type, data: { messages }, usage: r.usage, cached: r.cached };
        }
        case "ab_test_plan": {
          const r = await generate7DayABPlan(task.inputs as ABTestPlanInputs);
          const days = Math.min(14, Math.max(3, task.options?.days || 7));
          let test_days = (r.content as ABTestPlanOutput).test_days || [];
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
            overview: (r.content as ABTestPlanOutput).overview,
            baseline_metrics: (r.content as ABTestPlanOutput).baseline_metrics,
            test_days,
            analysis_framework: (r.content as ABTestPlanOutput).analysis_framework,
            rollout_strategy: (r.content as ABTestPlanOutput).rollout_strategy,
          };
          return { id: task.id, type: task.type, data: shaped, usage: r.usage, cached: r.cached };
        }
      }
    });

    const results = await parallelLLMCalls(calls);

    const payload = results.map((r, idx) => {
      const task = body.tasks![idx];
      if (r && typeof r === "object" && "data" in (r as any)) {
        return { success: true, ...(r as any) };
      }
      const err = r as { type?: string; message?: string; retryable?: boolean };
      return {
        success: false,
        id: task.id,
        type: task.type,
        error: err?.message || "LLM call failed",
        errorType: err?.type || "LLM_ERROR",
        retryable: !!err?.retryable,
      };
    });

    return NextResponse.json({ success: true, results: payload });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Invalid request", errorType: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
