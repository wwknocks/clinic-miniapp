import { describe, it, expect } from "vitest";
import { exportAll, exportPDF, exportPPTX, exportJSON } from "@/app/actions/export-actions";

// These are smoke tests to ensure the export pipeline generates non-empty artifacts
// They do not require Supabase configuration; when not configured, actions return data URLs

describe("Export pipeline smoke tests", () => {
  it(
    "exportAll generates PNG, PDF, PPTX, ICS, ZIP, and JSON",
    async () => {
      const res = await exportAll("smoke-project-id");
      expect(res.success).toBe(true);
      expect(res.assets.length).toBeGreaterThanOrEqual(5);

      const types = res.assets.map((a) => a.type);
      expect(types).toContain("png");
      expect(types).toContain("pdf");
      expect(types).toContain("pptx");
      expect(types).toContain("ics");
      expect(types).toContain("zip");
      expect(types).toContain("json");

      // Ensure URLs present and non-empty filenames
      for (const a of res.assets) {
        expect(a.fileName.length).toBeGreaterThan(0);
        expect(a.url.length).toBeGreaterThan(10);
      }
    },
    120000
  );

  it(
    "exportPDF returns a valid metadata object",
    async () => {
      const res = await exportPDF("smoke-project-id");
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.type).toBe("pdf");
        expect(res.data.fileName.endsWith(".pdf")).toBe(true);
        expect(res.data.size).toBeGreaterThan(0);
        expect(res.data.url.length).toBeGreaterThan(10);
      }
    },
    60000
  );

  it(
    "exportPPTX returns a valid metadata object",
    async () => {
      const res = await exportPPTX("smoke-project-id");
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.type).toBe("pptx");
        expect(res.data.fileName.endsWith(".pptx")).toBe(true);
        expect(res.data.size).toBeGreaterThan(0);
        expect(res.data.url.length).toBeGreaterThan(10);
      }
    },
    60000
  );

  it(
    "exportJSON returns a valid metadata object",
    async () => {
      const res = await exportJSON("smoke-project-id");
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.type).toBe("json");
        expect(res.data.fileName.endsWith(".json")).toBe(true);
        expect(res.data.size).toBeGreaterThan(0);
        expect(res.data.url.length).toBeGreaterThan(10);
      }
    },
    60000
  );
});
