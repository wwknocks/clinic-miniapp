import { create } from "zustand";
import { Project, ProjectState, ProjectData, GeneratedAssetMeta } from "@/types/project";
import { supabase } from "@/lib/supabase";
import { isConnectLaterMode } from "@/lib/flags";
import { analytics } from "@/lib/analytics";

const TOTAL_STEPS = 4;

const createDefaultProject = (): Project => ({
  id: crypto.randomUUID(),
  title: "Untitled Offer Analysis",
  currentStep: 1,
  data: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "draft",
});

const SAMPLE_PROJECT_DATA: ProjectData = {
  sourceType: "url",
  url: "https://www.apple.com/iphone/",
  icp: "Tech-savvy consumers and professionals looking for premium smartphones with advanced camera, performance, and ecosystem integration.",
  priceTerms:
    "Starting at $799. Trade-in offers available. Monthly financing through approved carriers. AppleCare+ optional.",
  proofLinks: [
    "https://www.apple.com/newsroom/",
    "https://support.apple.com/iphone",
  ],
  mechanism:
    "Powered by A-series chips with Neural Engine, iPhone delivers industry-leading performance and efficiency. The camera system with computational photography enables stunning photos and videos, while iOS and the App Store provide a seamless, secure experience.",
  primaryObjection:
    "Price sensitivity compared to competing devices and concerns about ecosystem lock-in.",
  goal: "Evaluate offer clarity and conversion elements; identify top improvements for landing page messaging.",
};

