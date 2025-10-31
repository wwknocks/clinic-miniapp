import { MetricCheck, ParsedContent } from "../models/types";

const VALUE_PATTERNS = [
  /\bin (\d+) (minutes?|hours?|days?|seconds?)\b/gi,
  /\b(\d+)[- ](minute|hour|day|second)\b/gi,
  /\binstant(ly)?\b/gi,
  /\bimmediate(ly)?\b/gi,
  /\bright (now|away)\b/gi,
  /\bquick(ly)?\b/gi,
  /\bfast\b/gi,
  /\bin seconds\b/gi,
  /\bno setup\b/gi,
  /\bzero setup\b/gi,
  /\bplug[- ]and[- ]play\b/gi,
  /\bread?y to use\b/gi,
  /\bget started in\b/gi,
];

export function calculateTimeToFirstValue(content: ParsedContent): MetricCheck {
  if (!content.success) {
    return {
      name: "Time to First Value",
      value: 0,
      rawValue: "unknown",
      description: "Speed of value delivery indicators",
      confidence: 0.2,
    };
  }

  const matches: string[] = [];
  let score = 0;

  for (const pattern of VALUE_PATTERNS) {
    const found = content.text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }

  if (matches.length === 0) {
    return {
      name: "Time to First Value",
      value: 0,
      rawValue: "none",
      description: "No time-to-value indicators found",
      confidence: Math.min(1, Math.max(0.5, content.wordCount / 200)),
    };
  }

  const timeMatch = content.text.match(
    /\bin (\d+) (minute|hour|day|second)s?\b/gi
  );
  if (timeMatch) {
    const firstMatch = timeMatch[0];
    const timeValue = parseInt(firstMatch.match(/\d+/)?.[0] || "0");
    const unit = firstMatch
      .match(/(minute|hour|day|second)/i)?.[0]
      .toLowerCase();

    if (unit === "second" || unit === "minute") {
      score = 100;
    } else if (unit === "hour") {
      if (timeValue <= 1) score = 90;
      else if (timeValue <= 24) score = 80;
      else score = 70;
    } else if (unit === "day") {
      if (timeValue === 1) score = 70;
      else if (timeValue <= 7) score = 60;
      else score = 50;
    }
  } else {
    score = 75;
  }

  const bonusScore = Math.min((matches.length - 1) * 3, 15);
  score = Math.min(score + bonusScore, 100);

  const confidence = Math.min(1, 0.6 + Math.min(matches.length, 5) * 0.08);

  return {
    name: "Time to First Value",
    value: score,
    rawValue: matches[0],
    description: `Found ${matches.length} time-to-value indicator(s)`,
    confidence,
  };
}
