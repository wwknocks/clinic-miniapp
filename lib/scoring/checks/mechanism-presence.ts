import { MetricCheck, ParsedContent } from "../models/types";

const MECHANISM_PATTERNS = [
  /\bhow (it|this) works?\b/gi,
  /\bour process\b/gi,
  /\bour approach\b/gi,
  /\bour method(ology)?\b/gi,
  /\bstep[- ]by[- ]step\b/gi,
  /\b(first|second|third|1st|2nd|3rd|step \d)\b/gi,
  /\bhere'?s how\b/gi,
  /\bthe process\b/gi,
  /\bwe (start by|begin by|first)\b/gi,
  /\bthen we\b/gi,
  /\bfinally,? we\b/gi,
];

export function detectMechanismPresence(content: ParsedContent): MetricCheck {
  if (!content.success) {
    return {
      name: "Mechanism Presence",
      value: 0,
      rawValue: false,
      description: "Explanation of how the solution works",
    };
  }

  let mechanismScore = 0;
  const indicators: string[] = [];

  for (const pattern of MECHANISM_PATTERNS) {
    const matches = content.text.match(pattern);
    if (matches) {
      indicators.push(...matches.slice(0, 2));
    }
  }

  const hasHowItWorks = /\bhow (it|this) works?\b/gi.test(content.text);
  const hasProcess = /\b(our )?process\b/gi.test(content.text);
  const hasSteps = /\bstep[- ]by[- ]step\b/gi.test(content.text);

  const stepNumbers = content.text.match(
    /\b(step \d|[123]\.|first|second|third)\b/gi
  );
  const hasNumberedSteps = stepNumbers && stepNumbers.length >= 3;

  if (hasHowItWorks) mechanismScore += 30;
  if (hasProcess) mechanismScore += 20;
  if (hasSteps) mechanismScore += 25;
  if (hasNumberedSteps) mechanismScore += 25;

  if (indicators.length > 5) {
    mechanismScore = Math.min(mechanismScore + 10, 100);
  }

  return {
    name: "Mechanism Presence",
    value: mechanismScore,
    rawValue: indicators.length > 0,
    description: `Found ${indicators.length} mechanism indicator(s)`,
  };
}
