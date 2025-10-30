import { describe, it, expect } from "vitest";
import {
  calculateProofDensity,
  calculateNumbersPer500Words,
  detectCTA,
  parseGuarantee,
  calculateTimeToFirstValue,
  detectMechanismPresence,
} from "@/lib/scoring/checks";
import { ParsedContent } from "@/lib/scoring/models/types";

describe("Proof Density Check", () => {
  it("should calculate proof density correctly", () => {
    const content: ParsedContent = {
      text: "We increased sales by 50% and saved $10,000 for 100 customers. Research shows 85% satisfaction.",
      wordCount: 15,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateProofDensity(content);

    expect(result.name).toBe("Proof Density");
    expect(result.value).toBeGreaterThan(0);
    expect(typeof result.rawValue).toBe("number");
  });

  it("should return zero for empty content", () => {
    const content: ParsedContent = {
      text: "",
      wordCount: 0,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateProofDensity(content);

    expect(result.value).toBe(0);
    expect(result.rawValue).toBe(0);
  });

  it("should handle parsing failure", () => {
    const content: ParsedContent = {
      text: "",
      wordCount: 0,
      headings: [],
      links: [],
      images: [],
      success: false,
      error: "Parse error",
    };

    const result = calculateProofDensity(content);

    expect(result.value).toBe(0);
  });
});

describe("Numbers Per 500 Words Check", () => {
  it("should count numbers correctly", () => {
    const content: ParsedContent = {
      text: "We have 100 customers, 50 projects, and achieved 3x growth with 85% satisfaction.",
      wordCount: 13,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateNumbersPer500Words(content);

    expect(result.name).toBe("Numbers Per 500 Words");
    expect(result.value).toBeGreaterThan(0);
    expect(typeof result.rawValue).toBe("string");
  });

  it("should handle content with no numbers", () => {
    const content: ParsedContent = {
      text: "This is a simple text without any numeric values or statistics.",
      wordCount: 11,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateNumbersPer500Words(content);

    expect(result.value).toBeLessThan(70);
  });
});

describe("CTA Detection Check", () => {
  it("should detect CTAs in text", () => {
    const content: ParsedContent = {
      text: "Get started today! Sign up for a free trial and book a demo.",
      wordCount: 13,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = detectCTA(content);

    expect(result.name).toBe("CTA Detection");
    expect(result.value).toBeGreaterThan(0);
    expect(result.rawValue).toBeGreaterThan(0);
  });

  it("should detect CTAs in links", () => {
    const content: ParsedContent = {
      text: "Learn more about our services.",
      wordCount: 5,
      headings: [],
      links: [
        { text: "Sign up", href: "/signup" },
        { text: "Get started", href: "/start" },
      ],
      images: [],
      success: true,
    };

    const result = detectCTA(content);

    expect(result.value).toBeGreaterThan(50);
  });

  it("should return zero when no CTAs are found", () => {
    const content: ParsedContent = {
      text: "This is just regular content without any calls to action.",
      wordCount: 10,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = detectCTA(content);

    expect(result.value).toBe(0);
    expect(result.rawValue).toBe(0);
  });
});

describe("Guarantee Parsing Check", () => {
  it("should detect money-back guarantee", () => {
    const content: ParsedContent = {
      text: "Try it risk-free with our 30-day money-back guarantee.",
      wordCount: 9,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = parseGuarantee(content);

    expect(result.name).toBe("Guarantee Parsing");
    expect(result.value).toBeGreaterThan(90);
    expect(result.rawValue).toContain("money-back");
  });

  it("should detect multiple guarantee types", () => {
    const content: ParsedContent = {
      text: "100% satisfaction guarantee with no questions asked. Risk-free trial available.",
      wordCount: 11,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = parseGuarantee(content);

    expect(result.value).toBeGreaterThan(90);
  });

  it("should return 'none' when no guarantee is found", () => {
    const content: ParsedContent = {
      text: "This is regular content without any guarantees or promises.",
      wordCount: 9,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = parseGuarantee(content);

    expect(result.value).toBe(0);
    expect(result.rawValue).toBe("none");
  });

  it("should return 'unknown' on parsing failure", () => {
    const content: ParsedContent = {
      text: "",
      wordCount: 0,
      headings: [],
      links: [],
      images: [],
      success: false,
      error: "Parse error",
    };

    const result = parseGuarantee(content);

    expect(result.value).toBe(0);
    expect(result.rawValue).toBe("unknown");
  });
});

describe("Time to First Value Check", () => {
  it("should detect time indicators", () => {
    const content: ParsedContent = {
      text: "Get started in 5 minutes with instant results. Setup ready in seconds.",
      wordCount: 12,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateTimeToFirstValue(content);

    expect(result.name).toBe("Time to First Value");
    expect(result.value).toBeGreaterThan(80);
  });

  it("should score immediate/instant highly", () => {
    const content: ParsedContent = {
      text: "Instant access. Immediate results. Start right now.",
      wordCount: 7,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = calculateTimeToFirstValue(content);

    expect(result.value).toBeGreaterThan(70);
  });

  it("should return 'none' when no indicators found", () => {
    const content: ParsedContent = {
      text: "This content has no time-related information.",
      wordCount: 7,
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

describe("Mechanism Presence Check", () => {
  it("should detect 'how it works' section", () => {
    const content: ParsedContent = {
      text: "How it works: Step 1: Sign up. Step 2: Configure. Step 3: Launch.",
      wordCount: 14,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = detectMechanismPresence(content);

    expect(result.name).toBe("Mechanism Presence");
    expect(result.value).toBeGreaterThan(50);
  });

  it("should detect process descriptions", () => {
    const content: ParsedContent = {
      text: "Our process is simple. First, we analyze. Second, we optimize. Third, we deliver.",
      wordCount: 14,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = detectMechanismPresence(content);

    expect(result.value).toBeGreaterThan(40);
  });

  it("should return low score without mechanism indicators", () => {
    const content: ParsedContent = {
      text: "We provide great service and excellent results for our clients.",
      wordCount: 10,
      headings: [],
      links: [],
      images: [],
      success: true,
    };

    const result = detectMechanismPresence(content);

    expect(result.value).toBeLessThan(30);
  });
});
