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

  page: (pageName: string, properties?: Record<string, unknown>) => {
    analytics.track({
      event: "page_view",
      properties: { page: pageName, ...properties },
    });
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

  inputsCompleted: (projectId: string, data: Record<string, unknown>) => {
    analytics.track({
      event: "inputs_completed",
      properties: { project_id: projectId, ...data },
    });
  },

  pdfUploaded: (projectId: string, fileSize: number) => {
    analytics.track({
      event: "pdf_uploaded",
      properties: { project_id: projectId, file_size: fileSize },
    });
  },

  analysisRun: (projectId: string, userId?: string) => {
    analytics.track({
      event: "analysis_run",
      properties: { projectId, userId },
    });
  },

  firstScoreShown: (projectId: string, score: number, userId?: string) => {
    analytics.track({
      event: "first_score_shown",
      properties: { projectId, score, userId },
    });
  },

  screenshotCaptured: (
    projectId: string,
    success: boolean,
    userId?: string
  ) => {
    analytics.track({
      event: "screenshot_captured",
      properties: { projectId, success, userId },
    });
  },

  llmCallCompleted: (projectId: string, duration: number, userId?: string) => {
    analytics.track({
      event: "llm_call_completed",
      properties: { projectId, duration, userId },
    });
  },
};
