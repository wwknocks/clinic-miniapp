import { describe, it, expect, beforeAll } from "vitest";
import { POST as copyRewritePost } from "@/app/api/generators/copy-rewrite/route";
import { POST as objectionPackPost } from "@/app/api/generators/objection-pack/route";
import { POST as carouselPost } from "@/app/api/generators/linkedin-carousel/route";
import { POST as captionPost } from "@/app/api/generators/linkedin-caption/route";
import { POST as commentPost } from "@/app/api/generators/linkedin-comment/route";
import { POST as dmPost } from "@/app/api/generators/linkedin-dm/route";
import { POST as abPlanPost } from "@/app/api/generators/ab-test-plan/route";
import { POST as batchPost } from "@/app/api/generators/batch/route";

function buildRequest(body: unknown) {
  return new Request("http://localhost/api/generators", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeAll(() => {
  process.env.LLM_USE_MOCKS = "true";
});

describe("Generator API Routes", () => {
  it("/copy-rewrite returns structured JSON", async () => {
    const req = buildRequest({
      currentCopy: "We help businesses grow",
      icp: "B2B SaaS founders",
    });
    const res = await copyRewritePost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.headline.length).toBeGreaterThan(0);
    expect(Array.isArray(json.data.body)).toBe(true);
  });

  it("/linkedin-carousel enforces slideCount deterministically", async () => {
    const req = buildRequest({
      topic: "Offer positioning",
      keyPoints: ["Specificity", "Social proof", "CTA", "Risk reversal", "Benefits over features", "ICP focus", "Guarantee"],
      targetAudience: "B2B founders",
      slideCount: 7,
    });
    const res = await carouselPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.slides.length).toBe(7);
    // Ensure slide numbers sequentially assigned
    expect(json.data.slides[0].slide_number).toBe(1);
    expect(json.data.slides[6].slide_number).toBe(7);
  });

  it("/objection-pack can return exactly 10 handlers", async () => {
    const req = buildRequest({
      offer: "Coaching program",
      icp: "SaaS founders",
      primaryObjections: ["Too expensive", "No time", "Tried before"],
      handlerCount: 10,
    });
    const res = await objectionPackPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.handlers.length).toBe(10);
  });

  it("/linkedin-comment respects count", async () => {
    const req = buildRequest({
      postContent: "Great breakdown of conversion killers",
      responseAngle: "supportive",
      count: 3,
    });
    const res = await commentPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.comments.length).toBe(3);
  });

  it("/linkedin-dm enforces messageCount", async () => {
    const req = buildRequest({
      prospect: "Jane Doe",
      context: "Commented on our post about CTA best practices",
      goal: "Start a conversation",
      messageCount: 4,
    });
    const res = await dmPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.messages.length).toBe(4);
  });

  it("/ab-test-plan returns a plan with requested number of days", async () => {
    const req = buildRequest({
      currentMetrics: { conversionRate: 2.3 },
      offerDescription: "Offer analysis service",
      targetAudience: "B2B marketers",
      days: 7,
    });
    const res = await abPlanPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.test_days)).toBe(true);
    expect(json.data.test_days.length).toBe(7);
  });

  it("/batch runs multiple generators and preserves structure", async () => {
    const req = buildRequest({
      tasks: [
        { id: "t1", type: "copy_rewrite", inputs: { currentCopy: "We help", icp: "Founders" } },
        {
          id: "t2",
          type: "linkedin_carousel",
          inputs: { topic: "Topic", keyPoints: ["a", "b", "c"], targetAudience: "People" },
          options: { slideCount: 7 },
        },
        {
          id: "t3",
          type: "objection_pack",
          inputs: { offer: "Service", icp: "SaaS" },
          options: { handlerCount: 10 },
        },
      ],
    });
    const res = await batchPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.results)).toBe(true);
    const t2 = json.results.find((r: any) => r.id === "t2");
    expect(t2.success).toBe(true);
    expect(t2.data.slides.length).toBe(7);
    const t3 = json.results.find((r: any) => r.id === "t3");
    expect(t3.data.handlers.length).toBe(10);
  });

  it("handles missing context gracefully", async () => {
    const res = await copyRewritePost(buildRequest({}));
    expect([400, 200]).toContain(res.status);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(["VALIDATION_ERROR", "LLM_EMPTY", "LLM_ERROR"]).toContain(json.errorType);
  });
});
