/**
 * LLM Templates Tests
 * Tests for prompt templates and structured output validation
 */

import { describe, it, expect } from "vitest";

describe("LLM Templates", () => {
  describe("Configuration", () => {
    it("should have character limits for all templates", async () => {
      const { TEMPLATE_LIMITS } = await import("../../lib/llm/config");

      expect(TEMPLATE_LIMITS.copyRewriter.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.objectionPack.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInCarousel.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInCaption.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInComment.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInDM.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.abTestPlan.maxInputChars).toBeGreaterThan(0);
    });

    it("should have output token limits for all templates", async () => {
      const { TEMPLATE_LIMITS } = await import("../../lib/llm/config");

      expect(TEMPLATE_LIMITS.copyRewriter.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.objectionPack.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInCarousel.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInCaption.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInComment.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.linkedInDM.maxOutputTokens).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.abTestPlan.maxOutputTokens).toBeGreaterThan(0);
    });
  });

  describe("Safety Features", () => {
    it("should have safety preamble defined", async () => {
      const { SAFETY_PREAMBLE } = await import("../../lib/llm/config");

      expect(SAFETY_PREAMBLE).toContain("Do not fabricate");
      expect(SAFETY_PREAMBLE).toContain("IMPORTANT");
      expect(SAFETY_PREAMBLE.toLowerCase()).toMatch(
        /assumption|speculative|fabricate/
      );
      expect(SAFETY_PREAMBLE.toLowerCase()).toContain("deterministic");
    });

    it("should have reasonable A/B plan token limit (largest template)", async () => {
      const { TEMPLATE_LIMITS } = await import("../../lib/llm/config");

      expect(TEMPLATE_LIMITS.abTestPlan.maxOutputTokens).toBeGreaterThan(
        TEMPLATE_LIMITS.copyRewriter.maxOutputTokens
      );
    });
  });

  describe("Type Definitions", () => {
    it("should export all template input types", async () => {
      const templates = await import("../../lib/llm/templates");

      // Verify functions are exported
      expect(typeof templates.generateCopyRewrite).toBe("function");
      expect(typeof templates.generateObjectionPack).toBe("function");
      expect(typeof templates.generateLinkedInCarousel).toBe("function");
      expect(typeof templates.generateLinkedInCaption).toBe("function");
      expect(typeof templates.generateLinkedInComments).toBe("function");
      expect(typeof templates.generateLinkedInDMThread).toBe("function");
      expect(typeof templates.generate7DayABPlan).toBe("function");
    });

    it("should export schema validators", async () => {
      const types = await import("../../lib/llm/types");

      expect(types.CopyRewriteOutputSchema).toBeDefined();
      expect(types.ObjectionPackOutputSchema).toBeDefined();
      expect(types.LinkedInCarouselOutputSchema).toBeDefined();
      expect(types.LinkedInCaptionOutputSchema).toBeDefined();
      expect(types.LinkedInCommentOutputSchema).toBeDefined();
      expect(types.LinkedInDMThreadSchema).toBeDefined();
      expect(types.ABTestPlanOutputSchema).toBeDefined();
    });
  });

  describe("Schema Validation", () => {
    it("should validate copy rewriter schema", async () => {
      const { CopyRewriteOutputSchema } = await import("../../lib/llm/types");

      const validData = {
        headline: "Test Headline",
        subheadline: "Test Subheadline",
        cta: "Click Here",
        body: ["Para 1", "Para 2"],
        reasoning: "Test reasoning",
      };

      const result = CopyRewriteOutputSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should validate objection pack schema", async () => {
      const { ObjectionPackOutputSchema } = await import("../../lib/llm/types");

      const validData = {
        handlers: [
          {
            objection: "Too expensive",
            response: "Test response",
            proof_points: ["Point 1"],
            reframe: "Test reframe",
          },
        ],
        preventative_copy: ["Copy 1"],
        trust_builders: ["Builder 1"],
      };

      const result = ObjectionPackOutputSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should validate LinkedIn carousel schema", async () => {
      const { LinkedInCarouselOutputSchema } = await import(
        "../../lib/llm/types"
      );

      const validData = {
        title: "Test Title",
        hook: "Test Hook",
        slides: [
          {
            slide_number: 1,
            headline: "Slide 1",
            body: "Content",
            visual_suggestion: "Visual",
          },
        ],
        cta_slide: {
          headline: "CTA Headline",
          cta: "Click",
        },
      };

      const result = LinkedInCarouselOutputSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should validate A/B test plan schema", async () => {
      const { ABTestPlanOutputSchema } = await import("../../lib/llm/types");

      const validData = {
        overview: "Test overview",
        baseline_metrics: ["Metric 1"],
        test_days: [
          {
            day: 1,
            focus: "Headline",
            variants: [
              {
                name: "Control",
                hypothesis: "Test",
                changes: ["Change 1"],
                expected_impact: "10% lift",
              },
            ],
            metrics_to_track: ["CTR"],
            success_criteria: "5% improvement",
          },
        ],
        analysis_framework: "Framework",
        rollout_strategy: "Strategy",
      };

      const result = ABTestPlanOutputSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should reject invalid schema data", async () => {
      const { CopyRewriteOutputSchema } = await import("../../lib/llm/types");

      const invalidData = {
        headline: "Test",
        // Missing required fields
      };

      expect(() => CopyRewriteOutputSchema.parse(invalidData)).toThrow();
    });
  });

  describe("Main Index Exports", () => {
    it("should export all template functions from main index", async () => {
      const llm = await import("../../lib/llm");

      expect(typeof llm.generateCopyRewrite).toBe("function");
      expect(typeof llm.generateObjectionPack).toBe("function");
      expect(typeof llm.generateLinkedInCarousel).toBe("function");
      expect(typeof llm.generateLinkedInCaption).toBe("function");
      expect(typeof llm.generateLinkedInComments).toBe("function");
      expect(typeof llm.generateLinkedInDMThread).toBe("function");
      expect(typeof llm.generate7DayABPlan).toBe("function");
    });

    it("should export client functions from main index", async () => {
      const llm = await import("../../lib/llm");

      expect(typeof llm.callLLM).toBe("function");
      expect(typeof llm.batchLLMCalls).toBe("function");
      expect(typeof llm.parallelLLMCalls).toBe("function");
      expect(typeof llm.getUsageStats).toBe("function");
    });

    it("should export legacy generateOfferAnalysis function", async () => {
      const llm = await import("../../lib/llm");

      expect(typeof llm.generateOfferAnalysis).toBe("function");
    });
  });

  describe("Mock Fixtures", () => {
    it("should have valid JSON in mock responses", async () => {
      const { getAllMockKeys, getMockResponse } = await import(
        "../../lib/llm/mocks"
      );

      const keys = getAllMockKeys();

      keys.forEach((key) => {
        const response = getMockResponse(key);
        expect(response).toBeTruthy();

        // Should be valid JSON
        expect(() => JSON.parse(response!)).not.toThrow();
      });
    });

    it("should have mocks for all templates", async () => {
      const { getMockResponse } = await import("../../lib/llm/mocks");

      expect(getMockResponse("copy_rewriter")).toBeTruthy();
      expect(getMockResponse("objection_pack")).toBeTruthy();
      expect(getMockResponse("linkedin_carousel")).toBeTruthy();
      expect(getMockResponse("linkedin_caption")).toBeTruthy();
      expect(getMockResponse("linkedin_comment")).toBeTruthy();
      expect(getMockResponse("linkedin_dm")).toBeTruthy();
      expect(getMockResponse("ab_test_plan")).toBeTruthy();
    });

    it("should have mocks that match schemas", async () => {
      const { getMockResponse } = await import("../../lib/llm/mocks");
      const { CopyRewriteOutputSchema } = await import("../../lib/llm/types");

      const mockResponse = getMockResponse("copy_rewriter");
      expect(mockResponse).toBeTruthy();

      const parsed = JSON.parse(mockResponse!);
      expect(() => CopyRewriteOutputSchema.parse(parsed)).not.toThrow();
    });
  });
});
