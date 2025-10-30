"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Sparkles } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

export function StepAnalyze() {
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
          <CardTitle>Ready to Analyze</CardTitle>
          <CardDescription>
            We'll evaluate your offer across multiple dimensions including compensation, benefits, growth potential, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center justify-center py-12">
            <Button variant="accent" size="lg" className="gap-2">
              <Sparkles className="w-5 h-5" />
              Start Analysis
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-13 text-text-secondary">Analysis will cover:</p>
            <ul className="space-y-2 text-13 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Compensation competitiveness and market benchmarking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Benefits package evaluation and comparison</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Career growth and advancement opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Work-life balance and cultural fit indicators</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">•</span>
                <span>Risk assessment and potential concerns</span>
              </li>
            </ul>
          </div>

          {/* Placeholder for when analysis is running */}
          {false && (
            <div className="space-y-3">
              <Progress value={45} max={100} variant="accent" showLabel />
              <p className="text-13 text-text-secondary text-center">
                Analyzing offer details...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </m.div>
  );
}
