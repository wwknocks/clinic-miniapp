# LLM Module

Server-only module for OpenAI-compatible LLM integration with rate limiting, timeout controls, token budgeting, and reusable template system.

## Features

- **Rate Limiting**: Controls max requests per minute and concurrent requests
- **Token Budgeting**: Tracks and enforces token limits per request
- **Timeout Handling**: Configurable request timeouts with retry logic
- **Error Handling**: Graceful fallbacks and structured error responses
- **Mock Mode**: Use fixture responses for local development without API keys
- **Usage Logging**: Track token consumption for monitoring and optimization
- **Batching**: Execute multiple LLM calls efficiently
- **Prompt Templates**: Pre-built templates for common offer optimization tasks

## Configuration

### Environment Variables

Add these to your `.env.local` file:

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
LLM_REQUEST_TIMEOUT=60000        # milliseconds
LLM_RETRY_ATTEMPTS=3
LLM_RETRY_DELAY=1000             # milliseconds

# Development
LLM_USE_MOCKS=true               # Use mock responses (no API calls)
LLM_LOG_USAGE=true               # Log token usage to console
```

## Usage

### Basic LLM Call

```typescript
import { callLLM } from "@/lib/llm";

const response = await callLLM({
  systemPrompt: "You are a conversion optimization expert.",
  userPrompt: "Analyze this offer: ...",
  temperature: 0.7,
  maxTokens: 2000,
  jsonMode: true, // Force JSON output
});

console.log(response.content); // LLM response
console.log(response.usage); // Token usage stats
```

### Template Functions

#### 1. Copy Rewriter

Rewrites offer copy for maximum conversion:

```typescript
import { generateCopyRewrite } from "@/lib/llm";

const result = await generateCopyRewrite({
  currentCopy: "Transform your business with our solution",
  icp: "B2B SaaS founders, $1M-$10M ARR",
  primaryObjection: "Price concerns",
  valueProposition: "10x your conversion rate",
  proofPoints: ["5,000+ customers", "$500M revenue generated"],
});

console.log(result.content.headline);
console.log(result.content.subheadline);
console.log(result.content.cta);
console.log(result.content.body); // Array of paragraphs
console.log(result.content.reasoning);
```

#### 2. Objection Pack

Generates comprehensive objection handlers:

```typescript
import { generateObjectionPack } from "@/lib/llm";

const result = await generateObjectionPack({
  offer: "Full offer description...",
  icp: "Enterprise B2B buyers",
  pricePoint: "$50K annual",
  primaryObjections: ["Too expensive", "Not sure it works"],
  competitors: ["Competitor A", "Competitor B"],
});

console.log(result.content.handlers); // Array of objection handlers
console.log(result.content.preventative_copy); // Preemptive copy
console.log(result.content.trust_builders); // Trust elements
```

#### 3. LinkedIn Carousel

Creates LinkedIn carousel post content:

```typescript
import { generateLinkedInCarousel } from "@/lib/llm";

const result = await generateLinkedInCarousel({
  topic: "5 Conversion Killers Destroying Your Offer",
  keyPoints: ["Vague value propositions", "Missing social proof", "Weak CTAs"],
  targetAudience: "B2B marketers and founders",
  cta: "Get free offer analysis",
});

console.log(result.content.title);
console.log(result.content.hook);
result.content.slides.forEach((slide) => {
  console.log(slide.headline);
  console.log(slide.body);
  console.log(slide.visual_suggestion);
});
```

#### 4. LinkedIn Caption

Generates engaging LinkedIn post captions:

```typescript
import { generateLinkedInCaption } from "@/lib/llm";

const result = await generateLinkedInCaption({
  topic: "Offer optimization strategies",
  keyMessage: "Specificity beats generic messaging every time",
  targetAudience: "B2B marketers",
  tone: "thought-leader", // or "professional" | "casual"
  includeCTA: true,
});

console.log(result.content.hook);
console.log(result.content.body);
console.log(result.content.cta);
console.log(result.content.hashtags);
```

#### 5. LinkedIn Comments

Creates thoughtful engagement comments:

```typescript
import { generateLinkedInComments } from "@/lib/llm";

const result = await generateLinkedInComments({
  postContent: "Post you want to comment on...",
  responseAngle: "Agree and add personal experience",
  count: 5,
});

result.content.comments.forEach((comment) => {
  console.log(comment.text);
  console.log(comment.tone);
});
```

#### 6. LinkedIn DM Thread

Generates outreach message sequences:

```typescript
import { generateLinkedInDMThread } from "@/lib/llm";

const result = await generateLinkedInDMThread({
  prospect: "John Doe, VP Marketing at SaaS Co",
  context: "Engaged with my post about conversion optimization",
  goal: "Book a 15-min discovery call",
  valueOffer: "Free offer analysis tool",
});

result.content.messages.forEach((msg) => {
  console.log(msg.sequence_number);
  console.log(msg.message);
  console.log(msg.timing);
  console.log(msg.trigger);
});
```

#### 7. 7-Day A/B Test Plan

Creates structured testing roadmap:

```typescript
import { generate7DayABPlan } from "@/lib/llm";

const result = await generate7DayABPlan({
  currentMetrics: {
    conversionRate: 2.3,
    bounceRate: 58,
    avgTimeOnPage: "1:45",
  },
  offerDescription: "Full offer details...",
  targetAudience: "B2B SaaS companies",
  primaryWeaknesses: ["Vague headline", "No social proof"],
  testingGoals: ["Increase conversion rate by 30%"],
});

