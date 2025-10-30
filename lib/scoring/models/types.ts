export interface ScoringWeights {
  value: number;
  urgency: number;
  certainty: number;
  effort: number;
  specificity: number;
  proof: number;
}

export interface MetricCheck {
  name: string;
  value: number;
  rawValue?: number | string | boolean;
  description?: string;
}

export interface LeverDelta {
  lever: string;
  currentScore: number;
  potentialScore: number;
  delta: number;
  evLiftPercentage: number;
  evPerHour?: number;
  estimatedHours?: number;
}

export interface DimensionScores {
  value: number;
  urgency: number;
  certainty: number;
  effort: number;
  specificity: number;
  proof: number;
}

export interface ScoringResult {
  overallScore: number;
  dimensionScores: DimensionScores;
  metrics: {
    proofDensity: MetricCheck;
    numbersPerFiveHundredWords: MetricCheck;
    ctaDetection: MetricCheck;
    guaranteeParsing: MetricCheck;
    timeToFirstValue: MetricCheck;
    mechanismPresence: MetricCheck;
  };
  leverDeltas: LeverDelta[];
  timestamp: string;
}

export interface ParsedContent {
  text: string;
  wordCount: number;
  headings: string[];
  links: Array<{ text: string; href: string }>;
  images: Array<{ alt: string; src: string }>;
  success: boolean;
  error?: string;
}
