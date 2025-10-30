# Deterministic Scoring Engine

A comprehensive scoring system that analyzes landing pages, proposals, and marketing content to provide actionable insights and optimization recommendations.

## Overview

The scoring engine processes HTML or PDF content and computes multiple metrics to evaluate the effectiveness of marketing materials. It provides:

- **Deterministic scoring** based on proven conversion factors
- **Six dimension scores**: Value, Urgency, Certainty, Effort, Specificity, and Proof
- **Six metric checks**: Proof Density, Numbers Per 500 Words, CTA Detection, Guarantee Parsing, Time to First Value, and Mechanism Presence
- **EV lift calculations** for optimization recommendations
- **Prioritized improvement suggestions** ranked by EV per hour

## Usage

### Basic Usage

```typescript
import { analyzeContent } from "@/lib/scoring/api";

// Analyze HTML content
const result = await analyzeContent({
  type: "html",
  content: "<html><body>Your landing page content...</body></html>",
});

if (result.success) {
  console.log("Overall Score:", result.result.overallScore);
  console.log("Dimension Scores:", result.result.dimensionScores);
  console.log("Top Improvement:", result.result.leverDeltas[0]);
}
```

### Analyze Files

```typescript
import { analyzeHTMLFile, analyzePDFFile } from "@/lib/scoring/api";

// Analyze HTML file
const htmlResult = await analyzeHTMLFile("./landing-page.html");

// Analyze PDF file
const pdfResult = await analyzePDFFile("./proposal.pdf");
```

### Direct Parsing and Scoring

```typescript
import { parseHTML, calculateScores } from "@/lib/scoring";

const parsed = await parseHTML(htmlString);
const scores = calculateScores(parsed);
```

## Scoring Model

### Dimension Weights

- **Value**: 22% - How valuable is the offer?
- **Urgency**: 16% - How urgent is the need to act?
- **Certainty**: 22% - How certain is the outcome?
- **Effort**: 14% - How easy is it to get started?
- **Specificity**: 14% - How specific are the claims?
- **Proof**: 12% - How much evidence is provided?

### Metrics

#### 1. Proof Density

Counts proof elements like percentages, dollar amounts, multipliers, testimonials, case studies, and data references. Higher density indicates more credible claims.

#### 2. Numbers Per 500 Words

Tracks the frequency of specific numbers and statistics. Ideal range: 10-30 per 500 words.

#### 3. CTA Detection

Identifies calls-to-action in text and links. Evaluates quantity and quality of CTAs.

#### 4. Guarantee Parsing

Detects and scores different types of guarantees:

- Money-back guarantee: 100 points
- 100% satisfaction guarantee: 100 points
- Time-based guarantee: 90 points
- Risk-free: 85 points
- Free trial: 75 points

#### 5. Time to First Value

Measures indicators of quick value delivery (e.g., "in 5 minutes", "instant", "immediate").

#### 6. Mechanism Presence

Evaluates whether the solution explains "how it works" with step-by-step processes.

## EV Lift Mapping

Each lever has an associated expected value (EV) lift percentage:

- **Guarantee**: 20%
- **CTA**: 18%
- **Mechanism**: 16%
- **Proof**: 15%
- **Time to Value**: 14%
- **Numbers**: 12%

## Output Structure

```typescript
interface ScoringResult {
  overallScore: number; // 0-100
  dimensionScores: {
    value: number;
    urgency: number;
    certainty: number;
    effort: number;
    specificity: number;
    proof: number;
  };
  metrics: {
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

## Safe Fallbacks

The scoring engine includes comprehensive error handling:

- **Parsing failures**: Returns success=false with error message
- **Missing data**: Returns zero scores with descriptive messages
- **Invalid input**: Validates content type and format
- **Edge cases**: Handles empty content, malformed HTML, etc.

All functions are designed to never throw uncaught exceptions, always returning structured results.

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with UI:

```bash
npm run test:ui
```

## Test Fixtures

The following fixtures are available in `/fixtures`:

- `saas_lp_good.html` - High-quality SaaS landing page
- `agency_lp_weak.html` - Low-quality agency landing page
- `proposal.txt` - Business proposal content

## Integration

The scoring service is designed to be merged with LLM outputs. The deterministic scores provide a foundation that can be enhanced with AI-generated insights.

Example integration:

```typescript
import { analyzeContent } from "@/lib/scoring/api";
import { getLLMRecommendations } from "@/lib/ai";

const deterministicResult = await analyzeContent({ type: "html", content });
const llmResult = await getLLMRecommendations(content);

const mergedResult = {
  ...deterministicResult.result,
  llmInsights: llmResult.insights,
  combinedRecommendations: mergeLeverDeltas(
    deterministicResult.result.leverDeltas,
    llmResult.recommendations
  ),
};
```
