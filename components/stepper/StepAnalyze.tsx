"use client";

import { useState, useEffect, useCallback } from "react";
import { m } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { runAnalysis, getAnalysisStatus } from "@/app/actions/analysis-actions";
import { analytics } from "@/lib/analytics";

type AnalysisState = "idle" | "running" | "complete" | "error";

export function StepAnalyze() {
  const { project, updateProject, refreshProject } = useProjectStore();
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const checkAnalysisStatus = useCallback(async () => {
    if (!project) return;

    const result = await getAnalysisStatus(project.id);
    if (result.success && result.data) {
      if (result.data.status === "complete") {
        setAnalysisState("complete");
        setProgress(100);
        setStatusMessage("Analysis complete!");
        await updateProject({ status: "complete" });
        await refreshProject();
      } else if (result.data.status === "analyzing") {
        setTimeout(() => void checkAnalysisStatus(), 2000);
      }
    }
  }, [project, updateProject, refreshProject]);

  useEffect(() => {
    if (
      project &&
      project.status === "complete" &&
      (project.data as Record<string, unknown>)?.results
    ) {
      setAnalysisState("complete");
      setProgress(100);
      setStatusMessage("Analysis complete!");
    } else if (project && project.status === "analyzing") {
      void checkAnalysisStatus();
    }
  }, [project, checkAnalysisStatus]);

  const handleStartAnalysis = async () => {
    if (!project) return;

    setAnalysisState("running");
    setError(null);
    setProgress(0);
    setStatusMessage("Initializing analysis...");

    analytics.analysisStarted(project.id);
    await updateProject({ status: "analyzing" });

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + 5;
        return prev;
      });
    }, 500);

    const statusMessages = [
      "Running deterministic analysis...",
      "Analyzing offer components...",
      "Evaluating value proposition...",
      "Running AI analysis...",
      "Generating insights...",
      "Capturing screenshot...",
      "Finalizing results...",
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < statusMessages.length) {
        setStatusMessage(statusMessages[messageIndex]);
        messageIndex++;
      }
    }, 3000);

    try {
      const result = await runAnalysis(project.id);

      clearInterval(progressInterval);
      clearInterval(messageInterval);

      if (result.success) {
        setProgress(100);
        setStatusMessage(
          result.cached ? "Using cached results!" : "Analysis complete!"
        );
        setAnalysisState("complete");

        const updatedProject = await getAnalysisStatus(project.id);
        if (updatedProject.success) {
          await updateProject({ status: "complete" });
          await refreshProject();
        }

        analytics.analysisCompleted(project.id);
      } else {
        setAnalysisState("error");
        setError(result.error || "Analysis failed");
        setStatusMessage("Analysis failed");
        await updateProject({ status: "draft" });
      }
    } catch (err) {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setAnalysisState("error");
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setStatusMessage("Analysis failed");
      await updateProject({ status: "draft" });
    }
  };

  const renderContent = () => {
    if (analysisState === "complete") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-18 font-semibold">Analysis Complete!</p>
              <p className="text-13 text-text-secondary">
                Your offer has been analyzed. View the results in the next step.
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleStartAnalysis}
          >
            Re-run Analysis
          </Button>
        </div>
      );
    }

    if (analysisState === "error") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <p className="text-18 font-semibold">Analysis Failed</p>
              <p className="text-13 text-text-secondary">{error}</p>
            </div>
          </div>
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleStartAnalysis}
          >
            Retry Analysis
          </Button>
        </div>
      );
    }

    if (analysisState === "running") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-accent animate-pulse" />
              </div>
              <Progress value={progress} max={100} variant="accent" showLabel />
              <p className="text-13 text-text-secondary text-center">
                {statusMessage}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-center py-12">
          <Button
            variant="accent"
            size="lg"
            className="gap-2"
            onClick={handleStartAnalysis}
            disabled={!project}
          >
            <Sparkles className="w-5 h-5" />
            Start Analysis
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-13 text-text-secondary">Analysis will cover:</p>
          <ul className="space-y-2 text-13 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Value proposition clarity and strength</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Urgency and scarcity elements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Proof and credibility indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Conversion optimization opportunities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>Objection handling and risk reversal</span>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-32 font-bold">Analyze Offer</h2>
        <p className="text-15 text-text-secondary">
          Run AI-powered analysis on your offer details
        </p>
      </div>

      <Card variant="solid" padding="lg">
        <CardHeader>
          <CardTitle>
            {analysisState === "complete"
              ? "Analysis Results"
              : "Ready to Analyze"}
          </CardTitle>
          <CardDescription>
            {analysisState === "complete"
              ? "Your offer has been analyzed and scored across multiple dimensions."
              : "We'll evaluate your offer across multiple dimensions including value, urgency, certainty, and more."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">{renderContent()}</CardContent>
      </Card>
    </m.div>
  );
}
