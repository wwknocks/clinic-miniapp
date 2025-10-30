export interface ProjectData {
  // Input step data - Basic info (legacy)
  offerTitle?: string;
  companyName?: string;
  offerDetails?: string;
  
  // Input step data - New structured inputs
  sourceType?: "url" | "pdf";
  url?: string;
  pdfId?: string;
  pdfPath?: string;
  pdfUrl?: string;
  icp?: string;
  priceTerms?: string;
  proofLinks?: string[];
  mechanism?: string;
  primaryObjection?: string;
  goal?: string;
  
  // Analysis results
  analysisResults?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  
  // Enhanced analysis results
  results?: {
    scoringResult?: {
      overallScore: number;
      dimensionScores: {
        value: number;
        urgency: number;
        certainty: number;
        effort: number;
        specificity: number;
        proof: number;
      };
      metrics: Record<string, any>;
      leverDeltas: any[];
      timestamp: string;
    };
    llmOutputs?: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      fixSuggestions: string[];
      objectionHandlers: string[];
      conversionKits: string[];
    };
    screenshot?: {
      path: string;
      signedUrl: string;
    };
    inputsHash?: string;
    cachedAt?: string;
  };
  
  // Export preferences
  exportFormat?: "pdf" | "pptx" | "json";
  
  // Allow additional fields for JSONB compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
