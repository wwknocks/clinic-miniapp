"use client";

import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { fadeInUp } from "@/lib/motion";

export function StepInputs() {
  const { project, updateProjectData } = useProjectStore();

  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-32 font-bold">Offer Details</h2>
        <p className="text-15 text-text-secondary">
          Provide information about the offer you want to analyze
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Tell us about the offer and company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="offerTitle">Offer Title</Label>
            <Input
              id="offerTitle"
              placeholder="e.g., Senior Software Engineer at TechCorp"
              value={project?.data.offerTitle || ""}
              onChange={(e) => updateProjectData({ offerTitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="e.g., TechCorp Inc."
              value={project?.data.companyName || ""}
              onChange={(e) => updateProjectData({ companyName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerDetails">Offer Details</Label>
            <Textarea
              id="offerDetails"
              placeholder="Paste your offer letter or provide key details like compensation, benefits, equity, location, etc."
              rows={8}
              value={project?.data.offerDetails || ""}
              onChange={(e) => updateProjectData({ offerDetails: e.target.value })}
            />
            <p className="text-11 text-text-tertiary">
              Include salary, equity, benefits, work arrangements, and any other relevant information
            </p>
          </div>
        </CardContent>
      </Card>
    </m.div>
  );
}
