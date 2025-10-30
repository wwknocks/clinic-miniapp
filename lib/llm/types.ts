/**
 * LLM Types
 * TypeScript types for LLM templates and structured outputs
 */

import { z } from "zod";

// Base LLM response types
export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMResponse<T = string> {
  content: T;
  usage?: LLMUsage;
  cached?: boolean;
}

export interface LLMError {
  type: "timeout" | "rate_limit" | "token_limit" | "parse_error" | "api_error";
  message: string;
  retryable: boolean;
}

// Copy Rewriter types
export const CopyRewriteOutputSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.string(),
  body: z.array(z.string()),
  reasoning: z.string(),
});

export type CopyRewriteOutput = z.infer<typeof CopyRewriteOutputSchema>;

// Objection Pack types
export const ObjectionHandlerSchema = z.object({
  objection: z.string(),
  response: z.string(),
  proof_points: z.array(z.string()),
  reframe: z.string(),
});

export const ObjectionPackOutputSchema = z.object({
  handlers: z.array(ObjectionHandlerSchema),
  preventative_copy: z.array(z.string()),
  trust_builders: z.array(z.string()),
});

export type ObjectionPackOutput = z.infer<typeof ObjectionPackOutputSchema>;

// LinkedIn Kit types
export const LinkedInCarouselSlideSchema = z.object({
  slide_number: z.number(),
  headline: z.string(),
  body: z.string(),
  visual_suggestion: z.string(),
});

export const LinkedInCarouselOutputSchema = z.object({
  title: z.string(),
  hook: z.string(),
  slides: z.array(LinkedInCarouselSlideSchema),
  cta_slide: z.object({
    headline: z.string(),
    cta: z.string(),
  }),
});

export type LinkedInCarouselOutput = z.infer<
  typeof LinkedInCarouselOutputSchema
>;

export const LinkedInCaptionOutputSchema = z.object({
  hook: z.string(),
  body: z.string(),
  cta: z.string(),
  hashtags: z.array(z.string()),
});

export type LinkedInCaptionOutput = z.infer<typeof LinkedInCaptionOutputSchema>;

export const LinkedInCommentOutputSchema = z.object({
  comments: z.array(
    z.object({
      text: z.string(),
      tone: z.string(),
    })
  ),
});

export type LinkedInCommentOutput = z.infer<typeof LinkedInCommentOutputSchema>;

export const LinkedInDMThreadSchema = z.object({
  messages: z.array(
    z.object({
      sequence_number: z.number(),
      message: z.string(),
      timing: z.string(),
      trigger: z.string(),
    })
  ),
});

export type LinkedInDMThreadOutput = z.infer<typeof LinkedInDMThreadSchema>;

// 7-Day A/B Plan types
export const ABTestVariantSchema = z.object({
  name: z.string(),
  hypothesis: z.string(),
  changes: z.array(z.string()),
  expected_impact: z.string(),
});

export const ABTestDaySchema = z.object({
  day: z.number(),
  focus: z.string(),
  variants: z.array(ABTestVariantSchema),
  metrics_to_track: z.array(z.string()),
  success_criteria: z.string(),
});

export const ABTestPlanOutputSchema = z.object({
  overview: z.string(),
  baseline_metrics: z.array(z.string()),
  test_days: z.array(ABTestDaySchema),
  analysis_framework: z.string(),
  rollout_strategy: z.string(),
});

export type ABTestPlanOutput = z.infer<typeof ABTestPlanOutputSchema>;

// Offer Analysis types (existing, kept for compatibility)
export interface OfferAnalysisInputs {
  url?: string;
  pdfText?: string;
  icp?: string;
  priceTerms?: string;
  mechanism?: string;
  primaryObjection?: string;
  goal?: string;
}

export interface OfferAnalysisLLMOutputs {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  fixSuggestions: string[];
  objectionHandlers: string[];
  conversionKits: string[];
}
