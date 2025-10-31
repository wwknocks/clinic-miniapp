import type {
  CopyRewriteOutput,
  ObjectionPackOutput,
  LinkedInCarouselOutput,
  LinkedInCaptionOutput,
  LinkedInCommentOutput,
  LinkedInDMThreadOutput,
  ABTestPlanOutput,
} from "@/lib/llm";
import type {
  CopyRewriterInputs,
  ObjectionPackInputs,
  LinkedInCarouselInputs,
  LinkedInCaptionInputs,
  LinkedInCommentInputs,
  LinkedInDMInputs,
  ABTestPlanInputs,
} from "@/lib/llm";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  usage?: unknown;
  cached?: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  errorType: string;
  retryable?: boolean;
  hint?: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!("success" in json) || json.success !== true) {
    const err = json as ApiError;
    const e = new Error(err?.error || "Request failed");
    (e as any).type = err?.errorType;
    (e as any).retryable = err?.retryable;
    (e as any).hint = err?.hint;
    throw e;
  }
  return (json as ApiSuccess<T>).data;
}

const BASE = "/api/generators";

export async function runCopyRewrite(inputs: CopyRewriterInputs) {
  return postJSON<CopyRewriteOutput>(`${BASE}/copy-rewrite`, inputs);
}

export async function runObjectionPack(
  inputs: ObjectionPackInputs,
  options?: { handlerCount?: number }
) {
  return postJSON<ObjectionPackOutput>(`${BASE}/objection-pack`, { ...inputs, handlerCount: options?.handlerCount });
}

export async function runLinkedInCarousel(
  inputs: LinkedInCarouselInputs,
  options?: { slideCount?: number }
) {
  return postJSON<LinkedInCarouselOutput>(`${BASE}/linkedin-carousel`, { ...inputs, slideCount: options?.slideCount });
}

export async function runLinkedInCaption(inputs: LinkedInCaptionInputs) {
  return postJSON<LinkedInCaptionOutput>(`${BASE}/linkedin-caption`, inputs);
}

export async function runLinkedInComments(inputs: LinkedInCommentInputs) {
  return postJSON<LinkedInCommentOutput>(`${BASE}/linkedin-comment`, inputs);
}

export async function runLinkedInDM(
  inputs: LinkedInDMInputs,
  options?: { messageCount?: number }
) {
  return postJSON<LinkedInDMThreadOutput>(`${BASE}/linkedin-dm`, { ...inputs, messageCount: options?.messageCount });
}

export async function runABTestPlan(
  inputs: ABTestPlanInputs,
  options?: { days?: number }
) {
  return postJSON<ABTestPlanOutput>(`${BASE}/ab-test-plan`, { ...inputs, days: options?.days });
}

// Batch API
export type GeneratorTask =
  | { id: string; type: "copy_rewrite"; inputs: CopyRewriterInputs }
  | { id: string; type: "objection_pack"; inputs: ObjectionPackInputs; options?: { handlerCount?: number } }
  | { id: string; type: "linkedin_carousel"; inputs: LinkedInCarouselInputs; options?: { slideCount?: number } }
  | { id: string; type: "linkedin_caption"; inputs: LinkedInCaptionInputs }
  | { id: string; type: "linkedin_comment"; inputs: LinkedInCommentInputs }
  | { id: string; type: "linkedin_dm"; inputs: LinkedInDMInputs; options?: { messageCount?: number } }
  | { id: string; type: "ab_test_plan"; inputs: ABTestPlanInputs; options?: { days?: number } };

export interface BatchResult<T = unknown> {
  success: boolean;
  id: string;
  type: GeneratorTask["type"];
  data?: T;
  error?: string;
  errorType?: string;
  retryable?: boolean;
  usage?: unknown;
  cached?: boolean;
}

export async function runBatch(tasks: GeneratorTask[]) {
  const res = await fetch(`${BASE}/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks }),
  });
  const json = (await res.json()) as { success: boolean; results: BatchResult[] } | ApiError;
  if (!("success" in json) || (json as any).success !== true) {
    const err = json as ApiError;
    const e = new Error(err?.error || "Batch request failed");
    (e as any).type = err?.errorType;
    (e as any).retryable = err?.retryable;
    (e as any).hint = err?.hint;
    throw e;
  }
  return (json as { success: true; results: BatchResult[] }).results;
}
