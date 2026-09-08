import { createServerFn } from "@tanstack/react-start";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

export const MODES = ["simplify", "steps", "show", "read", "respond"] as const;
export type Mode = (typeof MODES)[number];

export const FOLLOW_UPS = ["another_way", "simpler", "example", "more_detail"] as const;
export type FollowUp = (typeof FOLLOW_UPS)[number];

const InputSchema = z.object({
  mode: z.enum(MODES),
  text: z.string().min(1).max(12000),
  followUp: z.enum(FOLLOW_UPS).optional(),
  previous: z.string().max(12000).optional(),
});

export type AssistResult = {
  title: string;
  body: string;
  steps: string[];
  question: string;
  caution: string;
};

const EMPTY_RESULT: AssistResult = {
  title: "",
  body: "",
  steps: [],
  question: "",
  caution: "",
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanSteps(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripCodeFences(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function normalizeStructuredResult(value: unknown): AssistResult | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;

  const result: AssistResult = {
    title: cleanString(record.title),
    body: cleanString(record.body ?? record.explanation ?? record.response ?? record.answer),
    steps: cleanSteps(record.steps),
    question: cleanString(record.question),
    caution: cleanString(record.caution),
  };

  if (!result.title && !result.body && result.steps.length === 0 && !result.question && !result.caution) return null;
  return result;
}

function plainTextFallback(value: string): string {
  return value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/^\s*[\[{]\s*$/, "")
    .replace(/^\s*[\]}]\s*,?\s*$/, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (/^"?(title|body|steps|question|caution|explanation|response|answer)"?\s*:\s*(null|undefined|""|\[\])\s*,?$/i.test(line)) {
        return false;
      }
      if (/^"?(title|body|steps|question|caution|explanation|response|answer)"?\s*:\s*/i.test(line)) {
        return false;
      }
      return !/^[\[\]{},]+$/.test(line);
    })
    .map((line) => line.replace(/^"|",?$/g, "").replace(/\\n/g, "\n"))
    .join("\n")
    .trim();
}

export function normalizeAssistPayload(value: unknown, depth = 0): AssistResult {
  if (depth > 3) return { ...EMPTY_RESULT };

  const structured = normalizeStructuredResult(value);
  if (structured) return structured;

  if (typeof value !== "string") return { ...EMPTY_RESULT };

  const cleaned = stripCodeFences(value);
  if (!cleaned) return { ...EMPTY_RESULT };

  try {
    const parsed = JSON.parse(cleaned) as unknown;
    const parsedStructured = normalizeStructuredResult(parsed);
    if (parsedStructured) return parsedStructured;

    if (typeof parsed === "string") {
      return normalizeAssistPayload(parsed, depth + 1);
    }
  } catch {
    // Fall through to the human-readable text cleaner.
  }

  return {
    ...EMPTY_RESULT,
    body: plainTextFallback(cleaned),
  };
}

const BASE_RULES = `You are ClearPath, an accessibility tool that helps people understand everyday language.

How you write:
- Use direct, concrete language and short sentences.
- Avoid jargon. If a term must be used, explain it in plain words.
- Never talk down to the person. They are an adult. Accessibility does not mean infantilization. No baby talk, no praise for reading, no emoji.
- Preserve the meaning of the source material exactly. Do not add facts.
- If something is unclear or uncertain, say so plainly.
- Ask at most ONE clarification question, only if you truly cannot proceed. Put it in the "question" field.

Safety:
- You are not a doctor, therapist, caregiver, teacher, lawyer, or any licensed professional, and you never act as one.
- Never diagnose a disability or medical condition, and never comment on the person's abilities.
- For medical, legal, financial, emergency or other high-stakes content: explain what the words mean, and use the "caution" field to state clearly that this is an explanation of the language, not professional advice.
- Leave "caution" empty when the content is ordinary.`;

const MODE_RULES: Record<Mode, string> = {
  simplify:
    'Rewrite the text in clearer language while keeping every part of its meaning. Put the rewrite in "body". Give a short plain-language "title" saying what the text is about. Leave "steps" empty.',
  steps:
    'Break what the person needs to do into small, ordered steps. Each step is one action, written in plain words, in "steps". Put a one-sentence overview in "body" and a short "title". Do not number the steps yourself.',
  show:
    'Explain the meaning using one concrete example, analogy or demonstration that a person can picture. Put it in "body" with a short "title". Leave "steps" empty.',
  read: 'Prepare the content to be read aloud: plain sentences, no symbols, abbreviations spelled out, no bullet characters. Put the spoken text in "body" and a short "title". Leave "steps" empty.',
  respond:
    'First explain in "body" what the other person is asking for. Then give a suggested reply the person can use or change, introduced clearly as a suggestion. State that nothing is sent anywhere; they choose what to do with it. Leave "steps" empty.',
};

const FOLLOW_UP_RULES: Record<FollowUp, string> = {
  another_way: "Explain the same thing a different way. Use a different structure and different words.",
  simpler: "Explain it more simply again: shorter sentences, more common words. Keep the meaning intact.",
  example: "Give a concrete, everyday example that shows what this means in practice.",
  more_detail: "Give more detail, still in plain language. Add the parts that were left out before.",
};

export const assist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AssistResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured.");

    const { createLovableAiGatewayProvider, CLEARPATH_MODEL } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    const parts = [BASE_RULES, MODE_RULES[data.mode]];
    if (data.followUp) parts.push(FOLLOW_UP_RULES[data.followUp]);

    const userParts = [`The person's text:\n\n${data.text}`];
    if (data.followUp && data.previous) {
      userParts.push(`Your previous answer:\n\n${data.previous}`);
    }

    try {
      const result = await generateText({
        model: gateway(CLEARPATH_MODEL),
        system: parts.join("\n\n"),
        prompt: userParts.join("\n\n---\n\n"),
        output: Output.object({
          schema: z.object({
            title: z.string().nullish(),
            body: z.string().nullish(),
            steps: z.array(z.string()).nullish(),
            question: z.string().nullish(),
            caution: z.string().nullish(),
          }),
        }),
      });
      return normalizeAssistPayload(result.output);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        return normalizeAssistPayload(error.text);
      }
      throw error;
    }
  });
