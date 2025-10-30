# LLM Templates Implementation

## Overview

Implemented a comprehensive OpenAI-compatible LLM integration system with bounded prompts, reusable templates, rate limiting, token budgeting, and batching capabilities.

## Implementation Details

### 1. Server-Only Module (`/lib/llm/`)

#### Files Created:

- **`config.ts`**: Configuration and constants
  - Rate limiting settings (requests per minute, concurrent requests)
  - Token budgeting (max tokens per request, max prompt tokens)
  - Timeout and retry configuration
  - Template-specific limits for each template type
  - Safety preamble to prevent fabrication
  - Mock mode settings for development

- **`client.ts`**: Enhanced OpenAI client wrapper
  - Rate limiter with concurrent request tracking
  - Token budget tracker with usage logging
  - Automatic retry with exponential backoff
  - Prompt length validation
  - Mock response support for development
  - Batching and parallelization functions
  - Structured error handling

- **`types.ts`**: TypeScript types and Zod schemas
  - Structured output types for all templates
  - Schema validation using Zod
  - LLM response and error types

- **`templates.ts`**: Template functions
  - Copy Rewriter
  - Objection Pack
  - LinkedIn Carousel
  - LinkedIn Caption
  - LinkedIn Comments
  - LinkedIn DM Thread
  - 7-Day A/B Test Plan
  - Input truncation helpers
  - JSON parsing with schema validation

- **`mocks.ts`**: Mock responses for development
  - Pre-built fixture responses for all templates
  - No API calls when `LLM_USE_MOCKS=true`
  - Consistent, deterministic responses for testing

- **`index.ts`**: Main export file
  - Re-exports all client functions
  - Re-exports all template functions
  - Re-exports types
  - Maintains backward compatibility with existing `generateOfferAnalysis`

- **`README.md`**: Comprehensive documentation
  - Configuration guide
  - Usage examples for all templates
  - Error handling
  - Testing guidelines
  - Performance considerations
  - Troubleshooting

### 2. Template Functions

#### Copy Rewriter

- Rewrites offer copy for maximum conversion
- Inputs: current copy, ICP, objections, value prop, proof points
- Output: headline, subheadline, CTA, body paragraphs, reasoning

#### Objection Pack

- Generates comprehensive objection handling
- Inputs: offer, ICP, price point, objections, competitors
- Output: handlers (objection, response, proof points, reframe), preventative copy, trust builders

#### LinkedIn Carousel

- Creates LinkedIn carousel post content
- Inputs: topic, key points, target audience, CTA
- Output: title, hook, slides (with visuals), CTA slide

#### LinkedIn Caption

- Generates engaging post captions
- Inputs: topic, key message, audience, tone
- Output: hook, body, CTA, hashtags

#### LinkedIn Comments

- Creates thoughtful engagement comments
- Inputs: post content, response angle, count
- Output: comments with varied tones

#### LinkedIn DM Thread

- Generates outreach message sequences
- Inputs: prospect, context, goal, value offer
- Output: sequenced messages with timing and triggers

#### 7-Day A/B Test Plan

- Creates structured testing roadmap
- Inputs: current metrics, offer description, audience, weaknesses, goals
- Output: overview, baseline metrics, test days (variants, success criteria), analysis framework, rollout strategy

### 3. Safety Features

#### Safety Preamble

All templates include a safety preamble that instructs the LLM to:

- Base responses ONLY on provided data
- Never fabricate information
- Acknowledge missing information explicitly
- Focus on deterministic analysis
- Avoid speculation and assumptions

#### Data Guards

- Input truncation for oversized prompts (character limits enforced per template)
- Prompt length validation before API calls
- Schema validation for structured outputs
- Fallback values for parse errors
- Graceful error handling with structured error types

#### Character Limits

Each template has specific character limits:

