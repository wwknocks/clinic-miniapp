/**
 * LLM Templates
 * Reusable prompt templates for various offer optimization tasks
 */

import { callLLM } from "./client";
import { SAFETY_PREAMBLE, TEMPLATE_LIMITS } from "./config";
import {
  CopyRewriteOutput,
  CopyRewriteOutputSchema,
  ObjectionPackOutput,
  ObjectionPackOutputSchema,
  LinkedInCarouselOutput,
  LinkedInCarouselOutputSchema,
  LinkedInCaptionOutput,
  LinkedInCaptionOutputSchema,
  LinkedInCommentOutput,
  LinkedInCommentOutputSchema,
  LinkedInDMThreadOutput,
  LinkedInDMThreadSchema,
  ABTestPlanOutput,
  ABTestPlanOutputSchema,
  LLMResponse,
} from "./types";

// Helper to truncate input to character limit
function truncateInput(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "...[truncated]";
}

// Helper to parse JSON response with schema validation
function parseJSONResponse<T>(
  content: string,
  schema: { parse: (data: unknown) => T },
  fallback: T
): T {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[LLM] No JSON found in response");
      return fallback;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = schema.parse(parsed);
    return validated;
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[LLM] Failed to parse response:", err.message || String(error));
    return fallback;
  }
}

/**
 * Copy Rewriter Template
 * Rewrites offer copy for maximum conversion impact
 */
export interface CopyRewriterInputs {
  currentCopy: string;
  icp: string;
  primaryObjection?: string;
  valueProposition?: string;
  proofPoints?: string[];
}

export async function generateCopyRewrite(
  inputs: CopyRewriterInputs
): Promise<LLMResponse<CopyRewriteOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.copyRewriter;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are an expert conversion copywriter specializing in offer optimization. Your task is to rewrite copy to maximize clarity, specificity, urgency, and conversion potential.

Key principles:
- Use specific numbers and timeframes (not "better results" but "37% more leads in 60 days")
- Lead with the transformation/outcome, not features
- Include risk reversal when possible
- Match the voice/tone of the target audience
- Front-load the most compelling value

Format your response as valid JSON matching this structure:
{
  "headline": "string",
  "subheadline": "string", 
  "cta": "string",
  "body": ["string", "string", ...],
  "reasoning": "string"
}`;

  const userPrompt = `Rewrite this offer copy for maximum conversion:

CURRENT COPY:
${truncateInput(inputs.currentCopy, maxInputChars)}

TARGET AUDIENCE (ICP):
${inputs.icp}

${inputs.primaryObjection ? `PRIMARY OBJECTION TO ADDRESS:\n${inputs.primaryObjection}\n` : ""}
${inputs.valueProposition ? `VALUE PROPOSITION:\n${inputs.valueProposition}\n` : ""}
${inputs.proofPoints?.length ? `PROOF POINTS:\n${inputs.proofPoints.join("\n")}\n` : ""}

