import { describe, it, expect } from "vitest";
import { parseHTML } from "@/lib/scoring/parsers/html-parser";
import { calculateScores } from "@/lib/scoring/scoring-service";
import {
  parseGuarantee,
  calculateTimeToFirstValue,
  calculateProofDensity,
} from "@/lib/scoring/checks";
import { ParsedContent } from "@/lib/scoring/models/types";

describe("Edge Cases", () => {
  describe("Parsing Edge Cases", () => {
    it("should handle HTML with only whitespace", async () => {
      const html = "<html><body>   \n\n   \t\t   </body></html>";
      const result = await parseHTML(html);

      expect(result.success).toBe(true);
      expect(result.wordCount).toBe(0);
      expect(result.text).toBe("");
    });

    it("should handle extremely long content", async () => {
      const longText = "word ".repeat(10000);
      const html = `<html><body><p>${longText}</p></body></html>`;
      const result = await parseHTML(html);

      expect(result.success).toBe(true);
      expect(result.wordCount).toBe(10000);
    });

    it("should handle HTML with special characters", async () => {
      const html = `<html><body><p>Test &amp; &lt; &gt; "quotes" 'apostrophes'</p></body></html>`;
      const result = await parseHTML(html);

      expect(result.success).toBe(true);
      expect(result.text).toContain("&");
    });

    it("should handle HTML with no body tag", async () => {
      const html = "<html><p>Content without body tag</p></html>";
      const result = await parseHTML(html);

      expect(result.success).toBe(true);
      expect(result.text).toContain("Content without body tag");
    });

    it("should handle invalid HTML structure", async () => {
      const html = "<div><p>Unclosed tags<div><span>More content";
      const result = await parseHTML(html);

      expect(result.success).toBe(true);
      expect(result.text).toContain("Unclosed tags");
    });
  });

  describe("Guarantee Parsing Edge Cases", () => {
    it("should handle 'unknown' guarantee type", () => {
      const content: ParsedContent = {
        text: "We offer a lifetime warranty on all products.",
        wordCount: 8,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = parseGuarantee(content);

      expect(result.rawValue).toBe("none");
    });

    it("should handle multiple overlapping guarantees", () => {
      const content: ParsedContent = {
        text: "30-day money-back guarantee, 60-day guarantee, 100% satisfaction guarantee, risk-free trial",
        wordCount: 11,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = parseGuarantee(content);

      expect(result.value).toBeGreaterThan(95);
      expect(typeof result.rawValue).toBe("string");
    });

    it("should handle case variations in guarantee text", () => {
      const content: ParsedContent = {
        text: "30-DAY MONEY-BACK GUARANTEE available now!",
        wordCount: 6,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = parseGuarantee(content);

      expect(result.value).toBeGreaterThan(90);
    });
  });

  describe("Time to First Value Edge Cases", () => {
    it("should handle time in different units", () => {
      const content: ParsedContent = {
        text: "Setup in 30 seconds, results in 5 minutes, or get started in 1 hour",
        wordCount: 15,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateTimeToFirstValue(content);

      expect(result.value).toBeGreaterThan(90);
    });

    it("should handle vague time indicators", () => {
      const content: ParsedContent = {
        text: "Fast setup. Quick results. Immediate impact.",
        wordCount: 7,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateTimeToFirstValue(content);

      expect(result.value).toBeGreaterThan(70);
    });

    it("should handle no time indicators", () => {
      const content: ParsedContent = {
        text: "Our product is great and will help your business.",
        wordCount: 9,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateTimeToFirstValue(content);

      expect(result.value).toBe(0);
      expect(result.rawValue).toBe("none");
    });
  });

  describe("Proof Density Edge Cases", () => {
    it("should handle content with no proof elements", () => {
      const content: ParsedContent = {
        text: "We are a company that does things. We work hard and deliver results. Quality is important to us.",
        wordCount: 18,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateProofDensity(content);

      expect(result.value).toBe(0);
      expect(result.rawValue).toBe(0);
    });

    it("should handle extremely high proof density", () => {
      const proofText =
        "100% 50% 85% $1000 $2000 3x 5x 10x case study testimonial verified " +
        "proven research shows data shows study found rating review ";
      const content: ParsedContent = {
        text: proofText.repeat(5),
        wordCount: proofText.split(" ").length * 5,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateProofDensity(content);

      expect(result.value).toBeGreaterThan(80);
      expect(result.value).toBeLessThanOrEqual(100);
    });
  });

  describe("Scoring Service Edge Cases", () => {
    it("should handle content with missing data", async () => {
      const content: ParsedContent = {
        text: "",
        wordCount: 0,
        headings: [],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateScores(content);

      expect(result.overallScore).toBe(0);
      expect(result.leverDeltas).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it("should handle parsing failure", async () => {
      const content: ParsedContent = {
        text: "",
        wordCount: 0,
        headings: [],
        links: [],
        images: [],
        success: false,
        error: "Parse failed",
      };

      const result = calculateScores(content);

      expect(result.overallScore).toBe(0);
      for (const metric of Object.values(result.metrics)) {
        expect(metric.value).toBeLessThanOrEqual(0);
      }
    });

    it("should produce consistent results for same input", async () => {
      const html = "<html><body><p>Consistent test content</p></body></html>";
      const content1 = await parseHTML(html);
      const content2 = await parseHTML(html);

      const result1 = calculateScores(content1);
      const result2 = calculateScores(content2);

      expect(result1.overallScore).toBe(result2.overallScore);
      expect(result1.dimensionScores).toEqual(result2.dimensionScores);
    });

    it("should handle all lever deltas having same score", async () => {
      const perfectHtml = `
        <html><body>
          <h1>Perfect Page with 100% optimization</h1>
          <p>Join 10,000+ customers saving $50,000. Get results in 5 minutes instantly!</p>
          <p>30-day money-back guarantee, 100% satisfaction guaranteed, risk-free trial.</p>
          <p>How it works: Step 1: Sign up. Step 2: Configure. Step 3: Start immediately.</p>
          <a href="/signup">Get Started Free</a>
          <a href="/demo">Book a Demo</a>
          <p>Case study shows 85% improvement. Research proves 3x ROI with 1000+ verified reviews.</p>
        </body></html>
      `;

      const content = await parseHTML(perfectHtml);
      const result = calculateScores(content);

      expect(result.leverDeltas).toBeDefined();
      expect(result.leverDeltas.length).toBeGreaterThan(0);

      for (const delta of result.leverDeltas) {
        expect(delta.evPerHour).toBeGreaterThanOrEqual(0);
      }
    });

    it("should cap overall score at 100", async () => {
      const content: ParsedContent = {
        text: "Perfect content ".repeat(100),
        wordCount: 200,
        headings: ["Test"],
        links: [],
        images: [],
        success: true,
      };

      const result = calculateScores(content);

      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("should never produce negative scores", async () => {
      const html = "<html><body></body></html>";
      const content = await parseHTML(html);
      const result = calculateScores(content);

      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      for (const dimension of Object.values(result.dimensionScores)) {
        expect(dimension).toBeGreaterThanOrEqual(0);
      }
      for (const metric of Object.values(result.metrics)) {
        expect(metric.value).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
