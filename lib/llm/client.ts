/**
 * LLM Client
 * Server-only module for OpenAI-compatible LLM with rate limiting, timeout, and token budgeting
 */

import OpenAI from "openai";
import { LLM_CONFIG, CHARS_PER_TOKEN } from "./config";
import { LLMResponse, LLMUsage, LLMError } from "./types";
import { getMockResponse } from "./mocks";

// Rate limiting state
class RateLimiter {
  private requests: number[] = [];
  private activeRequests = 0;

  canMakeRequest(): boolean {
    this.cleanup();
    return (
      this.activeRequests < LLM_CONFIG.maxConcurrentRequests &&
      this.requests.length < LLM_CONFIG.maxRequestsPerMinute
    );
  }

  async waitForSlot(): Promise<void> {
    while (!this.canMakeRequest()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      this.cleanup();
    }
  }

  registerRequest(): void {
    this.requests.push(Date.now());
    this.activeRequests++;
  }

  completeRequest(): void {
    this.activeRequests--;
  }

  private cleanup(): void {
    const oneMinuteAgo = Date.now() - 60000;
    this.requests = this.requests.filter((time) => time > oneMinuteAgo);
  }
}

const rateLimiter = new RateLimiter();

// Token budget tracker
class TokenBudget {
  private usageLog: Array<{
    timestamp: number;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }> = [];

  logUsage(usage: LLMUsage): void {
    if (!LLM_CONFIG.logUsage) return;

    this.usageLog.push({
      timestamp: Date.now(),
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
    });

    console.log("[LLM Usage]", {
      prompt: usage.promptTokens,
      completion: usage.completionTokens,
      total: usage.totalTokens,
    });
  }

  getRecentUsage(minutes: number = 60): {
    requests: number;
    totalTokens: number;
  } {
    const cutoff = Date.now() - minutes * 60000;
    const recent = this.usageLog.filter((log) => log.timestamp > cutoff);

    return {
      requests: recent.length,
      totalTokens: recent.reduce((sum, log) => sum + log.totalTokens, 0),
    };
  }
}

const tokenBudget = new TokenBudget();

// OpenAI client
let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: LLM_CONFIG.endpoint,
      timeout: LLM_CONFIG.requestTimeout,
    });
  }
  return openaiClient;
}

// Estimate token count (rough approximation)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

// Validate prompt length
function validatePromptLength(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number
): { valid: boolean; error?: string } {
  const estimatedTokens =
    estimateTokens(systemPrompt) + estimateTokens(userPrompt);

  if (estimatedTokens > LLM_CONFIG.maxPromptTokens) {
    return {
      valid: false,
      error: `Prompt too long: ~${estimatedTokens} tokens (max: ${LLM_CONFIG.maxPromptTokens})`,
    };
  }

  if (estimatedTokens + maxTokens > LLM_CONFIG.maxTokensPerRequest) {
    return {
      valid: false,
      error: `Total tokens would exceed limit: ~${estimatedTokens + maxTokens} (max: ${LLM_CONFIG.maxTokensPerRequest})`,
    };
  }

  return { valid: true };
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  attempt: number = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    const apiError = error as { status?: number };

    // Don't retry certain errors
    if (
      apiError.status === 401 ||
      apiError.status === 403 ||
      apiError.status === 400
    ) {
      throw error;
    }

    if (attempt >= LLM_CONFIG.retryAttempts) {
      throw error;
    }

    const delay = LLM_CONFIG.retryDelay * Math.pow(2, attempt - 1);
    console.log(`[LLM] Retry attempt ${attempt} after ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithBackoff(fn, attempt + 1);
  }
}

// Main LLM call function
export interface LLMCallOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  mockKey?: string; // For development/testing
}

export async function callLLM(
  options: LLMCallOptions
): Promise<LLMResponse<string>> {
  const {
    systemPrompt,
    userPrompt,
    temperature = 0.7,
    maxTokens = 2000,
    jsonMode = false,
    mockKey,
  } = options;

  // Use mock response in development if enabled
  if (LLM_CONFIG.useMockResponses && mockKey) {
    const mockResponse = getMockResponse(mockKey);
    if (mockResponse) {
      return {
        content: mockResponse,
        cached: true,
      };
    }
  }

  // Validate prompt length
  const validation = validatePromptLength(systemPrompt, userPrompt, maxTokens);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Wait for rate limit slot
  await rateLimiter.waitForSlot();
  rateLimiter.registerRequest();

  try {
    const response = await retryWithBackoff(async () => {
      const client = getClient();
      return await client.chat.completions.create({
        model: LLM_CONFIG.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
        ...(jsonMode && { response_format: { type: "json_object" } }),
      });
    });

    const content = response.choices[0]?.message?.content || "";
    const usage: LLMUsage | undefined = response.usage
      ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : undefined;

    if (usage) {
      tokenBudget.logUsage(usage);
    }

    return { content, usage };
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    console.error("[LLM Error]", apiError.message || String(error));

    // Return structured error information
    const llmError: LLMError = {
      type: apiError.status === 429 ? "rate_limit" : "api_error",
      message: apiError.message || "Unknown error",
      retryable:
        apiError.status === 429 ||
        (apiError.status !== undefined && apiError.status >= 500),
    };

    throw llmError;
  } finally {
    rateLimiter.completeRequest();
  }
}

// Batch multiple LLM calls with controlled concurrency
export async function batchLLMCalls<T>(
  calls: Array<() => Promise<T>>
): Promise<Array<T | LLMError>> {
  const results: Array<T | LLMError> = [];

  for (const call of calls) {
    try {
      const result = await call();
      results.push(result);
    } catch (error: unknown) {
      results.push(error as LLMError);
    }
  }

  return results;
}

// Parallel execution with concurrency limit
export async function parallelLLMCalls<T>(
  calls: Array<() => Promise<T>>,
  concurrency: number = LLM_CONFIG.maxConcurrentRequests
): Promise<Array<T | LLMError>> {
  const results: Array<T | LLMError> = new Array(calls.length);
  const executing: Promise<void>[] = [];

  for (let i = 0; i < calls.length; i++) {
    const promise = (async (index: number) => {
      try {
        results[index] = await calls[index]();
      } catch (error: unknown) {
        results[index] = error as LLMError;
      }
    })(i);

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// Get usage statistics
export function getUsageStats(minutes: number = 60) {
  return tokenBudget.getRecentUsage(minutes);
}
