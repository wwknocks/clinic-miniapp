import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { POST as analyzeUrlPost } from "@/app/api/analyze/url/route";
import { POST as analyzePdfPost } from "@/app/api/analyze/pdf/route";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Analyze API Routes", () => {
  it("/api/analyze/url returns metrics with confidence and fold screenshot metadata", async () => {
    const fixturePath = path.join(process.cwd(), "fixtures", "saas_lp_good.html");
    const html = fs.readFileSync(fixturePath, "utf-8");

    const req = buildRequest({ html, projectId: "test-proj", userId: "user-1" });
    const res = await analyzeUrlPost(req);

    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.metrics).toBeDefined();
    expect(json.data.metrics.ctaDetection).toBeDefined();
    expect(typeof json.data.metrics.ctaDetection.confidence).toBe("number");
    expect("foldScreenshotPath" in json.data).toBe(true);
    expect("foldScreenshotSignedUrl" in json.data).toBe(true);
    // DOM probe info present
    expect(json.data.domProbe).toBeDefined();
    expect(typeof json.data.domProbe.foundInFold).toBe("boolean");
  }, 30000);

  it("/api/analyze/pdf handles small valid PDF and returns result", async () => {
    // Minimal PDF (may not extract text, but should parse)
    const minimalPdf =
      "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 712 Td (Hello PDF) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000062 00000 n \n0000000111 00000 n \n0000000200 00000 n \ntrailer\n<< /Root 1 0 R /Size 5 >>\nstartxref\n290\n%%EOF";

    const pdfBase64 = Buffer.from(minimalPdf, "utf-8").toString("base64");
    const req = buildRequest({ pdfBase64 });
    const res = await analyzePdfPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    if (json.success) {
      expect(json.data).toBeDefined();
      expect(json.data.metrics).toBeDefined();
    } else {
      // In environments where pdf-parse can't parse this minimal content, ensure error shape
      expect(["PARSE_ERROR", "FETCH_ERROR", "VALIDATION_ERROR"]).toContain(
        json.errorType
      );
    }
  }, 30000);
});
