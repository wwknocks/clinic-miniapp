import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { analytics } from "@/lib/analytics";

const originalEnv = process.env.NODE_ENV;

describe("analytics smoke test", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  it("logs events in development when no PostHog client is present", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    analytics.track({ event: "signup" });
    analytics.exportClicked("pdf");
    analytics.exportSucceeded();

    const calls = spy.mock.calls.map((c) => c.join(" "));
    expect(calls.some((c) => c.includes("[Analytics]"))).toBe(true);
    expect(calls.some((c) => c.includes("signup"))).toBe(true);
    expect(calls.some((c) => c.includes("export_clicked"))).toBe(true);
    expect(calls.some((c) => c.includes("export_succeeded"))).toBe(true);
  });
});
