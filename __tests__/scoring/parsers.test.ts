import { describe, it, expect } from "vitest";
import { parseHTML } from "@/lib/scoring/parsers/html-parser";
import * as fs from "fs";
import * as path from "path";

describe("HTML Parser", () => {
  it("should parse valid HTML content", async () => {
    const html = `
      <html>
        <body>
          <h1>Test Heading</h1>
          <p>This is a test paragraph with some words.</p>
          <a href="/test">Test Link</a>
          <img src="test.jpg" alt="Test Image" />
        </body>
      </html>
    `;

    const result = await parseHTML(html);

    expect(result.success).toBe(true);
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.headings).toContain("Test Heading");
    expect(result.links).toHaveLength(1);
    expect(result.links[0].text).toBe("Test Link");
    expect(result.images).toHaveLength(1);
    expect(result.images[0].alt).toBe("Test Image");
  });

  it("should handle empty HTML", async () => {
    const html = "<html><body></body></html>";
    const result = await parseHTML(html);

    expect(result.success).toBe(true);
    expect(result.wordCount).toBe(0);
    expect(result.headings).toHaveLength(0);
  });

  it("should remove script and style tags", async () => {
    const html = `
      <html>
        <body>
          <script>console.log('test');</script>
          <style>body { color: red; }</style>
          <p>Visible text</p>
        </body>
      </html>
    `;

    const result = await parseHTML(html);

    expect(result.text).not.toContain("console.log");
    expect(result.text).not.toContain("color: red");
    expect(result.text).toContain("Visible text");
  });

  it("should handle malformed HTML gracefully", async () => {
    const html = "<html><body><p>Unclosed paragraph";
    const result = await parseHTML(html);

    expect(result.success).toBe(true);
    expect(result.text).toContain("Unclosed paragraph");
  });

  it("should parse the good SaaS landing page fixture", async () => {
    const fixturePath = path.join(
      process.cwd(),
      "fixtures",
      "saas_lp_good.html"
    );
    const html = fs.readFileSync(fixturePath, "utf-8");
    const result = await parseHTML(html);

    expect(result.success).toBe(true);
    expect(result.wordCount).toBeGreaterThan(100);
    expect(result.headings.length).toBeGreaterThan(5);
    expect(result.text).toContain("CloudSync Pro");
    expect(result.text).toContain("money-back guarantee");
  });

  it("should parse the weak agency landing page fixture", async () => {
    const fixturePath = path.join(
      process.cwd(),
      "fixtures",
      "agency_lp_weak.html"
    );
    const html = fs.readFileSync(fixturePath, "utf-8");
    const result = await parseHTML(html);

    expect(result.success).toBe(true);
    expect(result.wordCount).toBeGreaterThan(50);
    expect(result.text).toContain("WebDesign Plus");
  });
});
