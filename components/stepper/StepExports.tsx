"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, FileDown, FileJson, Share2 } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";

export function StepExports() {
  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-32 font-bold">Export & Share</h2>
        <p className="text-15 text-text-secondary">
          Download your analysis in various formats
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
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>PDF Report</CardTitle>
                <CardDescription>
                  Professional formatted report with all analysis details
                </CardDescription>
              </div>
              <Badge variant="accent">Recommended</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-13 text-text-secondary">
                  Includes executive summary, detailed findings, and recommendations
                </p>
                <p className="text-11 text-text-tertiary">
                  Perfect for sharing with advisors or keeping for your records
                </p>
              </div>
              <Button variant="solid" className="gap-2">
                <FileDown className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20 text-success">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>PowerPoint Presentation</CardTitle>
                <CardDescription>
                  Slide deck for presentations and discussions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-13 text-text-secondary">
                  Pre-formatted slides with charts and key takeaways
                </p>
                <p className="text-11 text-text-tertiary">
                  Great for presenting to mentors or career coaches
                </p>
              </div>
              <Button variant="solid" className="gap-2">
                <FileDown className="w-4 h-4" />
                Export PPTX
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/20 text-warning">
                <FileJson className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>JSON Data</CardTitle>
                <CardDescription>
                  Raw analysis data for developers and integrations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-13 text-text-secondary">
                  Structured data export for custom processing
                </p>
                <p className="text-11 text-text-tertiary">
                  Useful for importing into other tools or databases
                </p>
              </div>
              <Button variant="ghost" className="gap-2">
                <FileDown className="w-4 h-4" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" padding="lg">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-15 font-medium">Share Analysis</p>
                  <p className="text-13 text-text-secondary">
                    Generate a secure link to share with others
                  </p>
                </div>
              </div>
              <Button variant="accent" className="gap-2">
                Create Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </m.div>
    </m.div>
  );
}
