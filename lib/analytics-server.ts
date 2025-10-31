import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

function getPostHogClient(): PostHog | null {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    if (!posthogClient) {
      posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
      });
    }
    return posthogClient;
  }
  return null;
}

type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
};

export const analyticsServer = {
  track: ({ event, properties }: AnalyticsEvent) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Server]", event, properties);
    }

    const posthog = getPostHogClient();
    if (posthog) {
      const props = properties || {};
      const distinctId =
        (props["userId"] as string) ||
        (props["user_id"] as string) ||
        (props["project_id"] as string) ||
        (props["projectId"] as string) ||
        "anonymous";
      posthog.capture({
        distinctId,
        event,
        properties,
      });
    }
  },

  // Required schema
  analysisRun: (ms: number) => {
    analyticsServer.track({
      event: "analysis_run",
      properties: { ms },
    });
  },

  firstScoreShown: (overall: number) => {
    analyticsServer.track({
      event: "first_score_shown",
      properties: { overall },
    });
  },

  exportSucceeded: () => {
    analyticsServer.track({ event: "export_succeeded" });
  },

  // Legacy helpers (kept for compatibility where still referenced)
  screenshotCaptured: (
    projectId: string,
    success: boolean,
    userId?: string
  ) => {
    analyticsServer.track({
      event: "screenshot_captured",
      properties: { projectId, success, userId },
    });
  },

  llmCallCompleted: (projectId: string, duration: number, userId?: string) => {
    analyticsServer.track({
      event: "llm_call_completed",
      properties: { projectId, duration, userId },
    });
  },
};
