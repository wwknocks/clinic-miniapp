import { MetricCheck, ParsedContent } from "../models/types";

const PROOF_INDICATORS = [
  /\b\d+%/g,
  /\$\d+/g,
  /\d+x\b/g,
  /increased by \d+/gi,
  /decreased by \d+/gi,
  /\d+ customers/gi,
  /\d+ users/gi,
  /\d+ clients/gi,
  /case study/gi,
  /testimonial/gi,
  /review/gi,
  /rating/gi,
  /\d+ stars/gi,
  /verified/gi,
  /proven/gi,
  /research shows/gi,
  /study found/gi,
  /data shows/gi,
];

export function calculateProofDensity(content: ParsedContent): MetricCheck {
  if (!content.success || content.wordCount === 0) {
    return {
      name: "Proof Density",
      value: 0,
      rawValue: 0,
      description: "Number of proof elements per 100 words",
      confidence: 0.2,
    };
  }

  let proofCount = 0;

  for (const pattern of PROOF_INDICATORS) {
    const matches = content.text.match(pattern);
    if (matches) {
      proofCount += matches.length;
    }
  }

  const density = (proofCount / content.wordCount) * 100;

  const normalizedScore = Math.min(density * 10, 100);

  const confidence = Math.min(1, Math.max(0.5, content.wordCount / 200));

  return {
    name: "Proof Density",
    value: normalizedScore,
    rawValue: proofCount,
    description: `Found ${proofCount} proof elements in ${content.wordCount} words`,
    confidence,
  };
}
