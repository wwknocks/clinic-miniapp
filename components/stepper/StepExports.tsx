"use client";

import { useMemo, useState } from "react";
import { m } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FileText, FileDown, FileJson, Share2, Loader2, Sparkles } from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { exportPDF, exportPPTX, exportJSON } from "@/app/actions/export-actions";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { useToast, PaywallDialog } from "@/components/ui";
import type { GeneratedAssetMeta } from "@/types/project";
import { analytics } from "@/lib/analytics";

export function StepExports() {
  const { project, updateProjectData, refreshProject } = useProjectStore();
  const { addToast } = useToast();
  const [exporting, setExporting] = useState<{ pdf: boolean; pptx: boolean; json: boolean }>({
    pdf: false,
    pptx: false,
    json: false,
  });
  const [paywallOpen, setPaywallOpen] = useState(false);

  const assets = useMemo(() => project?.data.generatedAssets || [], [project?.data.generatedAssets]);
  const freeExportsUsed = project?.data.freeExportsUsed || 0;
  const isFreePlanLimitReached = freeExportsUsed >= 1; // allow 1 free export

  const recordAsset = (asset: GeneratedAssetMeta) => {
    const nextAssets = [...(project?.data.generatedAssets || []), asset];
    updateProjectData({ generatedAssets: nextAssets, freeExportsUsed: (project?.data.freeExportsUsed || 0) + 1 });
  };

  const handleExport = async (type: "pdf" | "pptx" | "json") => {
    if (!project) return;

    if (type !== "json" && isFreePlanLimitReached) {
      setPaywallOpen(true);
      return;
    }

    setExporting((prev) => ({ ...prev, [type]: true }));

    try {
      const action = type === "pdf" ? exportPDF : type === "pptx" ? exportPPTX : exportJSON;
      const result = await action(project.id);

      if (result.success && result.data) {
        const meta: GeneratedAssetMeta = {
          type,
          fileName: result.data.fileName,
          url: result.data.url,
          createdAt: result.data.createdAt,
          size: result.data.size,
          label: type.toUpperCase(),
        };
        recordAsset(meta);
        analytics.exportDownloaded(project.id, type);
        addToast({
          title: `${type.toUpperCase()} ready`,
          description: `${result.data.fileName} • ${(result.data.size / 1024).toFixed(0)} KB`,
          variant: "success",
        });
        await refreshProject();
      } else {
        addToast({
          title: `Export failed`,
          description: result.error || `Could not generate ${type.toUpperCase()}`,
          variant: "error",
        });
      }
    } catch (e) {
      addToast({
        title: "Export failed",
        description: e instanceof Error ? e.message : "An unknown error occurred",
        variant: "error",
      });
    } finally {
      setExporting((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleGenerateLLMKit = async () => {
    if (!project) return;
    if (isFreePlanLimitReached) {
      setPaywallOpen(true);
      return;
    }

    // Simulate generation
    const now = new Date().toISOString();
    const asset: GeneratedAssetMeta = {
      type: "linkedin_kit",
      fileName: `linkedin-kit-${now}.zip`,
      url: "https://example.com/mock-linkedin-kit",
      createdAt: now,
      size: 128000,
      label: "LinkedIn Kit",
    };
    recordAsset(asset);
    analytics.exportDownloaded(project.id, "linkedin_kit");
    addToast({ title: "LinkedIn Kit generated", description: asset.fileName, variant: "success" });
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
              <div className="p-2 rounded-lg bg-accent/20 text-accent" aria-hidden="true">
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
                  Includes executive summary, detailed findings, and
                  recommendations
                </p>
                <p className="text-11 text-text-tertiary">
                  Perfect for sharing with advisors or keeping for your records
                </p>
              </div>
              <Button variant="solid" className="gap-2" disabled={exporting.pdf} onClick={() => void handleExport("pdf")}
                aria-busy={exporting.pdf} aria-live="polite">
                {exporting.pdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" /> Export PDF
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20 text-success" aria-hidden="true">
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
              <Button variant="solid" className="gap-2" disabled={exporting.pptx} onClick={() => void handleExport("pptx")}
                aria-busy={exporting.pptx} aria-live="polite">
                {exporting.pptx ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" /> Export PPTX
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/20 text-warning" aria-hidden="true">
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
              <Button variant="ghost" className="gap-2" disabled={exporting.json} onClick={() => void handleExport("json")}
                aria-busy={exporting.json} aria-live="polite">
                {exporting.json ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" /> Export JSON
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent" aria-hidden="true">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Generate LinkedIn Kit</CardTitle>
                <CardDescription>
                  Captions, carousel outline, comments, and DMs for outreach
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-13 text-text-secondary">
                  We will generate a set of ready-to-use assets from your results
                </p>
                <p className="text-11 text-text-tertiary">May be limited on free plan</p>
              </div>
              <Button variant="accent" className="gap-2" onClick={() => void handleGenerateLLMKit()}>
                <Sparkles className="w-4 h-4" /> Generate Kit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="solid" padding="lg">
          <CardHeader>
            <CardTitle>Available Downloads</CardTitle>
            <CardDescription>Previously generated assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.length === 0 ? (
              <p className="text-13 text-text-secondary">No exports yet. Generate a report to see it here.</p>
            ) : (
              <ul className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
                {assets.map((a, idx) => (
                  <li key={`${a.type}-${idx}`} className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-13 text-text-primary truncate">{a.label || a.type.toUpperCase()} • {a.fileName}</p>
                      <p className="text-11 text-text-tertiary">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-13 underline text-accent hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
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

      <PaywallDialog
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        title="Upgrade to unlock unlimited exports"
        description="You've used your free export. Upgrade to continue generating reports and kits."
        plans={[
          {
            name: "Starter",
            description: "Perfect for trying things out",
            price: "$9",
            period: "/mo",
            features: ["5 exports/mo", "LLM kits", "Email support"],
            badge: "Popular",
            highlighted: true,
          },
          {
            name: "Pro",
            description: "For power users",
            price: "$29",
            period: "/mo",
            features: ["Unlimited exports", "Priority support", "Team seats"],
          },
        ]}
        onSelectPlan={(plan) => {
          setPaywallOpen(false);
          addToast({ title: `Selected ${plan}`, description: "Billing not implemented in demo.", variant: "success" });
        }}
      />
    </m.div>
  );
}
