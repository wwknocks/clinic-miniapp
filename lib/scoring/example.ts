import { analyzeHTMLFile } from "./api";
import * as path from "path";

async function runExample() {
  console.log("=== Deterministic Scoring Engine Demo ===\n");

  console.log("Analyzing Good SaaS Landing Page...");
  const goodResult = await analyzeHTMLFile(
    path.join(process.cwd(), "fixtures", "saas_lp_good.html")
  );

  if (goodResult.success && goodResult.result) {
    console.log("\n📊 Overall Score:", goodResult.result.overallScore.toFixed(2));
    console.log("\n📈 Dimension Scores:");
    console.log("  • Value:", goodResult.result.dimensionScores.value.toFixed(2));
    console.log("  • Urgency:", goodResult.result.dimensionScores.urgency.toFixed(2));
    console.log("  • Certainty:", goodResult.result.dimensionScores.certainty.toFixed(2));
    console.log("  • Effort:", goodResult.result.dimensionScores.effort.toFixed(2));
    console.log("  • Specificity:", goodResult.result.dimensionScores.specificity.toFixed(2));
    console.log("  • Proof:", goodResult.result.dimensionScores.proof.toFixed(2));

    console.log("\n🎯 Metric Checks:");
    console.log("  • Proof Density:", goodResult.result.metrics.proofDensity.value.toFixed(2));
    console.log("  • Numbers Per 500:", goodResult.result.metrics.numbersPerFiveHundredWords.value.toFixed(2));
    console.log("  • CTA Detection:", goodResult.result.metrics.ctaDetection.value.toFixed(2));
    console.log("  • Guarantee:", goodResult.result.metrics.guaranteeParsing.value.toFixed(2));
    console.log("  • Time to Value:", goodResult.result.metrics.timeToFirstValue.value.toFixed(2));
    console.log("  • Mechanism:", goodResult.result.metrics.mechanismPresence.value.toFixed(2));

    console.log("\n💡 Top 3 Improvement Opportunities (by EV/Hour):");
    goodResult.result.leverDeltas.slice(0, 3).forEach((delta, idx) => {
      console.log(`  ${idx + 1}. ${delta.lever.toUpperCase()}`);
      console.log(`     Current Score: ${delta.currentScore.toFixed(2)}`);
      console.log(`     Potential Score: ${delta.potentialScore}`);
      console.log(`     Delta: ${delta.delta.toFixed(2)}`);
      console.log(`     EV Lift: ${(delta.evLiftPercentage * 100).toFixed(1)}%`);
      console.log(`     EV/Hour: ${(delta.evPerHour! * 100).toFixed(2)}%`);
      console.log(`     Estimated Hours: ${delta.estimatedHours}`);
      console.log();
    });
  }

  console.log("\n" + "=".repeat(50) + "\n");
  console.log("Analyzing Weak Agency Landing Page...");

  const weakResult = await analyzeHTMLFile(
    path.join(process.cwd(), "fixtures", "agency_lp_weak.html")
  );

  if (weakResult.success && weakResult.result) {
    console.log("\n📊 Overall Score:", weakResult.result.overallScore.toFixed(2));
    console.log("\n💡 Top 3 Improvement Opportunities (by EV/Hour):");
    weakResult.result.leverDeltas.slice(0, 3).forEach((delta, idx) => {
      console.log(`  ${idx + 1}. ${delta.lever.toUpperCase()}`);
      console.log(`     Current Score: ${delta.currentScore.toFixed(2)}`);
      console.log(`     Delta: ${delta.delta.toFixed(2)}`);
      console.log(`     EV/Hour: ${(delta.evPerHour! * 100).toFixed(2)}%`);
      console.log();
    });
  }
}

if (require.main === module) {
  runExample().catch(console.error);
}

export { runExample };
