"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Tooltip } from "@/components/ui/Tooltip";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { fadeInUp } from "@/lib/motion";
import { validateField } from "@/lib/validation/input-schemas";
import { uploadPDF, deletePDF } from "@/app/actions/upload-actions";
import { analytics } from "@/lib/analytics";
import { Plus, X, Upload, FileText, AlertCircle, CheckCircle, Loader2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepInputsNew() {
  const { project, updateProjectData, updateProject } = useProjectStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sourceType = project?.data.sourceType || "";
  const url = project?.data.url || "";
  const pdfId = project?.data.pdfId || "";
  const pdfPath = project?.data.pdfPath || "";
  const pdfUrl = project?.data.pdfUrl || "";
  const icp = project?.data.icp || "";
  const priceTerms = project?.data.priceTerms || "";
  const proofLinks = project?.data.proofLinks || [];
  const mechanism = project?.data.mechanism || "";
  const primaryObjection = project?.data.primaryObjection || "";
  const goal = project?.data.goal || "";

  const validateAndUpdate = (field: string, value: any) => {
    const error = validateField(field as any, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }));
  };

  const handleSourceTypeChange = (value: string) => {
    updateProjectData({ sourceType: value as "url" | "pdf" });
    if (value === "url") {
      updateProjectData({ pdfId: "", pdfPath: "", pdfUrl: "" });
    } else {
      updateProjectData({ url: "" });
    }
  };

  const handleUrlChange = (value: string) => {
    updateProjectData({ url: value });
    if (value) {
      validateAndUpdate("url", value);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, pdfId: "Only PDF files are allowed" }));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, pdfId: "File size must be less than 50MB" }));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors((prev) => ({ ...prev, pdfId: "" }));

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", project.userId || project.id);

      const result = await uploadPDF(formData);

      clearInterval(progressInterval);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadProgress(100);

      if (pdfPath) {
        await deletePDF(pdfPath);
      }

      updateProjectData({
        pdfId: result.data.pdfId,
        pdfPath: result.data.pdfPath,
        pdfUrl: result.data.pdfUrl,
      });

      analytics.pdfUploaded(project.id, file.size);

      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      const message = error instanceof Error ? error.message : "Upload failed";
      setErrors((prev) => ({ ...prev, pdfId: message }));
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemovePdf = async () => {
    if (pdfPath && project) {
      await deletePDF(pdfPath);
    }
    updateProjectData({ pdfId: "", pdfPath: "", pdfUrl: "" });
  };

  const addProofLink = () => {
    updateProjectData({ proofLinks: [...proofLinks, ""] });
  };

  const updateProofLink = (index: number, value: string) => {
    const updated = [...proofLinks];
    updated[index] = value;
    updateProjectData({ proofLinks: updated });
  };

  const removeProofLink = (index: number) => {
    const updated = proofLinks.filter((_, i) => i !== index);
    updateProjectData({ proofLinks: updated });
  };

  const isFormValid = () => {
    if (!sourceType) return false;
    if (sourceType === "url" && !url) return false;
    if (sourceType === "pdf" && !pdfId) return false;
    return true;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (project && isFormValid()) {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 500);
        
        const hasAllOptionalFields = icp && priceTerms && mechanism && primaryObjection && goal;
        if (hasAllOptionalFields) {
          analytics.inputsCompleted(project.id, {
            sourceType,
            hasIcp: !!icp,
            hasPriceTerms: !!priceTerms,
            hasProofLinks: proofLinks.length > 0,
            hasMechanism: !!mechanism,
            hasPrimaryObjection: !!primaryObjection,
            hasGoal: !!goal,
          });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [sourceType, url, pdfId, icp, priceTerms, proofLinks, mechanism, primaryObjection, goal, project]);

  return (
    <m.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-32 font-bold">Collect Input Data</h2>
          {isSaving && (
            <div className="flex items-center gap-2 text-13 text-text-secondary">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </div>
          )}
        </div>
        <p className="text-15 text-text-secondary">
          Provide details about your offer or sales page to analyze
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Source Type
            <Tooltip content="Choose whether to analyze a URL or upload a PDF document">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            Select where your offer information is coming from
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <RadioGroup value={sourceType} onValueChange={handleSourceTypeChange}>
            <RadioGroupItem
              value="url"
              label="URL"
              description="Analyze a sales page or offer page from a URL"
            />
            <RadioGroupItem
              value="pdf"
              label="PDF Upload"
              description="Upload a PDF document containing your offer details"
            />
          </RadioGroup>

          {errors.sourceType && (
            <div className="flex items-center gap-2 text-13 text-red-400">
              <AlertCircle className="h-4 w-4" />
              {errors.sourceType}
            </div>
          )}

          {sourceType === "url" && (
            <div className="space-y-2 pt-4">
              <Label htmlFor="url">
                URL *
                <Tooltip content="Enter the full URL of the sales page or offer page you want to analyze">
                  <HelpCircle className="inline h-3 w-3 ml-1 text-text-tertiary" />
                </Tooltip>
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/offer"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={cn(errors.url && "border-red-500")}
              />
              {errors.url && (
                <div className="flex items-center gap-2 text-11 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.url}
                </div>
              )}
            </div>
          )}

          {sourceType === "pdf" && (
            <div className="space-y-2 pt-4">
              <Label htmlFor="pdf">
                PDF Document *
                <Tooltip content="Upload a PDF file containing your offer details (max 50MB)">
                  <HelpCircle className="inline h-3 w-3 ml-1 text-text-tertiary" />
                </Tooltip>
              </Label>
              {!pdfId ? (
                <>
                  <label
                    htmlFor="pdf-upload"
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
                      "border-white/20 bg-glass backdrop-blur-md hover:border-white/30 hover:bg-white/5",
                      isUploading && "pointer-events-none opacity-50",
                      errors.pdfId && "border-red-500"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-8 h-8 mb-3 text-text-secondary animate-spin" />
                          <p className="text-13 text-text-secondary">
                            Uploading... {uploadProgress}%
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-3 text-text-secondary" />
                          <p className="text-13 text-text-primary mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-11 text-text-tertiary">PDF (max 50MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-accent h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-glass backdrop-blur-md">
                  <FileText className="h-5 w-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-13 text-text-primary truncate">{pdfId}</p>
                    <p className="text-11 text-text-tertiary">PDF uploaded successfully</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePdf}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.pdfId && (
                <div className="flex items-center gap-2 text-11 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.pdfId}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ICP Details
            <Tooltip content="Describe your Ideal Customer Profile - who is this offer for?">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            Who is your ideal customer for this offer?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="icp"
            placeholder="e.g., Small business owners with 5-50 employees looking to improve their sales process..."
            rows={4}
            value={icp}
            onChange={(e) => {
              updateProjectData({ icp: e.target.value });
              if (e.target.value) validateAndUpdate("icp", e.target.value);
            }}
            className={cn(errors.icp && "border-red-500")}
          />
          {errors.icp && (
            <div className="flex items-center gap-2 text-11 text-red-400 mt-2">
              <AlertCircle className="h-3 w-3" />
              {errors.icp}
            </div>
          )}
          <p className="text-11 text-text-tertiary mt-2">
            If missing, we'll infer from the offer content
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Price & Terms
            <Tooltip content="What's the pricing structure and payment terms?">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            What are the pricing details and payment terms?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="priceTerms"
            placeholder="e.g., $997/month, annual plan available at $9,970 (2 months free), 30-day money-back guarantee..."
            rows={3}
            value={priceTerms}
            onChange={(e) => {
              updateProjectData({ priceTerms: e.target.value });
              if (e.target.value) validateAndUpdate("priceTerms", e.target.value);
            }}
            className={cn(errors.priceTerms && "border-red-500")}
          />
          {errors.priceTerms && (
            <div className="flex items-center gap-2 text-11 text-red-400 mt-2">
              <AlertCircle className="h-3 w-3" />
              {errors.priceTerms}
            </div>
          )}
          <p className="text-11 text-text-tertiary mt-2">
            If missing, we'll extract from the source
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Proof Links
            <Tooltip content="Add links to testimonials, case studies, or social proof">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            Links to testimonials, case studies, or other proof elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {proofLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/testimonial"
                value={link}
                onChange={(e) => updateProofLink(index, e.target.value)}
                type="url"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProofLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProofLink}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Proof Link
          </Button>
          <p className="text-11 text-text-tertiary">
            Optional: Add links to strengthen your offer analysis
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Mechanism Description
            <Tooltip content="How does your product/service deliver the promised result?">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            How does your product/service work to deliver results?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="mechanism"
            placeholder="e.g., Our AI-powered platform analyzes your sales data and provides real-time recommendations..."
            rows={4}
            value={mechanism}
            onChange={(e) => {
              updateProjectData({ mechanism: e.target.value });
              if (e.target.value) validateAndUpdate("mechanism", e.target.value);
            }}
            className={cn(errors.mechanism && "border-red-500")}
          />
          {errors.mechanism && (
            <div className="flex items-center gap-2 text-11 text-red-400 mt-2">
              <AlertCircle className="h-3 w-3" />
              {errors.mechanism}
            </div>
          )}
          <p className="text-11 text-text-tertiary mt-2">
            If missing, we'll infer from the offer content
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Primary Objection
            <Tooltip content="What's the main objection or concern your prospects have?">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            What is the main objection or concern prospects typically have?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="primaryObjection"
            placeholder="e.g., 'I don't have time to learn a new system' or 'This seems too expensive'..."
            rows={3}
            value={primaryObjection}
            onChange={(e) => {
              updateProjectData({ primaryObjection: e.target.value });
              if (e.target.value) validateAndUpdate("primaryObjection", e.target.value);
            }}
            className={cn(errors.primaryObjection && "border-red-500")}
          />
          {errors.primaryObjection && (
            <div className="flex items-center gap-2 text-11 text-red-400 mt-2">
              <AlertCircle className="h-3 w-3" />
              {errors.primaryObjection}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Goal
            <Tooltip content="What do you want to achieve with this analysis?">
              <HelpCircle className="h-4 w-4 text-text-tertiary" />
            </Tooltip>
          </CardTitle>
          <CardDescription>
            What is your goal for this offer analysis?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            id="goal"
            placeholder="e.g., Improve conversion rate by 20%, identify weak points in the offer, optimize messaging for better clarity..."
            rows={3}
            value={goal}
            onChange={(e) => {
              updateProjectData({ goal: e.target.value });
              if (e.target.value) validateAndUpdate("goal", e.target.value);
            }}
            className={cn(errors.goal && "border-red-500")}
          />
          {errors.goal && (
            <div className="flex items-center gap-2 text-11 text-red-400 mt-2">
              <AlertCircle className="h-3 w-3" />
              {errors.goal}
            </div>
          )}
        </CardContent>
      </Card>

      {!isFormValid() && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-13 text-yellow-500 font-medium">Required fields missing</p>
            <p className="text-11 text-text-secondary mt-1">
              Please select a source type and provide either a URL or upload a PDF to continue
            </p>
          </div>
        </div>
      )}

      {isFormValid() && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/5">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-13 text-green-500 font-medium">Ready to analyze</p>
            <p className="text-11 text-text-secondary mt-1">
              All required fields are complete. Click Next to continue.
            </p>
          </div>
        </div>
      )}
    </m.div>
  );
}
