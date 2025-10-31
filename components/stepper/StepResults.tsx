"use client";

import { m } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MeterBar } from "@/components/ui/MeterBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  TrendingUp,
  AlertCircle,
  Gauge,
  Image as ImageIcon,
  ListChecks,
} from "lucide-react";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useProjectStore } from "@/lib/stores/useProjectStore";

export function StepResults() {
  const { project } = useProjectStore();
  const results = project?.data.results;
  const scoring = results?.scoringResult;
  const llm = results?.llmOutputs;

  const dimensionScores = scoring?.dimensionScores;

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
        <Card aria-live="polite">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <Gauge className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Deterministic Scores</CardTitle>
                <CardDescription>
                  Overall score and dimension breakdown
                </CardDescription>
              </div>
              {typeof scoring?.overallScore === "number" && (
                <Badge variant="accent">{Math.round(scoring.overallScore)}/100</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {dimensionScores ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="group" aria-label="Dimension scores">
                <MeterBar label="Value" value={Math.round(dimensionScores.value)} />
                <MeterBar label="Urgency" value={Math.round(dimensionScores.urgency)} />
                <MeterBar label="Certainty" value={Math.round(dimensionScores.certainty)} />
                <MeterBar label="Effort" value={Math.round(dimensionScores.effort)} />
                <MeterBar label="Specificity" value={Math.round(dimensionScores.specificity)} />
                <MeterBar label="Proof" value={Math.round(dimensionScores.proof)} />
              </div>
            ) : (
              <p className="text-13 text-text-secondary">
                Run analysis to see your score breakdown.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-success/20 text-success">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Top Fixes</CardTitle>
                <CardDescription>
                  Highest impact improvements based on model and scoring
                </CardDescription>
              </div>
              <Badge variant="success">{llm?.fixSuggestions?.length || scoring?.leverDeltas?.length || 0} Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {llm?.fixSuggestions?.length ? (
              <ul className="space-y-2 text-13 text-text-primary">
                {llm.fixSuggestions.slice(0, 5).map((fix, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            ) : scoring?.leverDeltas?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-13">
                  <thead className="text-text-tertiary">
                    <tr>
                      <th className="text-left font-medium p-2">Lever</th>
                      <th className="text-right font-medium p-2">Current</th>
                      <th className="text-right font-medium p-2">Delta</th>
                      <th className="text-right font-medium p-2">EV Lift</th>
                      <th className="text-right font-medium p-2">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoring.leverDeltas.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-white/10">
                        <td className="p-2 capitalize">{row.lever}</td>
                        <td className="p-2 text-right">{Math.round(row.currentScore)}</td>
                        <td className="p-2 text-right">{Math.round(row.delta)}</td>
                        <td className="p-2 text-right">{Math.round(row.evLiftPercentage * 100)}%</td>
                        <td className="p-2 text-right">{row.estimatedHours ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-13 text-text-secondary">No fixes yet. Run analysis first.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <ListChecks className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>LLM Outputs</CardTitle>
                <CardDescription>
                  Objections, recommendations, and conversion kit ideas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList aria-label="LLM outputs tabs">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="objections">Objection Pack</TabsTrigger>
                <TabsTrigger value="copy">Copy Rewrite</TabsTrigger>
                <TabsTrigger value="insights">Strengths/Weaknesses</TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations" className="mt-4">
                {llm?.recommendations?.length ? (
                  <ul className="space-y-2 text-13 text-text-primary">
                    {llm.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-13 text-text-secondary">No recommendations available.</p>
                )}
              </TabsContent>
              <TabsContent value="objections" className="mt-4">
                {llm?.objectionHandlers?.length ? (
                  <ul className="space-y-2 text-13 text-text-primary">
                    {llm.objectionHandlers.map((obj, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-13 text-text-secondary">No objection handlers available.</p>
                )}
              </TabsContent>
              <TabsContent value="copy" className="mt-4">
                <div className="space-y-2">
                  <p className="text-13 text-text-secondary">Suggested copy based on your inputs:</p>
                  <div className="p-4 rounded-xl border border-white/10 bg-glass">
                    <p className="text-18 font-semibold text-text-primary">
                      {project?.data.mechanism
                        ? `${project.data.mechanism.split(" ").slice(0, 3).join(" ")}`
                        : "Upgrade your results with a clearer offer"}
                    </p>
                    <p className="text-13 text-text-secondary mt-1">
                      {project?.data.icp && project?.data.goal
                        ? `For ${project.data.icp.split(" ").slice(0, 6).join(" ")}, to ${project.data.goal}`
                        : "Clarify your value proposition and reduce friction to convert more."}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-md bg-success/20 text-success">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h3 className="text-15 font-medium">Strengths</h3>
                    </div>
                    {llm?.strengths?.length ? (
                      <ul className="space-y-2 text-13 text-text-primary">
                        {llm.strengths.map((s, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-success">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-13 text-text-secondary">No strengths identified.</p>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-md bg-warning/20 text-warning">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <h3 className="text-15 font-medium">Weaknesses</h3>
                    </div>
                    {llm?.weaknesses?.length ? (
                      <ul className="space-y-2 text-13 text-text-primary">
                        {llm.weaknesses.map((w, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-warning">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-13 text-text-secondary">No weaknesses identified.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/20 text-accent">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <CardTitle>Screenshot</CardTitle>
                <CardDescription>Captured from your URL</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {results?.screenshot?.signedUrl ? (
              <div className="rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={results.screenshot.signedUrl}
                  alt="Offer page screenshot"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <p className="text-13 text-text-secondary">No screenshot captured.</p>
            )}
          </CardContent>
        </Card>
      </m.div>
    </m.div>
  );
}
