type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
};

export const analytics = {
  track: ({ event, properties }: AnalyticsEvent) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, properties);
    }

    if (typeof window !== "undefined") {
      const windowWithPosthog = window as typeof window & {
        posthog?: {
          capture: (
            event: string,
            properties?: Record<string, unknown>
          ) => void;
        };
      };
      if (windowWithPosthog.posthog) {
        windowWithPosthog.posthog.capture(event, properties);
      }
    }
  },

  signup: () => {
    analytics.track({ event: "signup" });
  },

  projectCreated: (projectId: string) => {
    analytics.track({
      event: "project_created",
      properties: { project_id: projectId },
    });
  },

  inputsCompleted: (projectId: string, data: Record<string, unknown>) => {
    analytics.track({
      event: "inputs_completed",
      properties: { project_id: projectId, ...data },
    });
  },

  analysisRun: (ms: number) => {
    analytics.track({
      event: "analysis_run",
      properties: { ms },
    });
  },

  firstScoreShown: (overall: number) => {
    analytics.track({
      event: "first_score_shown",
      properties: { overall },
    });
  },

  exportClicked: (type: string) => {
    analytics.track({
      event: "export_clicked",
      properties: { type },
    });
  },

  exportSucceeded: () => {
    analytics.track({ event: "export_succeeded" });
  },

  paywallShown: () => {
    analytics.track({ event: "paywall_shown" });
  },

  upgradeClicked: (plan?: string) => {
    analytics.track({ event: "upgrade_clicked", properties: plan ? { plan } : undefined });
  },

  upgradeSucceeded: (plan?: string) => {
    analytics.track({ event: "upgrade_succeeded", properties: plan ? { plan } : undefined });
  },
};
