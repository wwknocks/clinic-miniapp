import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "..");

function read(file: string) {
  return fs.readFileSync(path.join(projectRoot, file), "utf-8");
}

describe("Route runtime configuration", () => {
  it("analyze/url has runtime nodejs", () => {
    const p = "app/api/analyze/url/route.ts";
    const src = read(p);
    expect(src).toMatch(/export const runtime\s*=\s*["']nodejs["']/);
    expect(src).not.toMatch(/export const runtime\s*=\s*["']edge["']/);
  });

  it("analyze/pdf has runtime nodejs", () => {
    const p = "app/api/analyze/pdf/route.ts";
    const src = read(p);
    expect(src).toMatch(/export const runtime\s*=\s*["']nodejs["']/);
    expect(src).not.toMatch(/export const runtime\s*=\s*["']edge["']/);
  });
});
