import { describe, it, expect } from "vitest";
import { analyzeContent, analyzeHTMLFile } from "@/lib/scoring/api";
import * as path from "path";

describe("Scoring API", () => {
  describe("analyzeContent", () => {
    it("should analyze HTML content successfully", async () => {
      const html = `
        <html>
          <body>
            <h1>Product Launch - Save 50%</h1>
            <p>Join 5,000 customers saving $10,000 annually. Get started in 5 minutes.</p>
            <p>30-day money-back guarantee.</p>
            <a href="/signup">Start Free Trial</a>
          </body>
        </html>
      `;

      const result = await analyzeContent({ type: "html", content: html });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.overallScore).toBeGreaterThan(0);
      expect(result.error).toBeUndefined();
    });

    it("should handle invalid content type", async () => {
      const result = await analyzeContent({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: "invalid" as any,
        content: "test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.result).toBeUndefined();
    });

    it("should handle invalid HTML content type", async () => {
      const result = await analyzeContent({
        type: "html",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: 123 as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("must be a string");
    });

    it("should handle invalid PDF content type", async () => {
      const result = await analyzeContent({
        type: "pdf",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: "string content" as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("must be a Buffer");
    });

    it("should provide structured error messages", async () => {
      const result = await analyzeContent({
        type: "html",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: Buffer.from("test") as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe("string");
    });

    it("should include all required fields in successful result", async () => {
      const html = "<html><body><p>Test content</p></body></html>";
      const result = await analyzeContent({ type: "html", content: html });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();

      if (result.result) {
        expect(result.result.overallScore).toBeDefined();
        expect(result.result.dimensionScores).toBeDefined();
        expect(result.result.metrics).toBeDefined();
        expect(result.result.leverDeltas).toBeDefined();
        expect(result.result.timestamp).toBeDefined();
      }
    });
  });

  describe("analyzeHTMLFile", () => {
    it("should analyze good SaaS landing page fixture", async () => {
      const fixturePath = path.join(
        process.cwd(),
        "fixtures",
        "saas_lp_good.html"
      );
      const result = await analyzeHTMLFile(fixturePath);

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.overallScore).toBeGreaterThan(60);

      if (result.result) {
        expect(result.result.metrics.proofDensity.value).toBeGreaterThan(50);
        expect(result.result.metrics.ctaDetection.value).toBeGreaterThan(70);
        expect(result.result.metrics.guaranteeParsing.value).toBeGreaterThan(
          80
        );
        expect(result.result.leverDeltas.length).toBe(6);

        const topLever = result.result.leverDeltas[0];
        expect(topLever.evPerHour).toBeDefined();
        expect(topLever.delta).toBeGreaterThanOrEqual(0);
      }
    });

    it("should analyze weak agency landing page fixture", async () => {
      const fixturePath = path.join(
        process.cwd(),
        "fixtures",
        "agency_lp_weak.html"
      );
      const result = await analyzeHTMLFile(fixturePath);

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result?.overallScore).toBeLessThan(50);

      if (result.result) {
        expect(result.result.metrics.proofDensity.value).toBeLessThan(30);
        expect(result.result.metrics.ctaDetection.value).toBeLessThan(30);

        const highestDelta = Math.max(
          ...result.result.leverDeltas.map((d) => d.delta)
        );
        expect(highestDelta).toBeGreaterThan(60);
      }
    });

    it("should handle non-existent file", async () => {
      const result = await analyzeHTMLFile("/non/existent/file.html");

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should provide actionable recommendations", async () => {
      const fixturePath = path.join(
        process.cwd(),
        "fixtures",
        "agency_lp_weak.html"
      );
      const result = await analyzeHTMLFile(fixturePath);

      expect(result.success).toBe(true);

      if (result.result) {
        const topRecommendations = result.result.leverDeltas.slice(0, 3);

        for (const rec of topRecommendations) {
          expect(rec.lever).toBeDefined();
          expect(rec.delta).toBeGreaterThan(0);
          expect(rec.evLiftPercentage).toBeGreaterThan(0);
          expect(rec.evPerHour).toBeGreaterThan(0);
          expect(rec.estimatedHours).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Integration Tests", () => {
    it("should provide consistent results across multiple runs", async () => {
      const html = `
        <html>
          <body>
            <h1>Test Page</h1>
            <p>Consistent content for testing.</p>
          </body>
        </html>
      `;

      const result1 = await analyzeContent({ type: "html", content: html });
      const result2 = await analyzeContent({ type: "html", content: html });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.result?.overallScore).toBe(result2.result?.overallScore);
    });

    it("should handle empty content gracefully", async () => {
      const html = "<html><body></body></html>";
      const result = await analyzeContent({ type: "html", content: html });

      expect(result.success).toBe(true);
      expect(result.result?.overallScore).toBe(0);
      expect(result.result?.leverDeltas).toBeDefined();
    });

    it("should score high-quality content higher than low-quality", async () => {
      const goodFixture = path.join(
        process.cwd(),
        "fixtures",
        "saas_lp_good.html"
      );
      const weakFixture = path.join(
        process.cwd(),
        "fixtures",
        "agency_lp_weak.html"
      );

      const goodResult = await analyzeHTMLFile(goodFixture);
      const weakResult = await analyzeHTMLFile(weakFixture);

      expect(goodResult.success).toBe(true);
      expect(weakResult.success).toBe(true);
      expect(goodResult.result?.overallScore).toBeGreaterThan(
        weakResult.result?.overallScore || 0
      );
    });
  });
});
