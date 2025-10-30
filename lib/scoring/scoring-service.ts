import {
  ParsedContent,
  ScoringResult,
  DimensionScores,
  LeverDelta,
} from "./models/types";
import {
  DEFAULT_WEIGHTS,
  LEVER_TO_EV_LIFT,
  ESTIMATED_HOURS,
} from "./models/weights";
import {
  calculateProofDensity,
  calculateNumbersPer500Words,
  detectCTA,
  parseGuarantee,
  calculateTimeToFirstValue,
  detectMechanismPresence,
} from "./checks";

export function calculateScores(content: ParsedContent): ScoringResult {
  const proofDensity = calculateProofDensity(content);
  const numbersPerFiveHundredWords = calculateNumbersPer500Words(content);
  const ctaDetection = detectCTA(content);
  const guaranteeParsing = parseGuarantee(content);
  const timeToFirstValue = calculateTimeToFirstValue(content);
  const mechanismPresence = detectMechanismPresence(content);

  const dimensionScores: DimensionScores = {
    value: (guaranteeParsing.value + timeToFirstValue.value) / 2,
    urgency: (ctaDetection.value + timeToFirstValue.value) / 2,
    certainty: (proofDensity.value + guaranteeParsing.value) / 2,
    effort: timeToFirstValue.value,
    specificity:
      (numbersPerFiveHundredWords.value + mechanismPresence.value) / 2,
    proof: proofDensity.value,
  };

  const overallScore =
    dimensionScores.value * DEFAULT_WEIGHTS.value +
    dimensionScores.urgency * DEFAULT_WEIGHTS.urgency +
    dimensionScores.certainty * DEFAULT_WEIGHTS.certainty +
    dimensionScores.effort * DEFAULT_WEIGHTS.effort +
    dimensionScores.specificity * DEFAULT_WEIGHTS.specificity +
    dimensionScores.proof * DEFAULT_WEIGHTS.proof;

  const leverDeltas = calculateLeverDeltas({
    proof: proofDensity.value,
    numbers: numbersPerFiveHundredWords.value,
    cta: ctaDetection.value,
    guarantee: guaranteeParsing.value,
    timeToValue: timeToFirstValue.value,
    mechanism: mechanismPresence.value,
  });

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    dimensionScores,
    metrics: {
      proofDensity,
      numbersPerFiveHundredWords,
      ctaDetection,
      guaranteeParsing,
      timeToFirstValue,
      mechanismPresence,
    },
    leverDeltas,
    timestamp: new Date().toISOString(),
  };
}

function calculateLeverDeltas(
  leverScores: Record<string, number>
): LeverDelta[] {
  const deltas: LeverDelta[] = [];

  for (const [lever, currentScore] of Object.entries(leverScores)) {
    const potentialScore = 100;
    const delta = potentialScore - currentScore;
    const evLiftPercentage = LEVER_TO_EV_LIFT[lever] || 0;
    const estimatedHours = ESTIMATED_HOURS[lever] || 1;

    const evPerHour = (evLiftPercentage * (delta / 100)) / estimatedHours;

    deltas.push({
      lever,
      currentScore,
      potentialScore,
      delta,
      evLiftPercentage,
      evPerHour,
      estimatedHours,
    });
  }

  deltas.sort((a, b) => (b.evPerHour || 0) - (a.evPerHour || 0));

  return deltas;
}
