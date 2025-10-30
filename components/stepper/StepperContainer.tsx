"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { analytics } from "@/lib/analytics";
import { StepInputsNew } from "./StepInputsNew";
import { StepAnalyze } from "./StepAnalyze";
import { StepResults } from "./StepResults";
import { StepExports } from "./StepExports";
import { ChevronLeft, ChevronRight, AlertCircle, Activity } from "lucide-react";

const steps = [
  { label: "Inputs", description: "Offer details" },
  { label: "Analyze", description: "Run analysis" },
  { label: "Results", description: "View findings" },
  { label: "Exports", description: "Download report" },
];

export function StepperContainer() {
  const { project, initializeProject, nextStep, previousStep } =
    useProjectStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) {
      initializeProject();
    }
  }, [project, initializeProject]);

  useEffect(() => {
    // Track project creation
    if (project) {
      analytics.projectCreated(project.id);
    }
  }, [project?.id]);

  useEffect(() => {
    // Focus management for accessibility
    if (contentRef.current) {
      contentRef.current.focus();
    }

    // Track step changes
    if (project) {
      analytics.stepChanged(
        project.currentStep,
        steps[project.currentStep - 1].label
      );
    }
  }, [project?.currentStep]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Activity className="w-12 h-12 text-accent mx-auto" />
          </div>
          <p className="text-15 text-text-secondary">Initializing project...</p>
        </div>
      </div>
    );
  }

  const currentStep = project.currentStep;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === steps.length;

  const isStepValid = () => {
    if (currentStep === 1) {
      const sourceType = project?.data.sourceType;
      if (!sourceType) return false;
      if (sourceType === "url") return !!project?.data.url;
      if (sourceType === "pdf") return !!project?.data.pdfId;
      return false;
    }
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepInputsNew key="inputs" />;
      case 2:
        return <StepAnalyze key="analyze" />;
      case 3:
        return <StepResults key="results" />;
      case 4:
        return <StepExports key="exports" />;
      default:
        return <StepInputsNew key="inputs" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header with hero copy */}
      <header className="border-b border-white/10 bg-panel/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-32 font-bold">Offer Wind Tunnel</h1>
                <p className="text-15 text-text-secondary max-w-2xl">
                  Make confident career decisions with AI-powered offer
                  analysis. Get comprehensive insights on compensation,
                  benefits, and growth potential.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <Card variant="glass" padding="sm">
              <div className="flex items-start gap-3 p-4">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-13 font-medium text-text-primary">
                    Educational Tool Disclaimer
                  </p>
                  <p className="text-11 text-text-secondary">
                    This tool provides analysis and recommendations for
                    educational purposes. Always consult with financial
                    advisors, career counselors, or legal professionals before
                    making important career decisions. Individual circumstances
                    vary significantly.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Stepper indicator */}
      <div className="border-b border-white/10 bg-panel/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Main content area */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div
          ref={contentRef}
          tabIndex={-1}
          className="focus:outline-none"
          role="region"
          aria-live="polite"
          aria-label={`Step ${currentStep}: ${steps[currentStep - 1].label}`}
        >
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Navigation controls */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={previousStep}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>

            <div className="text-center">
              <p className="text-13 text-text-tertiary">
                Step {currentStep} of {steps.length}
              </p>
            </div>

            <Button
              variant={isLastStep ? "accent" : "solid"}
              size="lg"
              onClick={nextStep}
              disabled={isLastStep || !isStepValid()}
              className="gap-2"
            >
              {isLastStep ? "Complete" : "Next"}
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </m.div>
      </main>

      {/* Sidebar/Toolbar placeholder for future features */}
      <aside className="fixed bottom-6 right-6 z-20 hidden lg:block">
        <Card variant="glass" padding="sm">
          <div className="p-4 space-y-3">
            <p className="text-11 font-medium text-text-secondary uppercase tracking-wider">
              Quick Actions
            </p>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-13"
              >
                Save Progress
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-13"
              >
                View History
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-13"
              >
                Get Help
              </Button>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
