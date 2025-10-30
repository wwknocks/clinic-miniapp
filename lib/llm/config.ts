/**
 * LLM Configuration
 * Server-only module for OpenAI-compatible LLM client configuration
 */

export const LLM_CONFIG = {
  // Model settings
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  endpoint: process.env.OPENAI_ENDPOINT || "https://api.openai.com/v1",

  // Rate limiting
  maxRequestsPerMinute: parseInt(
    process.env.LLM_MAX_REQUESTS_PER_MINUTE || "60",
    10
  ),
  maxConcurrentRequests: parseInt(
    process.env.LLM_MAX_CONCURRENT_REQUESTS || "5",
    10
  ),

  // Token budgeting
  maxTokensPerRequest: parseInt(
    process.env.LLM_MAX_TOKENS_PER_REQUEST || "4000",
    10
  ),
  maxPromptTokens: parseInt(process.env.LLM_MAX_PROMPT_TOKENS || "12000", 10),

  // Timeout settings (in milliseconds)
  requestTimeout: parseInt(process.env.LLM_REQUEST_TIMEOUT || "60000", 10),
  retryAttempts: parseInt(process.env.LLM_RETRY_ATTEMPTS || "3", 10),
  retryDelay: parseInt(process.env.LLM_RETRY_DELAY || "1000", 10),

  // Mock mode for development
  useMockResponses: process.env.LLM_USE_MOCKS === "true",

  // Logging
  logUsage: process.env.LLM_LOG_USAGE !== "false",
} as const;

// Template-specific limits
export const TEMPLATE_LIMITS = {
  copyRewriter: {
    maxInputChars: 8000,
    maxOutputTokens: 2000,
    temperature: 0.7,
  },
  objectionPack: {
    maxInputChars: 10000,
    maxOutputTokens: 3000,
    temperature: 0.8,
  },
  linkedInCarousel: {
    maxInputChars: 8000,
    maxOutputTokens: 2500,
    temperature: 0.7,
  },
  linkedInCaption: {
    maxInputChars: 5000,
    maxOutputTokens: 800,
    temperature: 0.8,
  },
  linkedInComment: {
    maxInputChars: 3000,
    maxOutputTokens: 400,
    temperature: 0.9,
  },
  linkedInDM: {
    maxInputChars: 5000,
    maxOutputTokens: 1500,
    temperature: 0.8,
  },
  abTestPlan: {
    maxInputChars: 10000,
    maxOutputTokens: 3500,
    temperature: 0.7,
  },
} as const;

// Safety preamble for all prompts
export const SAFETY_PREAMBLE = `IMPORTANT: You must base your response ONLY on the provided data and context. Do not fabricate information, make assumptions, or include speculative details. If information is missing or unclear, acknowledge it explicitly. Focus on deterministic analysis and actionable insights derived from the actual input.`;

// Character encoding estimate (rough estimate for token calculation)
export const CHARS_PER_TOKEN = 4;
