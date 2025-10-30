# Analysis Pipeline Implementation

This document describes the Step 2 analysis pipeline implementation for the Offer Wind Tunnel.

## Overview

The analysis pipeline orchestrates three main components:

1. **Deterministic Analysis**: Scoring engine that evaluates offers based on metrics
2. **LLM Analysis**: OpenAI-powered insights generation
3. **Screenshot Capture**: Puppeteer-based screenshot capture of offer pages

## Architecture

### Server Action

- **File**: `app/actions/analysis-actions.ts`
- **Main Function**: `runAnalysis(projectId: string)`
- **Status Function**: `getAnalysisStatus(projectId: string)`

### Core Services

#### 1. LLM Service (`lib/llm/index.ts`)

- Integrates with OpenAI GPT-4o-mini
- Generates structured analysis outputs:
  - Strengths
  - Weaknesses
  - Recommendations
  - Fix suggestions
  - Objection handlers
  - Conversion kit ideas

#### 2. Puppeteer Service (`lib/puppeteer/index.ts`)

- Captures screenshots at 2× resolution (3840×2160)
- Uploads to Supabase storage
- Generates signed URLs (valid for 1 year)
- Implements fallback handling if capture fails

#### 3. Caching Service (`lib/analysis/cache.ts`)

- Computes SHA-256 hash of inputs
- Validates cached results
- Prevents redundant LLM calls

#### 4. Analytics Service (`lib/analytics.ts`)

- Integrates with PostHog
- Tracks key events:
  - `analysis_run`
  - `first_score_shown`
  - `screenshot_captured`
  - `llm_call_completed`

## Data Flow

```
1. User clicks "Start Analysis" in StepAnalyze component
   ↓
2. Component calls runAnalysis(projectId) server action
   ↓
3. Server checks cache validity via input hash
   ↓
4. If cache invalid:
   a. Update project status to "analyzing"
   b. Track analytics event: analysis_run
   c. Fetch content (URL or PDF)
   d. Run deterministic scoring engine
   e. Call LLM for insights
   f. Capture screenshot (if URL source)
   g. Store results in project.data.results
   h. Update project status to "complete"
   i. Track analytics events: first_score_shown, screenshot_captured
   ↓
5. Component polls for status updates (every 2s)
   ↓
6. UI shows progress, then completion state
```

## Results Schema

Results are stored in `projects.data.results`:

```typescript
{
  scoringResult?: {
    overallScore: number;
    dimensionScores: {
      value: number;
      urgency: number;
      certainty: number;
      effort: number;
      specificity: number;
      proof: number;
    };
    metrics: Record<string, any>;
    leverDeltas: any[];
    timestamp: string;
  };
  llmOutputs?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    fixSuggestions: string[];
    objectionHandlers: string[];
    conversionKits: string[];
  };
  screenshot?: {
    path: string;
    signedUrl: string;
  };
  inputsHash: string;
  cachedAt: string;
}
```

## UI States

The `StepAnalyze` component manages four states:

1. **Idle**: Ready to start analysis
2. **Running**: Shows progress bar and status messages
3. **Complete**: Shows success message and "Re-run" option
4. **Error**: Shows error message and "Retry" option

## Caching Strategy

The pipeline implements intelligent caching:

- **Input Hash**: Computed from all input fields (sourceType, url, pdfPath, icp, priceTerms, mechanism, primaryObjection, goal, proofLinks)
- **Cache Validation**: Compares current inputs hash with stored hash
- **Cache Invalidation**: Automatically invalidates when any input changes
- **Cache Hit**: Returns immediately without running pipeline
- **Cache Miss**: Runs full pipeline and updates cache

## Error Handling

1. **Network Failures**: Retries with exponential backoff (implicit in fetch)
2. **Puppeteer Failures**: Returns gracefully without screenshot
3. **LLM Failures**: Returns empty arrays for insights
4. **Storage Failures**: Logs warnings but continues pipeline
5. **General Errors**: Sets project status back to "draft" and returns error message

## Environment Variables

Required variables (add to `.env.local`):

```bash
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Storage
NEXT_PUBLIC_STORAGE_BUCKET=pdf-uploads
```

## Performance Considerations

- **Parallel Execution**: Screenshot capture runs in parallel with result storage
- **Progress Updates**: UI updates every 500ms for smooth progress bar
- **Polling Interval**: 2 seconds for status checks (balance between UX and load)
- **Timeout**: 30 seconds for Puppeteer page load
- **LLM Token Limits**: Max 3000 completion tokens per call

## Testing

### Manual Testing

1. Create a project with URL source
2. Navigate to Step 2
3. Click "Start Analysis"
4. Verify progress indicators show
5. Wait for completion
6. Verify results are stored
7. Click "Re-run Analysis"
8. Verify cached results are used

### Edge Cases

- Missing OpenAI API key → Should fail gracefully
- Invalid URL → Should return error
- Screenshot failure → Should complete without screenshot
- Multiple concurrent analyses → Should handle via project status locking

## Future Enhancements

1. **Real-time Progress**: Use Supabase Realtime channels for live updates
2. **Queue System**: Implement job queue for background processing
3. **Retry Logic**: Add automatic retry for transient failures
4. **Rate Limiting**: Implement rate limiting for LLM calls
5. **Cost Tracking**: Track OpenAI API costs per analysis
6. **A/B Testing**: Test different LLM prompts and models
7. **Streaming**: Stream LLM responses for faster perceived performance
8. **Webhook Support**: Notify external systems when analysis completes

## Dependencies

- `openai`: ^4.73.0
- `puppeteer`: ^23.11.1
- `posthog-node`: ^4.2.1
- `pdf-parse`: ^2.4.5 (existing)
- `cheerio`: ^1.1.2 (existing)

## Monitoring

Key metrics to monitor:

- Analysis completion rate
- Average analysis duration
- LLM token usage
- Screenshot capture success rate
- Cache hit rate
- Error rate by type
