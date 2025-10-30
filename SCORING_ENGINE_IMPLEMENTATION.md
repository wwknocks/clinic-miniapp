# Deterministic Scoring Engine Implementation

## Overview

A comprehensive deterministic scoring system has been implemented to analyze landing pages, proposals, and marketing content. The system provides actionable metrics, dimension scores, and prioritized improvement recommendations based on expected value (EV) lift calculations.

## Implementation Summary

### 1. Service Layer (`/lib/scoring`)

#### Core Components

**Parsers** (`/lib/scoring/parsers/`)

- `html-parser.ts` - Cheerio-based HTML parsing with safe fallbacks
- `pdf-parser.ts` - PDF parsing with text extraction
- Extracts: text content, word count, headings, links, images
- Handles errors gracefully without throwing exceptions

**Metric Checks** (`/lib/scoring/checks/`)

- `proof-density.ts` - Detects percentages, dollar amounts, testimonials, case studies
- `numbers-per-500.ts` - Counts and scores numeric specificity
- `cta-detection.ts` - Identifies call-to-action elements
- `guarantee-parsing.ts` - Parses guarantee types and strength
- `time-to-first-value.ts` - Measures speed-to-value indicators
- `mechanism-presence.ts` - Evaluates "how it works" explanations

**Scoring Model** (`/lib/scoring/models/`)

- `types.ts` - TypeScript interfaces for all data structures
- `weights.ts` - Dimension weights and EV lift mappings
  - Value: 22%
  - Urgency: 16%
  - Certainty: 22%
  - Effort: 14%
  - Specificity: 14%
  - Proof: 12%

**Service Function** (`/lib/scoring/scoring-service.ts`)

- `calculateScores()` - Main scoring algorithm
- Computes dimension scores from metrics
- Calculates overall weighted score
- Generates lever deltas with EV/hour rankings

**API Layer** (`/lib/scoring/api.ts`)

- `analyzeContent()` - Analyze HTML or PDF content
- `analyzeHTMLFile()` - Analyze HTML files by path
- `analyzePDFFile()` - Analyze PDF files by path
- Comprehensive error handling
- Typed results for downstream consumption

### 2. EV Lift Mapping

Each improvement lever has been mapped to expected value lift percentages:

| Lever         | EV Lift % | Estimated Hours |
| ------------- | --------- | --------------- |
| Guarantee     | 20%       | 5               |
| CTA           | 18%       | 3               |
| Mechanism     | 16%       | 8               |
| Proof         | 15%       | 4               |
| Time to Value | 14%       | 6               |
| Numbers       | 12%       | 2               |

**EV/Hour Calculation:**

```
EV/Hour = (EV Lift % × (Delta / 100)) / Estimated Hours
```

Lever deltas are sorted by EV/Hour to prioritize highest-impact, lowest-effort improvements.

### 3. Test Fixtures (`/fixtures`)

Three test fixtures have been created:

1. **`saas_lp_good.html`**
   - High-quality SaaS landing page
   - Strong proof elements, CTAs, guarantees
   - Overall score: ~85/100
   - Use case: Benchmark for good practices

2. **`agency_lp_weak.html`**
   - Low-quality agency landing page
   - Minimal proof, vague claims, weak CTAs
   - Overall score: ~5/100
   - Use case: Testing improvement recommendations

3. **`proposal.txt`**
   - Business proposal content
   - Mix of strengths and weaknesses
   - Use case: PDF-like content testing

### 4. Comprehensive Test Suite (`/__tests__/scoring`)

**65 tests total across 5 test files:**

1. **`parsers.test.ts`** (6 tests)
   - HTML parsing validation
   - Script/style tag removal
   - Fixture parsing
   - Malformed HTML handling

2. **`checks.test.ts`** (18 tests)
   - Each metric check with multiple scenarios
   - Zero/empty content handling
   - Parsing failure scenarios

3. **`scoring-service.test.ts`** (9 tests)
   - Overall scoring algorithm
   - Dimension weight application
   - Lever delta calculation and sorting
   - Fixture validation

4. **`edge-cases.test.ts`** (19 tests)
   - Whitespace-only HTML
   - Extremely long content
   - Special characters
   - Invalid HTML structure
   - Missing data
   - Consistency checks

5. **`api.test.ts`** (13 tests)
   - API function validation
   - Error handling
   - File analysis
   - Integration tests
   - Result consistency

### 5. Safe Fallbacks

The system includes comprehensive error handling:

- **Parser failures**: Return `success: false` with error message
- **Missing data**: Return zero scores with descriptive messages
- **Invalid inputs**: Validate types before processing
- **Malformed content**: Parse what's possible, fail gracefully
- **File errors**: Catch and return structured error responses

**No uncaught exceptions** - all functions return structured results.