Provide a rewritten version with improved headline, subheadline, CTA, body paragraphs, and explain your reasoning.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "copy_rewriter",
  });

  const fallback: CopyRewriteOutput = {
    headline: "",
    subheadline: "",
    cta: "",
    body: [],
    reasoning: "Failed to generate rewrite",
  };

  const parsed = parseJSONResponse<CopyRewriteOutput>(
    response.content,
    CopyRewriteOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * Objection Pack Template
 * Generates objection handlers and trust-building copy
 */
export interface ObjectionPackInputs {
  offer: string;
  icp: string;
  pricePoint?: string;
  primaryObjections?: string[];
  competitors?: string[];
}

export async function generateObjectionPack(
  inputs: ObjectionPackInputs
): Promise<LLMResponse<ObjectionPackOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.objectionPack;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are an expert sales objection handler. Create comprehensive objection responses that:
- Acknowledge the concern genuinely
- Provide data-backed responses
- Reframe objections as opportunities
- Include preventative copy to address objections before they arise

Format as valid JSON:
{
  "handlers": [
    {
      "objection": "string",
      "response": "string",
      "proof_points": ["string", ...],
      "reframe": "string"
    }
  ],
  "preventative_copy": ["string", ...],
  "trust_builders": ["string", ...]
}`;

  const offerText = truncateInput(inputs.offer, maxInputChars);
  const objectionsText = inputs.primaryObjections?.join("\n") || "Generate common objections";

  const userPrompt = `Create an objection handling pack for this offer:

OFFER:
${offerText}

TARGET AUDIENCE:
${inputs.icp}

${inputs.pricePoint ? `PRICE POINT: ${inputs.pricePoint}\n` : ""}

PRIMARY OBJECTIONS:
${objectionsText}

${inputs.competitors?.length ? `COMPETITORS:\n${inputs.competitors.join("\n")}\n` : ""}

Provide handlers for top objections, preventative copy, and trust-building elements.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "objection_pack",
  });

  const fallback: ObjectionPackOutput = {
    handlers: [],
    preventative_copy: [],
    trust_builders: [],
  };

  const parsed = parseJSONResponse<ObjectionPackOutput>(
    response.content,
    ObjectionPackOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * LinkedIn Carousel Template
 * Generates carousel content with slides and CTA
 */
export interface LinkedInCarouselInputs {
  topic: string;
  keyPoints: string[];
  targetAudience: string;
  cta?: string;
}

export async function generateLinkedInCarousel(
  inputs: LinkedInCarouselInputs
): Promise<LLMResponse<LinkedInCarouselOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.linkedInCarousel;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are a LinkedIn content expert. Create engaging carousel posts that:
- Hook attention with the title and opening
- Break down complex ideas into digestible slides (5-7 slides ideal)
- Include visual suggestions for each slide
- End with a strong CTA

Format as valid JSON:
{
  "title": "string",
  "hook": "string",
  "slides": [
    {
      "slide_number": number,
      "headline": "string",
      "body": "string",
      "visual_suggestion": "string"
    }
  ],
  "cta_slide": {
    "headline": "string",
    "cta": "string"
  }
}`;

  const keyPointsText = truncateInput(
    inputs.keyPoints.join("\n"),
    maxInputChars
  );

  const userPrompt = `Create a LinkedIn carousel post:

TOPIC: ${inputs.topic}

KEY POINTS TO COVER:
${keyPointsText}

TARGET AUDIENCE: ${inputs.targetAudience}

${inputs.cta ? `DESIRED CTA: ${inputs.cta}\n` : ""}

Create 5-7 engaging slides with clear headlines, concise body copy, and visual suggestions.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "linkedin_carousel",
  });

  const fallback: LinkedInCarouselOutput = {
    title: "",
    hook: "",
    slides: [],
    cta_slide: { headline: "", cta: "" },
  };

  const parsed = parseJSONResponse<LinkedInCarouselOutput>(
    response.content,
    LinkedInCarouselOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * LinkedIn Caption Template
 * Generates engaging post captions
 */
export interface LinkedInCaptionInputs {
  topic: string;
  keyMessage: string;
  targetAudience: string;
  tone?: "professional" | "casual" | "thought-leader";
  includeCTA?: boolean;
}

export async function generateLinkedInCaption(
  inputs: LinkedInCaptionInputs
): Promise<LLMResponse<LinkedInCaptionOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.linkedInCaption;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are a LinkedIn content strategist. Write captions that:
- Start with a strong hook (first line is crucial)
- Use line breaks for readability
- Include specific examples/data when possible
- End with engagement-driving CTA

Format as valid JSON:
{
  "hook": "string",
  "body": "string",
  "cta": "string",
  "hashtags": ["string", ...]
}`;

  const messageText = truncateInput(inputs.keyMessage, maxInputChars);
  const tone = inputs.tone || "professional";

  const userPrompt = `Write a LinkedIn post caption:

TOPIC: ${inputs.topic}

KEY MESSAGE:
${messageText}

TARGET AUDIENCE: ${inputs.targetAudience}

TONE: ${tone}

${inputs.includeCTA !== false ? "Include an engagement-driving CTA." : ""}

Create a compelling caption with hook, body, CTA, and relevant hashtags.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "linkedin_caption",
  });

  const fallback: LinkedInCaptionOutput = {
    hook: "",
    body: "",
    cta: "",
    hashtags: [],
  };

  const parsed = parseJSONResponse<LinkedInCaptionOutput>(
    response.content,
    LinkedInCaptionOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * LinkedIn Comment Template
 * Generates thoughtful comments for engagement
 */
export interface LinkedInCommentInputs {
  postContent: string;
  responseAngle: string;
  count?: number;
}

export async function generateLinkedInComments(
  inputs: LinkedInCommentInputs
): Promise<LLMResponse<LinkedInCommentOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.linkedInComment;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are a LinkedIn engagement expert. Write comments that:
- Add value to the conversation
- Show genuine interest and insight
- Vary in tone and approach
- Feel natural and authentic

Format as valid JSON:
{
  "comments": [
    {
      "text": "string",
      "tone": "string"
    }
  ]
}`;

  const postText = truncateInput(inputs.postContent, maxInputChars);
  const count = inputs.count || 5;

  const userPrompt = `Generate ${count} thoughtful LinkedIn comments:

POST CONTENT:
${postText}

RESPONSE ANGLE: ${inputs.responseAngle}

Create ${count} different comments with varied tones (supportive, curious, enthusiastic, thoughtful, etc.).`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "linkedin_comment",
  });

  const fallback: LinkedInCommentOutput = {
    comments: [],
  };

  const parsed = parseJSONResponse<LinkedInCommentOutput>(
    response.content,
    LinkedInCommentOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * LinkedIn DM Thread Template
 * Generates a sequence of DM messages
 */
export interface LinkedInDMInputs {
  prospect: string;
  context: string;
  goal: string;
  valueOffer?: string;
}

export async function generateLinkedInDMThread(
  inputs: LinkedInDMInputs
): Promise<LLMResponse<LinkedInDMThreadOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.linkedInDM;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are a LinkedIn outreach strategist. Create DM sequences that:
- Lead with value, not asks
- Reference specific context (posts, profile, mutual interests)
- Space messages appropriately
- Include clear triggers for each message

Format as valid JSON:
{
  "messages": [
    {
      "sequence_number": number,
      "message": "string",
      "timing": "string",
      "trigger": "string"
    }
  ]
}`;

  const contextText = truncateInput(inputs.context, maxInputChars);

  const userPrompt = `Create a LinkedIn DM sequence:

PROSPECT: ${inputs.prospect}

CONTEXT/REASON FOR REACHING OUT:
${contextText}

GOAL: ${inputs.goal}

${inputs.valueOffer ? `VALUE OFFER:\n${inputs.valueOffer}\n` : ""}

Generate a 3-4 message sequence with timing and triggers for each message.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "linkedin_dm",
  });

  const fallback: LinkedInDMThreadOutput = {
    messages: [],
  };

  const parsed = parseJSONResponse<LinkedInDMThreadOutput>(
    response.content,
    LinkedInDMThreadSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}

/**
 * 7-Day A/B Test Plan Template
 * Generates structured testing plan
 */
export interface ABTestPlanInputs {
  currentMetrics: {
    conversionRate: number;
    bounceRate?: number;
    avgTimeOnPage?: number;
  };
  offerDescription: string;
  targetAudience: string;
  primaryWeaknesses?: string[];
  testingGoals?: string[];
}

export async function generate7DayABPlan(
  inputs: ABTestPlanInputs
): Promise<LLMResponse<ABTestPlanOutput>> {
  const { maxInputChars, maxOutputTokens, temperature } =
    TEMPLATE_LIMITS.abTestPlan;

  const systemPrompt = `${SAFETY_PREAMBLE}

You are a conversion optimization expert. Create structured A/B test plans that:
- Test high-impact elements first
- Include clear hypotheses and success criteria
- Provide specific variant descriptions
- Recommend metrics to track
- Include rollout strategies

Format as valid JSON:
{
  "overview": "string",
  "baseline_metrics": ["string", ...],
  "test_days": [
    {
      "day": number,
      "focus": "string",
      "variants": [
        {
          "name": "string",
          "hypothesis": "string",
          "changes": ["string", ...],
          "expected_impact": "string"
        }
      ],
      "metrics_to_track": ["string", ...],
      "success_criteria": "string"
    }
  ],
  "analysis_framework": "string",
  "rollout_strategy": "string"
}`;

  const offerText = truncateInput(inputs.offerDescription, maxInputChars);
  const weaknesses = inputs.primaryWeaknesses?.join("\n") || "Analyze for weaknesses";
  const goals = inputs.testingGoals?.join("\n") || "Maximize conversion rate";

  const userPrompt = `Create a 7-day A/B testing plan:

CURRENT METRICS:
- Conversion Rate: ${inputs.currentMetrics.conversionRate}%
${inputs.currentMetrics.bounceRate ? `- Bounce Rate: ${inputs.currentMetrics.bounceRate}%\n` : ""}
${inputs.currentMetrics.avgTimeOnPage ? `- Avg Time on Page: ${inputs.currentMetrics.avgTimeOnPage}\n` : ""}

OFFER DESCRIPTION:
${offerText}

TARGET AUDIENCE: ${inputs.targetAudience}

PRIMARY WEAKNESSES TO TEST:
${weaknesses}

TESTING GOALS:
${goals}

Create a structured 7-day plan with prioritized tests, clear variants, and success criteria.`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature,
    maxTokens: maxOutputTokens,
    jsonMode: true,
    mockKey: "ab_test_plan",
  });

  const fallback: ABTestPlanOutput = {
    overview: "",
    baseline_metrics: [],
    test_days: [],
    analysis_framework: "",
    rollout_strategy: "",
  };

  const parsed = parseJSONResponse<ABTestPlanOutput>(
    response.content,
    ABTestPlanOutputSchema,
    fallback
  );

  return {
    content: parsed,
    usage: response.usage,
    cached: response.cached,
  };
}