- Copy Rewriter: 8,000 chars input, 2,000 tokens output
- Objection Pack: 10,000 chars input, 3,000 tokens output
- LinkedIn Carousel: 8,000 chars input, 2,500 tokens output
- LinkedIn Caption: 5,000 chars input, 800 tokens output
- LinkedIn Comment: 3,000 chars input, 400 tokens output
- LinkedIn DM: 5,000 chars input, 1,500 tokens output
- A/B Test Plan: 10,000 chars input, 3,500 tokens output

### 4. Rate Limiting & Token Budgeting

#### Rate Limiting

- Max requests per minute: configurable (default: 60)
- Max concurrent requests: configurable (default: 5)
- Automatic queue management
- Request slot waiting mechanism

#### Token Budgeting

- Max tokens per request: configurable (default: 4,000)
- Max prompt tokens: configurable (default: 12,000)
- Automatic token estimation (~4 chars per token)
- Usage logging and tracking
- Usage statistics API

#### Timeout & Retry

- Request timeout: configurable (default: 60 seconds)
- Retry attempts: configurable (default: 3)
- Exponential backoff delay
- Smart error detection (don't retry 401, 403, 400)

### 5. Batching & Parallelization

#### Batch LLM Calls

- Sequential execution of multiple calls
- Error isolation (one failure doesn't stop others)
- Returns array of results or errors

#### Parallel LLM Calls

- Concurrent execution with concurrency limit
- Promise race management
- Maintains order of results

### 6. Configuration

#### Environment Variables

```bash
# Required
OPENAI_API_KEY=your-openai-api-key

# Optional - Defaults shown
OPENAI_MODEL=gpt-4o-mini
OPENAI_ENDPOINT=https://api.openai.com/v1

# Rate limiting
LLM_MAX_REQUESTS_PER_MINUTE=60
LLM_MAX_CONCURRENT_REQUESTS=5

# Token budgeting
LLM_MAX_TOKENS_PER_REQUEST=4000
LLM_MAX_PROMPT_TOKENS=12000

# Timeout and retries
LLM_REQUEST_TIMEOUT=60000
LLM_RETRY_ATTEMPTS=3
LLM_RETRY_DELAY=1000

# Development
LLM_USE_MOCKS=false
LLM_LOG_USAGE=true
```

### 7. Testing

#### Test Files

- `__tests__/llm/client.test.ts`: Client functionality tests
  - Configuration validation
  - Character limit enforcement
  - Batching and parallel execution
  - Usage statistics
  - Mock responses

- `__tests__/llm/templates.test.ts`: Template tests
  - Configuration validation
  - Safety features verification
  - Schema validation
  - Type definitions
  - Mock fixtures validation
  - Main index exports

#### Test Coverage

- ✅ Configuration validation
- ✅ Character limit enforcement
- ✅ Safety preamble inclusion
- ✅ Schema validation (Zod)
- ✅ Batching functionality
- ✅ Parallel execution
- ✅ Mock response system
- ✅ Export structure
- ✅ Type definitions

#### Test Results

All 28 tests passing:

- 11 client tests
- 17 template tests

### 8. Mock Mode for Development

#### Setup

Set `LLM_USE_MOCKS=true` in `.env.local`

#### Benefits

- No API keys required for development
- No API costs during development
- Consistent, deterministic responses
- Faster development iteration
- Works offline

#### Mock Fixtures

- Located in `/fixtures/llm-responses.json`
- JSON format with all template responses
- Also available programmatically in `lib/llm/mocks.ts`

### 9. Usage Logging

When `LLM_LOG_USAGE=true` (default):

- Token usage logged to console for each call
- Includes prompt tokens, completion tokens, total tokens
- Usage statistics available via `getUsageStats(minutes)`
- Useful for monitoring and cost optimization

### 10. Error Handling

#### Error Types

- `rate_limit`: Hit rate limit (retryable)
- `timeout`: Request timed out (retryable)
- `token_limit`: Exceeded token budget
- `parse_error`: Failed to parse response
- `api_error`: Generic API error

#### Structured Errors

All errors include:

- `type`: Error type
- `message`: Human-readable message
- `retryable`: Whether the error can be retried

### 11. Documentation

#### Locations

- `/lib/llm/README.md`: Comprehensive usage guide
- `.env.example`: Updated with all LLM configuration variables
- This file: Implementation summary
- JSDoc comments throughout codebase

#### Contents

- Configuration guide
- Usage examples for all templates
- API reference
- Error handling guide
- Testing guide
- Performance considerations
- Troubleshooting
- Best practices

## Acceptance Criteria ✅

### Template Functions Return Structured Outputs

✅ All 7 template functions return typed, structured outputs
✅ Schema validation using Zod ensures data integrity
✅ Fallback values for parse errors
✅ Ready for downstream consumption

### LLM Client Enforces Max Token Limits

✅ Token budgeting with configurable limits
✅ Prompt length validation before API calls
✅ Character-to-token estimation
✅ Usage tracking and logging
✅ Error handling with fallbacks (structured LLMError)

### Tests Validate Prompt Construction

✅ 28 tests covering all functionality
✅ Character limit validation tests
✅ Safety preamble verification tests
✅ Schema validation tests
✅ Mock response system tests
✅ All tests pass without requiring real API key

### Documentation for Configuring LLM

✅ Comprehensive README in `/lib/llm/README.md`
✅ All environment variables documented in `.env.example`
✅ Usage examples for all templates
✅ Configuration guide
✅ Troubleshooting section

## Additional Features

### Beyond Requirements

1. **Batching & Parallelization**: Minimize API calls through efficient batching strategies
2. **Usage Statistics**: Track token consumption for monitoring
3. **Mock Fixtures**: JSON fixtures for testing without API
4. **Retry Logic**: Exponential backoff for transient failures
5. **Rate Limiting**: Automatic request throttling
6. **Concurrent Control**: Limit simultaneous requests
7. **Type Safety**: Full TypeScript support with Zod validation
8. **Backward Compatibility**: Existing `generateOfferAnalysis` function maintained

### Code Quality

- ✅ No TypeScript errors
- ✅ No ESLint errors in LLM module
- ✅ Proper error handling with `unknown` instead of `any`
- ✅ Comprehensive JSDoc comments
- ✅ Follows existing code conventions

## Next Steps (Optional Enhancements)

1. **Caching**: Implement response caching with TTL
2. **Streaming**: Add streaming support for real-time responses
3. **Cost Tracking**: Track API costs per template type
4. **A/B Testing**: Test different prompts/models
5. **Queue System**: Background job processing
6. **Webhooks**: Notify external systems on completion
7. **Real-time Updates**: Supabase Realtime integration

## Usage Example

```typescript
import { generateCopyRewrite } from "@/lib/llm";

const result = await generateCopyRewrite({
  currentCopy: "Transform your business with our solution",
  icp: "B2B SaaS founders, $1M-$10M ARR",
  primaryObjection: "Price concerns",
});

console.log(result.content.headline);
console.log(result.content.body);
console.log(result.usage); // Token usage stats
```

## Files Modified/Created

### Created

- `/lib/llm/config.ts`
- `/lib/llm/client.ts`
- `/lib/llm/types.ts`
- `/lib/llm/templates.ts`
- `/lib/llm/mocks.ts`
- `/lib/llm/README.md`
- `/fixtures/llm-responses.json`
- `/__tests__/llm/client.test.ts`
- `/__tests__/llm/templates.test.ts`

### Modified

- `/lib/llm/index.ts` (refactored to use new client)
- `/.env.example` (added LLM configuration variables)

## Summary

Successfully implemented a production-ready LLM template system with:

- ✅ 7 reusable prompt templates
- ✅ Rate limiting and token budgeting
- ✅ Safety guards against fabrication
- ✅ Comprehensive testing (28 tests passing)
- ✅ Mock mode for development
- ✅ Full documentation
- ✅ Type-safe with Zod validation
- ✅ Efficient batching/parallelization
- ✅ Usage logging and monitoring
- ✅ Graceful error handling
