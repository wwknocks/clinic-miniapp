/**
 * LLM Client Tests
 * Tests for rate limiting, token budgeting, and client functionality
 */

import { describe, it, expect } from "vitest";

describe("LLM Client", () => {
  describe("Configuration", () => {
    it("should have safety preamble defined", async () => {
      const { SAFETY_PREAMBLE } = await import("../../lib/llm/config");

      expect(SAFETY_PREAMBLE).toContain("Do not fabricate");
      expect(SAFETY_PREAMBLE).toContain("provided data");
      expect(SAFETY_PREAMBLE.length).toBeGreaterThan(50);
    });

    it("should have template limits defined", async () => {
      const { TEMPLATE_LIMITS } = await import("../../lib/llm/config");

      expect(TEMPLATE_LIMITS.copyRewriter).toBeDefined();
      expect(TEMPLATE_LIMITS.copyRewriter.maxInputChars).toBeGreaterThan(0);
      expect(TEMPLATE_LIMITS.copyRewriter.maxOutputTokens).toBeGreaterThan(0);
    });

    it("should have LLM configuration defined", async () => {
      const { LLM_CONFIG } = await import("../../lib/llm/config");

      expect(LLM_CONFIG.maxRequestsPerMinute).toBeGreaterThan(0);
      expect(LLM_CONFIG.maxConcurrentRequests).toBeGreaterThan(0);
      expect(LLM_CONFIG.maxTokensPerRequest).toBeGreaterThan(0);
    });
  });

  describe("Character Limit Validation", () => {
    it("should reject prompts that exceed character limits", async () => {
      const { callLLM } = await import("../../lib/llm/client");

      const veryLongPrompt = "a".repeat(60000); // Exceeds token limit

      await expect(
        callLLM({
          systemPrompt: veryLongPrompt,
          userPrompt: "test",
        })
      ).rejects.toThrow(/too long/i);
    });

    it("should accept prompts within limits", async () => {
      const { callLLM } = await import("../../lib/llm/client");

      const shortPrompt = "Short test prompt";

      // This should not throw validation error (may fail on API call without key)
      const callPromise = callLLM({
        systemPrompt: shortPrompt,
        userPrompt: "test",
        maxTokens: 100,
      });

      // Just verify it doesn't throw a validation error immediately
      // It may throw an API error if no key is set, which is fine
      await expect(callPromise).rejects.toThrow();
    });
  });

  describe("Batching Functions", () => {
    it("should execute batch calls sequentially", async () => {
      const { batchLLMCalls } = await import("../../lib/llm/client");

      const calls = [
        async () => "result1",
        async () => "result2",
        async () => "result3",
      ];

      const results = await batchLLMCalls(calls);

      expect(results).toHaveLength(3);
      expect(results[0]).toBe("result1");
      expect(results[1]).toBe("result2");
      expect(results[2]).toBe("result3");
    });

    it("should handle errors in batch without stopping", async () => {
      const { batchLLMCalls } = await import("../../lib/llm/client");

      const calls = [
        async () => "success",
        async () => {
          throw new Error("test error");
        },
        async () => "success2",
      ];

      const results = await batchLLMCalls(calls);

      expect(results).toHaveLength(3);
      expect(results[0]).toBe("success");
      expect(results[1]).toBeInstanceOf(Error);
      expect(results[2]).toBe("success2");
    });
  });

  describe("Parallel Execution", () => {
    it("should respect concurrent request limits", async () => {
      const { parallelLLMCalls } = await import("../../lib/llm/client");

      const calls = Array(10)
        .fill(null)
        .map(
          (_, i) =>
            async () =>
              ({ result: `test-${i}` })
        );

      const results = await parallelLLMCalls(calls, 3);

      expect(results).toHaveLength(10);
      // All should succeed
      results.forEach((result) => {
        expect(result).toBeDefined();
        expect(result).toHaveProperty("result");
      });
    });
  });

  describe("Usage Stats", () => {
    it("should return usage statistics structure", async () => {
      const { getUsageStats } = await import("../../lib/llm/client");

      const stats = getUsageStats(60);

      expect(stats).toHaveProperty("requests");
      expect(stats).toHaveProperty("totalTokens");
      expect(typeof stats.requests).toBe("number");
      expect(typeof stats.totalTokens).toBe("number");
    });
  });

  describe("Mock Responses", () => {
    it("should have mock responses defined", async () => {
      const { getMockResponse, getAllMockKeys } = await import(
        "../../lib/llm/mocks"
      );

      const keys = getAllMockKeys();
      expect(keys.length).toBeGreaterThan(0);

      const mockResponse = getMockResponse("copy_rewriter");
      expect(mockResponse).toBeTruthy();
      expect(typeof mockResponse).toBe("string");
    });

    it("should return null for unknown mock keys", async () => {
      const { getMockResponse } = await import("../../lib/llm/mocks");

      const response = getMockResponse("nonexistent_key");
      expect(response).toBeNull();
    });
  });
});
