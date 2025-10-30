// Analytics placeholder for PostHog or similar services
// This can be expanded with actual analytics implementation

type AnalyticsEvent = {
  event: string;
  properties?: Record<string, unknown>;
};

export const analytics = {
  track: ({ event, properties }: AnalyticsEvent) => {
    // Placeholder for analytics tracking
    // In production, this would send to PostHog, Google Analytics, etc.
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", event, properties);
    }
    
    // TODO: Implement actual analytics tracking
    // Example with PostHog:
    // if (typeof window !== "undefined" && window.posthog) {
    //   window.posthog.capture(event, properties);
    // }
  },

  page: (pageName: string, properties?: Record<string, unknown>) => {
    analytics.track({ event: "page_view", properties: { page: pageName, ...properties } });
  },

  stepChanged: (stepNumber: number, stepName: string) => {
    analytics.track({
      event: "step_changed",
      properties: { step_number: stepNumber, step_name: stepName },
    });
  },

  projectCreated: (projectId: string) => {
    analytics.track({
      event: "project_created",
      properties: { project_id: projectId },
    });
  },

  projectUpdated: (projectId: string, updates: Record<string, unknown>) => {
    analytics.track({
      event: "project_updated",
      properties: { project_id: projectId, ...updates },
    });
  },

  analysisStarted: (projectId: string) => {
    analytics.track({
      event: "analysis_started",
      properties: { project_id: projectId },
    });
  },

  analysisCompleted: (projectId: string, duration?: number) => {
    analytics.track({
      event: "analysis_completed",
      properties: { project_id: projectId, duration },
    });
  },

  exportDownloaded: (projectId: string, format: string) => {
    analytics.track({
      event: "export_downloaded",
      properties: { project_id: projectId, format },
    });
  },
};
