import { describe, it, expect } from "vitest";
import { calculateScores } from "@/lib/scoring/scoring-service";
import { parseHTML } from "@/lib/scoring/parsers/html-parser";
import * as fs from "fs";
import * as path from "path";

describe("Scoring Service", () => {
  it("should calculate overall score correctly", async () => {
    const html = `
      <html>
        <body>
          <h1>Product Launch - 50% Off</h1>
          <p>Join 10,000+ customers who save 15 hours per week. Get started in 5 minutes.</p>
          <p>30-day money-back guarantee. 100% satisfaction guaranteed.</p>
          <p>How it works: Step 1: Sign up. Step 2: Configure. Step 3: Launch.</p>
          <a href="/signup">Get Started Free</a>
          <a href="/demo">Book a Demo</a>
          <p>Research shows 85% improvement. Case study with 100 clients proves 3x ROI.</p>
        </body>
      </html>
    `;

    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.dimensionScores).toHaveProperty("value");
    expect(result.dimensionScores).toHaveProperty("urgency");
    expect(result.dimensionScores).toHaveProperty("certainty");
    expect(result.dimensionScores).toHaveProperty("effort");
    expect(result.dimensionScores).toHaveProperty("specificity");
    expect(result.dimensionScores).toHaveProperty("proof");
  });

  it("should include all required metrics", async () => {
    const html = "<html><body><p>Test content</p></body></html>";
    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.metrics).toHaveProperty("proofDensity");
    expect(result.metrics).toHaveProperty("numbersPerFiveHundredWords");
    expect(result.metrics).toHaveProperty("ctaDetection");
    expect(result.metrics).toHaveProperty("guaranteeParsing");
    expect(result.metrics).toHaveProperty("timeToFirstValue");
    expect(result.metrics).toHaveProperty("mechanismPresence");
  });

  it("should calculate lever deltas sorted by EV per hour", async () => {
    const html = `
      <html>
        <body>
          <h1>Test Product</h1>
          <p>Some basic content without much optimization.</p>
        </body>
      </html>
    `;

    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.leverDeltas).toBeDefined();
    expect(result.leverDeltas.length).toBeGreaterThan(0);

    for (const delta of result.leverDeltas) {
      expect(delta).toHaveProperty("lever");
      expect(delta).toHaveProperty("currentScore");
      expect(delta).toHaveProperty("potentialScore");
      expect(delta).toHaveProperty("delta");
      expect(delta).toHaveProperty("evLiftPercentage");
      expect(delta).toHaveProperty("evPerHour");
      expect(delta).toHaveProperty("estimatedHours");
    }

    for (let i = 0; i < result.leverDeltas.length - 1; i++) {
      expect(result.leverDeltas[i].evPerHour).toBeGreaterThanOrEqual(
        result.leverDeltas[i + 1].evPerHour || 0
      );
    }
  });

  it("should apply correct dimension weights", async () => {
    const html = `
      <html>
        <body>
          <h1>Perfect Landing Page</h1>
          <p>Join 5,000 customers saving $10,000 annually. Get results in 5 minutes with our proven process.</p>
          <p>30-day money-back guarantee. No questions asked.</p>
          <p>How it works: Step 1: Sign up instantly. Step 2: Import in 2 minutes. Step 3: Start using immediately.</p>
          <a href="/signup">Start Free Trial</a>
          <a href="/demo">Book Demo</a>
          <p>85% of 1,000+ users report 3x ROI. Case study shows 50% increase in productivity.</p>
        </body>
      </html>
    `;

    const content = await parseHTML(html);
    const result = calculateScores(content);

    const manualScore =
      result.dimensionScores.value * 0.22 +
      result.dimensionScores.urgency * 0.16 +
      result.dimensionScores.certainty * 0.22 +
      result.dimensionScores.effort * 0.14 +
      result.dimensionScores.specificity * 0.14 +
      result.dimensionScores.proof * 0.12;

    expect(result.overallScore).toBeCloseTo(manualScore, 1);
  });

  it("should handle good SaaS landing page fixture", async () => {
    const fixturePath = path.join(
      process.cwd(),
      "fixtures",
      "saas_lp_good.html"
    );
    const html = fs.readFileSync(fixturePath, "utf-8");
    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.overallScore).toBeGreaterThan(60);
    expect(result.metrics.proofDensity.value).toBeGreaterThan(50);
    expect(result.metrics.ctaDetection.value).toBeGreaterThan(70);
    expect(result.metrics.guaranteeParsing.value).toBeGreaterThan(80);
    expect(result.metrics.mechanismPresence.value).toBeGreaterThan(60);
  });

  it("should handle weak agency landing page fixture", async () => {
    const fixturePath = path.join(
      process.cwd(),
      "fixtures",
      "agency_lp_weak.html"
    );
    const html = fs.readFileSync(fixturePath, "utf-8");
    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.overallScore).toBeLessThan(50);
    expect(result.metrics.proofDensity.value).toBeLessThan(30);
    expect(result.metrics.ctaDetection.value).toBeLessThan(30);
    expect(result.metrics.guaranteeParsing.value).toBeLessThan(20);
  });

  it("should include timestamp", async () => {
    const html = "<html><body><p>Test</p></body></html>";
    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("should handle empty content gracefully", async () => {
    const html = "<html><body></body></html>";
    const content = await parseHTML(html);
    const result = calculateScores(content);

    expect(result.overallScore).toBe(0);
    expect(result.dimensionScores.value).toBe(0);
    expect(result.dimensionScores.urgency).toBe(0);
  });

  it("should map EV lift percentages correctly", async () => {
    const html = "<html><body><p>Test</p></body></html>";
    const content = await parseHTML(html);
    const result = calculateScores(content);

    const expectedLifts: Record<string, number> = {
      proof: 0.15,
      numbers: 0.12,
      cta: 0.18,
      guarantee: 0.2,
      timeToValue: 0.14,
      mechanism: 0.16,
    };

    for (const delta of result.leverDeltas) {
      expect(delta.evLiftPercentage).toBe(expectedLifts[delta.lever]);
    }
  });
});