function getSampleResults(): ProjectData["results"] {
  const now = new Date().toISOString();
  return {
    scoringResult: {
      overallScore: 78,
      dimensionScores: {
        value: 82,
        urgency: 65,
        certainty: 74,
        effort: 70,
        specificity: 80,
        proof: 76,
      },
      metrics: {
        proofDensity: { name: "Proof Density", value: 0.62, description: "Ratio of proof elements to total content" },
        numbersPerFiveHundredWords: { name: "Numbers/500w", value: 3.1, description: "Numeric specificity per 500 words" },
        ctaDetection: { name: "CTA Detection", value: 0.85, description: "Clarity and presence of primary CTA" },
        guaranteeParsing: { name: "Guarantee", value: 0.5, description: "Strength of risk reversal" },
        timeToFirstValue: { name: "Time-to-Value", value: 0.7, description: "How quickly user sees first value" },
        mechanismPresence: { name: "Mechanism", value: 0.8, description: "Clarity of how it works" },
      },
      leverDeltas: [
        {
          lever: "urgency",
          currentScore: 65,
          potentialScore: 85,
          delta: 20,
          evLiftPercentage: 0.12,
          evPerHour: 0.06,
          estimatedHours: 4,
        },
        {
          lever: "certainty",
          currentScore: 74,
          potentialScore: 90,
          delta: 16,
          evLiftPercentage: 0.1,
          evPerHour: 0.05,
          estimatedHours: 3,
        },
        {
          lever: "proof",
          currentScore: 76,
          potentialScore: 90,
          delta: 14,
          evLiftPercentage: 0.08,
          evPerHour: 0.04,
          estimatedHours: 3,
        },
      ],
      timestamp: now,
    },
    llmOutputs: {
      strengths: [
        "Clear premium positioning and strong ecosystem lock-in",
        "High perceived value through camera and performance claims",
        "Trust built via brand authority and support infrastructure",
      ],
      weaknesses: [
        "Limited urgency drivers beyond launch windows",
        "Guarantee and risk reversal not prominent",
        "Price anchoring could be stronger against alternatives",
      ],
      recommendations: [
        "Introduce time-bound incentive (e.g., limited bonus or financing window)",
        "Add comparison table vs. top competitors to justify price",
        "Highlight 30-day return policy prominently as risk reversal",
      ],
      fixSuggestions: [
        "Add urgency banner with countdown for launch promotions",
        "Add proof slider with 3 recent customer stories",
        "Rewrite headline to include quantifiable outcome and timeframe",
      ],
      objectionHandlers: [
        "If price: Offer trade-in calculator and financing breakdown",
        "If ecosystem lock-in: Emphasize cross-device continuity and migration ease",
      ],
      conversionKits: [
        "LinkedIn carousel summarizing top outcomes with visuals",
        "Lead magnet: 'iPhone Setup Playbook' PDF",
      ],
    },
    screenshot: {
      path: "/mock/iphone-screenshot.png",
      signedUrl: "https://via.placeholder.com/1200x800.png?text=Offer+Screenshot",
    },
    inputsHash: "mock-hash",
    cachedAt: now,
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  isLoading: false,
  error: null,

  initializeProject: async () => {
    set({ isLoading: true, error: null });

    try {
      // First, attempt to load most recent project if it exists
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const existing: Project = {
            id: data.id,
            userId: data.user_id || undefined,
            title: data.title,
            currentStep: data.current_step || 1,
            data: (data.data as ProjectData) || {},
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            status: data.status || "draft",
          };

          // In connect-later mode, merge in sample data/results to demo the flow
          if (isConnectLaterMode) {
            existing.title = existing.title || "Sample Project – iPhone Offer";
            existing.data = { ...SAMPLE_PROJECT_DATA, ...existing.data };
            if (!existing.data.results) {
              existing.data.results = getSampleResults();
            }
          }

          set({ project: existing, isLoading: false });
          return;
        }
      } catch (e) {
        // ignore and continue with creating a new project
      }

      // Otherwise create a new project
      const newProject = createDefaultProject();

      // Preload sample data in connect-later mode
      if (isConnectLaterMode) {
        newProject.title = "Sample Project – iPhone Offer";
        newProject.data = { ...SAMPLE_PROJECT_DATA, results: getSampleResults() };
      }

      // Try to save to Supabase if configured
      try {
        const { error } = await supabase.from("projects").insert({
          id: newProject.id,
          title: newProject.title,
          current_step: newProject.currentStep,
          data: newProject.data,
          status: newProject.status,
          created_at: newProject.createdAt,
          updated_at: newProject.updatedAt,
        });

        if (error) {
          console.warn("Could not save to Supabase:", error.message);
        }
      } catch (err) {
        // not configured - fine in connect later mode
      }

      set({ project: newProject, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize project",
        isLoading: false,
      });
    }
  },

  loadProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Project not found");

      const project: Project = {
        id: data.id,
        userId: data.user_id || undefined,
        title: data.title,
        currentStep: data.current_step,
        data: (data.data as ProjectData) || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        status: data.status,
      };

      set({ project, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load project",
        isLoading: false,
      });
    }
  },

  updateProject: async (updates: Partial<Project>) => {
    const { project } = get();
    if (!project) return;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as Project;

    set({ project: updatedProject });

    // Try to save to Supabase
    try {
      await supabase
        .from("projects")
        .update({
          title: updatedProject.title,
          current_step: updatedProject.currentStep,
          data: updatedProject.data,
          status: updatedProject.status,
          updated_at: updatedProject.updatedAt,
        })
        .eq("id", updatedProject.id);

      analytics.projectUpdated(updatedProject.id, updates as Record<string, unknown>);
    } catch (err) {
      // non-blocking in connect-later mode
    }
  },

  updateProjectData: (data: Partial<ProjectData>) => {
    const { project, updateProject } = get();
    if (!project) return;

    updateProject({
      data: { ...project.data, ...data },
    });
  },

  refreshProject: async () => {
    const { project } = get();
    if (!project) return;
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error || !data) return;

      const server: Project = {
        id: data.id,
        userId: data.user_id || undefined,
        title: data.title,
        currentStep: data.current_step,
        data: (data.data as ProjectData) || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        status: data.status,
      };

      // Merge server data, preferring server-side results/fields
      const merged: Project = {
        ...project,
        ...server,
        data: { ...project.data, ...server.data },
      };

      set({ project: merged });
    } catch (e) {
      // ignore
    }
  },

  setCurrentStep: (step: number) => {
    const { project, updateProject } = get();
    if (!project) return;

    if (step >= 1 && step <= TOTAL_STEPS) {
      updateProject({ currentStep: step });
    }
  },

  nextStep: () => {
    const { project } = get();
    if (!project) return;

    if (project.currentStep < TOTAL_STEPS) {
      get().setCurrentStep(project.currentStep + 1);
    }
  },

  previousStep: () => {
    const { project } = get();
    if (!project) return;

    if (project.currentStep > 1) {
      get().setCurrentStep(project.currentStep - 1);
    }
  },

  resetProject: () => {
    set({ project: null, error: null, isLoading: false });
  },
}));
