import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { probeCTAInFold } from "@/lib/puppeteer/dom-probe";

describe("Puppeteer DOM CTA Probe", () => {
  it("flags CTAs within the top 1200px for good SaaS LP", async () => {
    const fixturePath = path.join(process.cwd(), "fixtures", "saas_lp_good.html");
    const html = fs.readFileSync(fixturePath, "utf-8");

    const result = await probeCTAInFold({ html, foldHeight: 1200 });

    expect(result.error).toBeUndefined();
    expect(result.foundInFold).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
    // Ensure we inspected the expected region
    for (const item of result.items) {
      expect(item.top).toBeLessThanOrEqual(1200);
    }
  }, 30000);

  it("does not flag CTAs above the fold for weak agency LP", async () => {
    const fixturePath = path.join(process.cwd(), "fixtures", "agency_lp_weak.html");
    const html = fs.readFileSync(fixturePath, "utf-8");

    const result = await probeCTAInFold({ html, foldHeight: 1200 });

    expect(result.error).toBeUndefined();
    expect(result.items.length === 0 || result.foundInFold === false).toBe(true);
  }, 30000);
});
