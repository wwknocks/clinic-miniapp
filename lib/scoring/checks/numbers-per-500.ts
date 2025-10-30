import { MetricCheck, ParsedContent } from "../models/types";

export function calculateNumbersPer500Words(
  content: ParsedContent
): MetricCheck {
  if (!content.success || content.wordCount === 0) {
    return {
      name: "Numbers Per 500 Words",
      value: 0,
      rawValue: 0,
      description: "Count of specific numbers per 500 words",
    };
  }

  const numberPattern = /\b\d+(?:[.,]\d+)*(?:%|x|k|m|b)?\b/g;
  const matches = content.text.match(numberPattern);
  const numberCount = matches ? matches.length : 0;

  const per500 = (numberCount / content.wordCount) * 500;

  const idealRange = [10, 30];
  let score = 0;
  if (per500 < idealRange[0]) {
    score = (per500 / idealRange[0]) * 70;
  } else if (per500 <= idealRange[1]) {
    score = 70 + ((per500 - idealRange[0]) / (idealRange[1] - idealRange[0])) * 30;
  } else {
    score = Math.max(100 - (per500 - idealRange[1]) * 2, 50);
  }

  return {
    name: "Numbers Per 500 Words",
    value: Math.min(score, 100),
    rawValue: per500.toFixed(2),
    description: `Found ${numberCount} numbers (${per500.toFixed(1)} per 500 words)`,
  };
}
