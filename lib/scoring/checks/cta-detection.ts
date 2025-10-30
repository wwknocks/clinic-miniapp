import { MetricCheck, ParsedContent } from "../models/types";

const CTA_PATTERNS = [
  /\bget started\b/gi,
  /\bsign up\b/gi,
  /\btry (it )?free\b/gi,
  /\bstart (your )?free trial\b/gi,
  /\bbook (a )?demo\b/gi,
  /\bschedule (a )?call\b/gi,
  /\bcontact (us|sales)\b/gi,
  /\brequest (a )?quote\b/gi,
  /\blearn more\b/gi,
  /\bdownload\b/gi,
  /\bsubscribe\b/gi,
  /\bbuy now\b/gi,
  /\bshop now\b/gi,
  /\bget (a )?quote\b/gi,
  /\bsee pricing\b/gi,
];

export function detectCTA(content: ParsedContent): MetricCheck {
  if (!content.success) {
    return {
      name: "CTA Detection",
      value: 0,
      rawValue: false,
      description: "Call-to-action presence and quality",
    };
  }

  let ctaCount = 0;
  const foundCTAs: string[] = [];

  for (const pattern of CTA_PATTERNS) {
    const matches = content.text.match(pattern);
    if (matches) {
      ctaCount += matches.length;
      foundCTAs.push(...matches.slice(0, 3));
    }
  }

  const linkCTAs = content.links.filter((link) => {
    return CTA_PATTERNS.some((pattern) => pattern.test(link.text));
  }).length;

  ctaCount += linkCTAs;

  let score = 0;
  if (ctaCount === 0) {
    score = 0;
  } else if (ctaCount === 1) {
    score = 50;
  } else if (ctaCount <= 3) {
    score = 80;
  } else if (ctaCount <= 5) {
    score = 100;
  } else {
    score = Math.max(100 - (ctaCount - 5) * 5, 60);
  }

  return {
    name: "CTA Detection",
    value: score,
    rawValue: ctaCount,
    description: `Found ${ctaCount} call-to-action elements`,
  };
}
