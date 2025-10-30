import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LLMPromptOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function callLLM(options: LLMPromptOptions): Promise<LLMResponse> {
  const {
    systemPrompt,
    userPrompt,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  const content = response.choices[0]?.message?.content || "";
  const usage = response.usage
    ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      }
    : undefined;

  return { content, usage };
}

export interface OfferAnalysisInputs {
  url?: string;
  pdfText?: string;
  icp?: string;
  priceTerms?: string;
  mechanism?: string;
  primaryObjection?: string;
  goal?: string;
}

export interface OfferAnalysisLLMOutputs {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  fixSuggestions: string[];
  objectionHandlers: string[];
  conversionKits: string[];
}

export async function generateOfferAnalysis(
  inputs: OfferAnalysisInputs
): Promise<OfferAnalysisLLMOutputs> {
  const systemPrompt = `You are an expert offer analyst and conversion optimization specialist. 
Your task is to analyze offers and provide detailed, actionable insights.
Focus on value proposition clarity, urgency, certainty, proof, and conversion elements.`;

  const userPrompt = `Analyze this offer and provide detailed insights:

${inputs.url ? `URL: ${inputs.url}` : ""}
${inputs.pdfText ? `Offer Content:\n${inputs.pdfText.slice(0, 8000)}` : ""}
${inputs.icp ? `\nIdeal Customer Profile: ${inputs.icp}` : ""}
${inputs.priceTerms ? `\nPrice Terms: ${inputs.priceTerms}` : ""}
${inputs.mechanism ? `\nMechanism: ${inputs.mechanism}` : ""}
${inputs.primaryObjection ? `\nPrimary Objection: ${inputs.primaryObjection}` : ""}
${inputs.goal ? `\nGoal: ${inputs.goal}` : ""}

Please provide:
1. Top 5 strengths of the offer
2. Top 5 weaknesses or areas for improvement
3. Top 5 actionable recommendations
4. Top 5 specific fixes to implement
5. Top 5 ways to handle the primary objection
6. Top 5 conversion kit ideas (lead magnets, tripwires, etc.)

Format your response as JSON with these keys:
{
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "fixSuggestions": ["fix 1", "fix 2", ...],
  "objectionHandlers": ["handler 1", "handler 2", ...],
  "conversionKits": ["kit 1", "kit 2", ...]
}`;

  const response = await callLLM({
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    maxTokens: 3000,
  });

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      recommendations: parsed.recommendations || [],
      fixSuggestions: parsed.fixSuggestions || [],
      objectionHandlers: parsed.objectionHandlers || [],
      conversionKits: parsed.conversionKits || [],
    };
  } catch (error) {
    console.error("Failed to parse LLM response:", error);
    return {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      fixSuggestions: [],
      objectionHandlers: [],
      conversionKits: [],
    };
  }
}
