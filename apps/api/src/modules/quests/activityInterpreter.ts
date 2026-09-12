import { ActivityInterpretationSchema, type ActivityInterpretation, type ActivityInterpretationRequest } from "@liferpg/contracts";
import { env } from "../../config/env.js";

export interface ActivityInterpreter {
  interpret(request: ActivityInterpretationRequest): Promise<ActivityInterpretation>;
}

const categoryAttributes: Record<string, string[]> = {
  mind: ["intellect", "discipline"],
  body: ["strength", "discipline"],
  career: ["discipline", "intellect"],
  life: ["discipline", "wisdom"],
  social: ["social", "wisdom"],
  growth: ["creativity", "wisdom"],
};

function fallbackInterpret(request: ActivityInterpretationRequest): ActivityInterpretation {
  const text = request.text.trim();
  const normalized = text.toLowerCase();
  const attributes = categoryAttributes[request.categoryId] ?? categoryAttributes.life;
  const duration = normalized.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|minutes?|mins?)/i);
  const distance = normalized.match(/(\d+(?:\.\d+)?)\s*(km|kilometers?|miles?)/i);
  const count = normalized.match(/(\d+)\s*(problems?|pages?|reps?|times?)/i);
  const isStudy = /study|learn|read|course|practice|revise/i.test(normalized);
  const isExercise = /run|walk|jog|exercise|workout|cycle|swim/i.test(normalized);
  const isBuild = /build|code|develop|project|authentication/i.test(normalized);
  const isCleaning = /clean|organize|laundry|dishes|tidy/i.test(normalized);

  let activityType = "life-task";
  let metric: ActivityInterpretation["metric"] = "completion";
  let value: number | undefined;
  let unit: string | undefined;
  let difficultyBand: ActivityInterpretation["difficultyBand"] = "medium";

  if (isStudy) {
    activityType = "study";
    difficultyBand = "medium";
  } else if (isExercise) {
    activityType = "exercise";
    difficultyBand = "medium";
  } else if (isBuild) {
    activityType = "software-development";
    difficultyBand = "hard";
  } else if (isCleaning) {
    activityType = "cleaning";
    difficultyBand = "easy";
  }

  if (duration) {
    metric = "duration";
    value = Number(duration[1] ?? 0) * (/hour|hr/i.test(duration[2] ?? "") ? 60 : 1);
    unit = "minutes";
  } else if (distance) {
    metric = "distance";
    value = Number(distance[1] ?? 0);
    unit = /mile/i.test(distance[2] ?? "") ? "miles" : "km";
  } else if (count) {
    metric = /page/i.test(count[2] ?? "") ? "pages" : "count";
    value = Number(count[1] ?? 0);
    unit = (count[2] ?? "count").toLowerCase();
  }

  const confidence = duration || distance || count || isStudy || isExercise || isBuild || isCleaning ? 0.92 : 0.42;
  return ActivityInterpretationSchema.parse({
    activityType,
    metric,
    value,
    unit,
    polarity: "positive",
    difficultyBand,
    attributeHints: attributes,
    confidence,
    normalizedTitle: text,
    clarificationNeeded: confidence < 0.7,
    clarificationPrompt: confidence < 0.7 ? "What outcome or amount would make this activity complete?" : undefined,
  });
}

export class FallbackActivityInterpreter implements ActivityInterpreter {
  async interpret(request: ActivityInterpretationRequest): Promise<ActivityInterpretation> {
    return fallbackInterpret(request);
  }
}

export class GeminiActivityInterpreter implements ActivityInterpreter {
  private readonly fallback = new FallbackActivityInterpreter();

  async interpret(request: ActivityInterpretationRequest): Promise<ActivityInterpretation> {
    if (!env.GEMINI_API_KEY) return this.fallback.interpret(request);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Return only JSON matching this activity schema. Never include rewards or IDs. Category: ${request.categoryId}. Activity: ${request.text}` }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });
    if (!response.ok) return this.fallback.interpret(request);

    const payload: unknown = await response.json();
    const candidate = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return this.fallback.interpret(request);
    try {
      return ActivityInterpretationSchema.parse(JSON.parse(candidate));
    } catch {
      return this.fallback.interpret(request);
    }
  }
}

export const activityInterpreter: ActivityInterpreter = new GeminiActivityInterpreter();