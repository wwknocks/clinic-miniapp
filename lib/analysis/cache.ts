import crypto from "crypto";
import { ProjectData } from "@/types/project";

export interface CacheableInputs {
  sourceType?: string;
  url?: string;
  pdfPath?: string;
  icp?: string;
  priceTerms?: string;
  proofLinks?: string[];
  mechanism?: string;
  primaryObjection?: string;
  goal?: string;
}

export function computeInputsHash(inputs: CacheableInputs): string {
  const normalizedInputs = {
    sourceType: inputs.sourceType || "",
    url: inputs.url || "",
    pdfPath: inputs.pdfPath || "",
    icp: inputs.icp || "",
    priceTerms: inputs.priceTerms || "",
    proofLinks: (inputs.proofLinks || []).sort().join(","),
    mechanism: inputs.mechanism || "",
    primaryObjection: inputs.primaryObjection || "",
    goal: inputs.goal || "",
  };

  const inputString = JSON.stringify(normalizedInputs);
  return crypto.createHash("sha256").update(inputString).digest("hex");
}

export function isCacheValid(
  projectData: ProjectData | Record<string, unknown>
): boolean {
  const data = projectData as ProjectData;
  if (!data.results?.inputsHash || !data.results?.cachedAt) {
    return false;
  }

  const currentHash = computeInputsHash({
    sourceType: data.sourceType,
    url: data.url,
    pdfPath: data.pdfPath,
    icp: data.icp,
    priceTerms: data.priceTerms,
    proofLinks: data.proofLinks,
    mechanism: data.mechanism,
    primaryObjection: data.primaryObjection,
    goal: data.goal,
  });

  return currentHash === data.results.inputsHash;
}
