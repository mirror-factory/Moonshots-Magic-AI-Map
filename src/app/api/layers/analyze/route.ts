/**
 * @module api/layers/analyze
 * POST route that generates AI analysis of data layer content.
 * Uses Claude Haiku for fast, concise insights about live city data.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { DATA_LAYER_CONFIGS, type DataLayerKey } from "@/lib/map/data-layers";

/** Maximum response time before timeout. */
export const maxDuration = 15;

/** Analysis prompt templates per layer type. */
const LAYER_PROMPTS: Partial<Record<DataLayerKey, string>> = {
  weather:
    "Analyze this Orlando weather data. Mention temperature, conditions, and any recommendations for outdoor events. Be concise (2-3 sentences).",
  transit:
    "Summarize this LYNX bus transit data for Orlando. Note how many buses are active, any patterns, and coverage. Be concise (2-3 sentences).",
  cityData:
    "Summarize this Orlando city data. First briefly explain what code enforcement cases are (property maintenance violations, zoning issues, building code complaints reported by residents — things like overgrown lots, unpermitted construction, signage violations). Then note patterns, hotspots, or notable activity in the data. Be concise (3-4 sentences).",
  nwsAlerts:
    "Summarize these NWS weather alerts for Central Florida. Note the severity, type of alert, and any actions people should take. Be concise (2-3 sentences).",
  aircraft:
    "Summarize this live aircraft data near Orlando International Airport (MCO). Note how many planes are in the air, altitude patterns, and traffic level. Be concise (2-3 sentences).",
  sunrail:
    "Summarize this SunRail commuter rail data. Describe the route coverage from DeBary to Poinciana, the three zones, and how many stations there are. Be concise (2-3 sentences).",
  countyData:
    "Summarize this Orange County GIS data showing parks, trails, public art installations, and fire stations. Note the distribution and any interesting highlights. Be concise (2-3 sentences).",
  developments:
    "Summarize these Downtown Orlando DDB development projects. Mention the total investment pipeline, 2-3 notable projects by name with dollar amounts, and the overall status mix. Be concise (2-3 sentences max).",
};

/** Prompt for analyzing a single development project. */
const SINGLE_PROJECT_PROMPT =
  "Describe this Downtown Orlando development project. Note its significance, what it brings to the neighborhood, and any notable details about timeline or investment. Be conversational and concise (1-2 sentences).";

/** Development project shape for condensed formatting. */
interface DevProjectForAnalysis {
  name: string;
  status: string;
  category?: string;
  investment?: string | null;
  timelineStart?: string | null;
  timelineCompletion?: string | null;
  description?: string;
}

/**
 * Creates a condensed text summary of development projects for AI analysis.
 * Fits all 35 projects within token limits by using abbreviated format.
 */
function condenseDevelopmentsData(data: unknown): string {
  const d = data as { projects?: DevProjectForAnalysis[]; summary?: Record<string, number> };
  const projects = d.projects ?? [];
  const summary = d.summary;

  const lines: string[] = [];

  if (summary) {
    lines.push(`Summary: ${summary.total} projects — ${summary.proposed ?? 0} proposed, ${summary.inProgress ?? 0} in-progress, ${summary.completed ?? 0} completed`);
  }

  lines.push("");
  for (const p of projects) {
    const parts = [p.name, p.status];
    if (p.category) parts.push(p.category);
    if (p.investment) parts.push(p.investment);
    if (p.timelineStart && p.timelineStart !== "TBD") parts.push(`start: ${p.timelineStart}`);
    if (p.timelineCompletion && p.timelineCompletion !== "TBD") parts.push(`completion: ${p.timelineCompletion}`);
    lines.push(`- ${parts.join(" | ")}`);
  }

  return lines.join("\n");
}

/**
 * Generates AI analysis for a data layer.
 * @param req - Request with layerKey and data in body.
 * @returns JSON with analysis string.
 */
export async function POST(req: NextRequest) {
  try {
    const { layerKey, data } = (await req.json()) as {
      layerKey: DataLayerKey;
      data: unknown;
    };

    if (!layerKey || !DATA_LAYER_CONFIGS[layerKey]) {
      return NextResponse.json(
        { error: "Invalid layer key" },
        { status: 400 },
      );
    }

    // Detect single-project analysis (per-project carousel navigation)
    const singleProject = (data as { project?: DevProjectForAnalysis }).project;
    const isSingleProject = layerKey === "developments" && !!singleProject;

    const prompt = isSingleProject
      ? SINGLE_PROJECT_PROMPT
      : LAYER_PROMPTS[layerKey] ?? `Analyze this ${DATA_LAYER_CONFIGS[layerKey].label} data for Orlando. Summarize key insights in 2-3 sentences.`;

    // Use condensed format for developments to fit all projects within limits
    let dataStr: string;
    if (isSingleProject) {
      const p = singleProject!;
      const parts = [p.name, p.status];
      if (p.category) parts.push(p.category);
      if (p.investment) parts.push(p.investment);
      if (p.description) parts.push(p.description);
      if (p.timelineStart) parts.push(`start: ${p.timelineStart}`);
      if (p.timelineCompletion) parts.push(`completion: ${p.timelineCompletion}`);
      dataStr = parts.join(" | ");
    } else if (layerKey === "developments") {
      dataStr = condenseDevelopmentsData(data);
    } else {
      dataStr = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    }

    // Truncate data to avoid exceeding context limits
    const maxChars = isSingleProject ? 1000 : layerKey === "developments" ? 6000 : 4000;
    const truncatedData = dataStr.length > maxChars ? dataStr.slice(0, maxChars) + "\n..." : dataStr;

    const modelId = "anthropic/claude-haiku-4.5";
    const maxTokens = isSingleProject ? 100 : 200;

    const { text } = await generateText({
      model: gateway(modelId),
      system:
        "You are the AI assistant for Moonshots & Magic — an interactive Orlando events map. Provide brief, helpful analysis of live city data. Use a friendly, knowledgeable tone. No markdown formatting.",
      prompt: `${prompt}\n\nData:\n${truncatedData}`,
      maxOutputTokens: maxTokens,
    });

    return NextResponse.json({ analysis: text, model: modelId });
  } catch (error) {
    console.error("[Analyze] Error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 },
    );
  }
}
