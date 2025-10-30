"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

export function StepResults() {
  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-32 font-bold">Analysis Results</h2>
        <p className="text-15 text-text-secondary">
          Comprehensive evaluation of your offer
        </p>
      </div>

      <m.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20 text-success">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Strengths</CardTitle>
                <CardDescription>
                  Positive aspects of this offer
                </CardDescription>
              </div>
              <Badge variant="success">3 Found</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-15">
              <p className="text-text-secondary">
                Analysis results will appear here after running the analysis in the previous step.
              </p>
              <ul className="space-y-2 text-13 text-text-tertiary">
                <li>• Competitive base salary above market average</li>
                <li>• Comprehensive benefits package with strong health coverage</li>
                <li>• Clear career progression path with mentorship program</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/20 text-warning">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Areas of Concern</CardTitle>
                <CardDescription>
                  Potential weaknesses or risks
                </CardDescription>
              </div>
              <Badge variant="warning">2 Found</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-15">
              <ul className="space-y-2 text-13 text-text-tertiary">
                <li>• Equity vesting schedule is longer than industry standard</li>
                <li>• Limited remote work flexibility compared to competitors</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Suggestions for negotiation and decision-making
                </CardDescription>
              </div>
              <Badge variant="accent">4 Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3 text-15">
              <ul className="space-y-2 text-13 text-text-tertiary">
                <li>• Consider negotiating for a signing bonus to offset equity vesting</li>
                <li>• Request more details about the remote work policy</li>
                <li>• Ask about annual performance review cycle and raise structure</li>
                <li>• Clarify professional development budget and conference attendance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </m.div>
    </m.div>
  );
}
