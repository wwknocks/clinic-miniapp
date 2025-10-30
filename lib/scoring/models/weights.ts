import { ScoringWeights } from "./types";

export const DEFAULT_WEIGHTS: ScoringWeights = {
  value: 0.22,
  urgency: 0.16,
  certainty: 0.22,
  effort: 0.14,
  specificity: 0.14,
  proof: 0.12,
};

export const LEVER_TO_EV_LIFT: Record<string, number> = {
  proof: 0.15,
  numbers: 0.12,
  cta: 0.18,
  guarantee: 0.20,
  timeToValue: 0.14,
  mechanism: 0.16,
};

export const ESTIMATED_HOURS: Record<string, number> = {
  proof: 4,
  numbers: 2,
  cta: 3,
  guarantee: 5,
  timeToValue: 6,
  mechanism: 8,
};
