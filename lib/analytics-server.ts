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
      const distinctId = (properties?.userId as string) || (properties?.projectId as string) || "anonymous";
      posthog.capture({
        distinctId,
        event,
        properties,
      });
    }
  },

  analysisRun: (projectId: string, userId?: string) => {
    analyticsServer.track({
      event: "analysis_run",
      properties: { projectId, userId },
    });
  },

  firstScoreShown: (projectId: string, score: number, userId?: string) => {
    analyticsServer.track({
      event: "first_score_shown",
      properties: { projectId, score, userId },
    });
  },

  screenshotCaptured: (projectId: string, success: boolean, userId?: string) => {
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

  analysisCompleted: (projectId: string, duration?: number) => {
    analyticsServer.track({
      event: "analysis_completed",
      properties: { project_id: projectId, duration },
    });
  },
};