### 6. API Usage

```typescript
// Basic usage
import { analyzeContent } from "@/lib/scoring";

const result = await analyzeContent({
  type: "html",
  content: htmlString,
});

if (result.success) {
  console.log("Score:", result.result.overallScore);
  console.log("Top fix:", result.result.leverDeltas[0]);
}

// File analysis
import { analyzeHTMLFile } from "@/lib/scoring";

const result = await analyzeHTMLFile("./landing-page.html");
```

### 7. Results Structure

```typescript
interface ScoringResult {
  overallScore: number; // 0-100 weighted score
  dimensionScores: {
    // Individual dimensions
    value: number;
    urgency: number;
    certainty: number;
    effort: number;
    specificity: number;
    proof: number;
  };
  metrics: {
    // Raw metric checks
    proofDensity: MetricCheck;
    numbersPerFiveHundredWords: MetricCheck;
    ctaDetection: MetricCheck;
    guaranteeParsing: MetricCheck;
    timeToFirstValue: MetricCheck;
    mechanismPresence: MetricCheck;
  };
  leverDeltas: LeverDelta[]; // Sorted by EV/hour
  timestamp: string;
}
```

### 8. Example Output

For the good SaaS fixture:

- **Overall Score**: 85.43
- **Top Improvement**: Numbers (3.00% EV/Hour, 2 hours estimated)
- **Strongest Areas**: Time to Value (100), Guarantee (100)
- **Weakest Area**: Numbers (50.00)

For the weak agency fixture:

- **Overall Score**: 5.04
- **Top Improvement**: CTA (6.00% EV/Hour, 3 hours estimated)
- **All metrics score poorly**, indicating multiple improvement opportunities

## CI/CD Integration

Tests run via:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # UI mode
```

All 65 tests pass in CI, ensuring:

- Deterministic analysis produces expected results
- Edge cases are handled properly
- Scoring math is correct
- API returns typed results
- Safe fallbacks prevent exceptions

## Merging with LLM Outputs

The deterministic results can be merged with LLM-generated insights:

```typescript
const deterministicResult = await analyzeContent({ type: "html", content });
const llmResult = await getLLMAnalysis(content);

const merged = {
  ...deterministicResult.result,
  llmInsights: llmResult.suggestions,
  enhancedRecommendations: combineLeverDeltas(
    deterministicResult.result.leverDeltas,
    llmResult.recommendations
  ),
};
```

## Files Created

### Source Files (12)

- `/lib/scoring/models/types.ts`
- `/lib/scoring/models/weights.ts`
- `/lib/scoring/parsers/html-parser.ts`
- `/lib/scoring/parsers/pdf-parser.ts`
- `/lib/scoring/parsers/index.ts`
- `/lib/scoring/checks/proof-density.ts`
- `/lib/scoring/checks/numbers-per-500.ts`
- `/lib/scoring/checks/cta-detection.ts`
- `/lib/scoring/checks/guarantee-parsing.ts`
- `/lib/scoring/checks/time-to-first-value.ts`
- `/lib/scoring/checks/mechanism-presence.ts`
- `/lib/scoring/checks/index.ts`
- `/lib/scoring/scoring-service.ts`
- `/lib/scoring/api.ts`
- `/lib/scoring/index.ts`
- `/lib/scoring/README.md`
- `/lib/scoring/example.ts`

### Test Files (5)

- `/__tests__/scoring/parsers.test.ts`
- `/__tests__/scoring/checks.test.ts`
- `/__tests__/scoring/scoring-service.test.ts`
- `/__tests__/scoring/edge-cases.test.ts`
- `/__tests__/scoring/api.test.ts`

### Fixtures (3)

- `/fixtures/saas_lp_good.html`
- `/fixtures/agency_lp_weak.html`
- `/fixtures/proposal.txt`

### Configuration

- `/vitest.config.ts`
- Updated `/package.json` with test scripts

## Acceptance Criteria ✅

✅ **Deterministic analysis runs locally** - Demonstrated with example output showing 85.43 and 5.04 scores

✅ **Expected metrics and scores** - All six metrics calculating properly with appropriate weights

✅ **Tests cover each check** - 65 comprehensive tests including edge cases

✅ **Tests pass in CI** - All tests passing with 100% success rate

✅ **Service returns typed results** - Full TypeScript interfaces for all return types

✅ **Safe fallbacks** - No uncaught exceptions, all errors handled gracefully

✅ **Downstream consumption** - Clean API with `analyzeContent()`, `analyzeHTMLFile()`, etc.

## Next Steps

The scoring engine is ready for:

1. Integration with LLM-based analysis
2. UI dashboard visualization
3. API endpoint exposure
4. Real-time content analysis
5. A/B testing recommendations
6. Historical trend tracking
