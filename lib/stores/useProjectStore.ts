import { create } from "zustand";
import { Project, ProjectState, ProjectData } from "@/types/project";
import { supabase } from "@/lib/supabase";

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

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,
  isLoading: false,
  error: null,

  initializeProject: async () => {
    set({ isLoading: true, error: null });

    try {
      const newProject = createDefaultProject();

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
        console.warn("Supabase not configured or error occurred:", err);
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
    };

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
    } catch (err) {
      console.warn("Could not sync to Supabase:", err);
    }
  },

  updateProjectData: (data: Partial<ProjectData>) => {
    const { project, updateProject } = get();
    if (!project) return;

    updateProject({
      data: { ...project.data, ...data },
    });
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
