import { MetricCheck, ParsedContent } from "../models/types";

const GUARANTEE_PATTERNS = [
  { pattern: /\b(\d+)[- ]day money[- ]back guarantee\b/gi, type: "money-back" },
  { pattern: /\b(\d+)[- ]day guarantee\b/gi, type: "time-based" },
  {
    pattern: /\b100% (money[- ]back|satisfaction) guarantee\b/gi,
    type: "full",
  },
  { pattern: /\bno questions asked\b/gi, type: "unconditional" },
  { pattern: /\bsatisfaction guaranteed\b/gi, type: "satisfaction" },
  { pattern: /\brisk[- ]free\b/gi, type: "risk-free" },
  { pattern: /\bfree trial\b/gi, type: "trial" },
  { pattern: /\bno credit card required\b/gi, type: "no-cc" },
  { pattern: /\bcancel anytime\b/gi, type: "cancel-anytime" },
];

export function parseGuarantee(content: ParsedContent): MetricCheck {
  if (!content.success) {
    return {
      name: "Guarantee Parsing",
      value: 0,
      rawValue: "unknown",
      description: "Guarantee type and strength",
    };
  }

  const foundGuarantees: Array<{ type: string; match: string }> = [];

  for (const { pattern, type } of GUARANTEE_PATTERNS) {
    const matches = content.text.match(pattern);
    if (matches) {
      foundGuarantees.push({
        type,
        match: matches[0],
      });
    }
  }

  if (foundGuarantees.length === 0) {
    return {
      name: "Guarantee Parsing",
      value: 0,
      rawValue: "none",
      description: "No guarantee found",
    };
  }

  const GUARANTEE_SCORES: Record<string, number> = {
    "money-back": 100,
    full: 100,
    "time-based": 90,
    unconditional: 95,
    satisfaction: 80,
    "risk-free": 85,
    trial: 75,
    "no-cc": 70,
    "cancel-anytime": 65,
  };

  const maxScore = Math.max(
    ...foundGuarantees.map((g) => GUARANTEE_SCORES[g.type] || 50)
  );

  const bonusScore = Math.min((foundGuarantees.length - 1) * 5, 15);

  return {
    name: "Guarantee Parsing",
    value: Math.min(maxScore + bonusScore, 100),
    rawValue: foundGuarantees.map((g) => g.type).join(", "),
    description: `Found ${foundGuarantees.length} guarantee(s): ${foundGuarantees[0].match}`,
  };
}
