import { describe, it, expect } from "vitest";

import {
  runCopyRewrite,
  runObjectionPack,
  runLinkedInCarousel,
  runLinkedInCaption,
  runLinkedInComments,
  runLinkedInDM,
  runABTestPlan,
  runBatch,
} from "@/lib/services/generators";

describe("Unified generator service exports", () => {
  it("should export client-safe functions", () => {
    expect(typeof runCopyRewrite).toBe("function");
    expect(typeof runObjectionPack).toBe("function");
    expect(typeof runLinkedInCarousel).toBe("function");
    expect(typeof runLinkedInCaption).toBe("function");
    expect(typeof runLinkedInComments).toBe("function");
    expect(typeof runLinkedInDM).toBe("function");
    expect(typeof runABTestPlan).toBe("function");
    expect(typeof runBatch).toBe("function");
  });
});