console.log(result.content.overview);
console.log(result.content.baseline_metrics);
result.content.test_days.forEach((day) => {
  console.log(`Day ${day.day}: ${day.focus}`);
  console.log(day.variants);
  console.log(day.success_criteria);
});
```

### Batching and Parallelization

Execute multiple LLM calls efficiently:

```typescript
import { batchLLMCalls, parallelLLMCalls } from "@/lib/llm";

// Sequential execution with error handling
const results = await batchLLMCalls([
  async () => generateCopyRewrite(input1),
  async () => generateObjectionPack(input2),
  async () => generateLinkedInCaption(input3),
]);

// Parallel execution with concurrency limit
const parallelResults = await parallelLLMCalls(
  [
    async () => generateCopyRewrite(input1),
    async () => generateCopyRewrite(input2),
    async () => generateCopyRewrite(input3),
  ],
  3 // Max 3 concurrent requests
);

// Check for errors
results.forEach((result, index) => {
  if ("type" in result) {
    // LLMError
    console.error(`Call ${index} failed:`, result.message);
  } else {
    // Success
    console.log(`Call ${index} succeeded`);
  }
});
```

### Usage Tracking

Monitor token consumption:

```typescript
import { getUsageStats } from "@/lib/llm";

// Get usage from last 60 minutes
const stats = getUsageStats(60);
console.log(`Requests: ${stats.requests}`);
console.log(`Total tokens: ${stats.totalTokens}`);

// Get usage from last 24 hours
const dailyStats = getUsageStats(1440);
```

## Mock Mode for Development

When `LLM_USE_MOCKS=true`, the system uses pre-built fixture responses instead of making real API calls. This is useful for:

- Local development without API keys
- Running tests without API costs
- Consistent, deterministic responses
- Faster development iteration

Mock responses are defined in `lib/llm/mocks.ts` and cover all template functions.

## Safety Features

### Prompt Safety Preamble

All templates include a safety preamble that instructs the LLM to:

- Base responses ONLY on provided data
- Never fabricate information
- Acknowledge missing information explicitly
- Focus on deterministic analysis

### Character Limits

Each template enforces character limits to prevent:

- Token limit overruns
- Excessive costs
- Timeout issues

Limits are defined in `lib/llm/config.ts` and can be adjusted per template.

### Data Guards

- Input truncation for oversized prompts
- Schema validation for structured outputs
- Fallback values for parse errors
- Graceful error handling

## Error Handling

The system handles various error types:

```typescript
try {
  const result = await generateCopyRewrite(inputs);
} catch (error) {
  if ("type" in error) {
    // LLMError with structured info
    switch (error.type) {
      case "rate_limit":
        console.log("Rate limited, retry later");
        break;
      case "timeout":
        console.log("Request timed out");
        break;
      case "token_limit":
        console.log("Token budget exceeded");
        break;
      case "parse_error":
        console.log("Failed to parse response");
        break;
      case "api_error":
        console.log("API error:", error.message);
        break;
    }

    if (error.retryable) {
      // Can retry this request
    }
  }
}
```

## Testing

Run tests with:

```bash
npm test -- __tests__/llm
```

Tests cover:

- Rate limiting behavior
- Token budgeting
- Prompt character limit enforcement
- Safety preamble inclusion
- Template output validation
- Mock mode functionality
- Error handling and fallbacks
- Batching and parallelization

## Performance Considerations

1. **Rate Limiting**: Automatically throttles requests to stay within limits
2. **Concurrent Control**: Limits simultaneous API calls to prevent overload
3. **Token Budgeting**: Tracks and enforces token usage limits
4. **Retry Logic**: Exponential backoff for transient failures
5. **Timeouts**: Prevents hanging requests
6. **Input Truncation**: Automatically truncates oversized inputs

## Monitoring

Key metrics to track in production:

- Token usage per template type
- Request success/failure rates
- Average response times
- Rate limit hits
- Cost per analysis
- Cache hit rates (when caching implemented)

Usage is logged to console when `LLM_LOG_USAGE=true`.

## Best Practices

1. **Always use templates** for structured outputs instead of raw `callLLM()`
2. **Set mock mode** in development to avoid API costs
3. **Monitor usage stats** to optimize token consumption
4. **Use batching** for multiple related calls
5. **Provide specific context** for better results
6. **Include ICP details** in all template inputs
7. **Test with mocks** before deploying to production
8. **Review safety preamble** periodically to improve guardrails

## Extending

To add new templates:

1. Define types in `lib/llm/types.ts`
2. Add template limits to `lib/llm/config.ts`
3. Create template function in `lib/llm/templates.ts`
4. Add mock response to `lib/llm/mocks.ts`
5. Export from `lib/llm/index.ts`
6. Add tests to `__tests__/llm/templates.test.ts`
7. Update this README with usage examples

## Troubleshooting

### "Prompt too long" error

- Reduce input size or increase `LLM_MAX_PROMPT_TOKENS`
- Check that template limits are appropriate

### Rate limit errors

- Increase `LLM_MAX_REQUESTS_PER_MINUTE` if API plan allows
- Implement queuing/backoff in your application

### Timeout errors

- Increase `LLM_REQUEST_TIMEOUT`
- Reduce `maxTokens` for faster responses
- Check network connectivity

### Parse errors

- Verify JSON mode is enabled for structured outputs
- Check that schemas match expected output format
- Review fallback handling

### Mock responses not working

- Verify `LLM_USE_MOCKS=true` in environment
- Check that `mockKey` matches key in `mocks.ts`
- Ensure mock fixtures are valid JSON

## License

Internal use only.
