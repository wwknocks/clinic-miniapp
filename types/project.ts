export interface ProjectData {
  // Input step data
  offerTitle?: string;
  companyName?: string;
  offerDetails?: string;
  
  // Analysis results
  analysisResults?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  
  // Export preferences
  exportFormat?: "pdf" | "pptx" | "json";
}

export interface Project {
  id: string;
  userId?: string;
  title: string;
  currentStep: number;
  data: ProjectData;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "analyzing" | "complete";
}

export interface ProjectState {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  updateProjectData: (data: Partial<ProjectData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetProject: () => void;
}
