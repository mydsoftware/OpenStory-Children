import { BookSchema, StoryInputSchema, type Book, type StoryInput } from "./schemas.js";
import type { LLMProvider } from "./providers.js";
import { generateStoryBook } from "./story-engine.js";

const bookJsonSchema = {
  type: "object",
  required: ["id", "title", "language", "ageBand", "characters", "pages", "sourceIdea", "schemaVersion"],
  properties: {
    id: { type: "string" }, title: { type: "string" }, language: { enum: ["fa", "en"] }, ageBand: { enum: ["2-3", "4-5", "6-8", "9-12"] }, sourceIdea: { type: "string" }, schemaVersion: { const: 1 },
    characters: { type: "array", items: { type: "object", required: ["id", "name", "description", "visualTraits", "version"], properties: { id: { type: "string" }, name: { type: "string" }, description: { type: "string" }, visualTraits: { type: "array", items: { type: "string" } }, version: { type: "integer" }, referenceAssetIds: { type: "array", items: { type: "string" } } } } },
    pages: { type: "array", items: { type: "object", required: ["id", "pageNumber", "title", "panels"], properties: { id: { type: "string" }, pageNumber: { type: "integer" }, title: { type: "string" }, panels: { type: "array", items: { type: "object", required: ["id", "narration", "dialogue", "characterIds", "assetIds"], properties: { id: { type: "string" }, narration: { type: "string" }, dialogue: { type: "array", items: { type: "string" } }, characterIds: { type: "array", items: { type: "string" } }, assetIds: { type: "array", items: { type: "string" } } } } } } } }
  }
} as const;

export async function generateStoryBookWithLLM(rawInput: StoryInput, provider: LLMProvider): Promise<Book> {
  const input = StoryInputSchema.parse(rawInput);
  const prompt = [
    "You are the story production engine for OpenStory Children.",
    "Return ONLY valid JSON matching the supplied schema. No markdown.",
    `Language: ${input.language}; age band: ${input.ageBand}; pages: ${input.pageCount}.`,
    "Create a warm, child-safe comic. Keep the same character identity across all pages. Avoid violence, sexual content, drugs, self-harm and frightening graphic content.",
    `User idea: ${input.idea}`
  ].join("\n");
  const result = await provider.generateStructured<unknown>({ prompt, schema: bookJsonSchema });
  const parsed = BookSchema.parse(result);
  if (parsed.pages.length !== input.pageCount) throw new Error(`LLM returned ${parsed.pages.length} pages; expected ${input.pageCount}.`);
  if (parsed.language !== input.language || parsed.ageBand !== input.ageBand) throw new Error("LLM output does not match the requested language or age band.");
  return parsed;
}

export async function generateWithFallback(rawInput: StoryInput, provider?: LLMProvider): Promise<{ book: Book; usedFallback: boolean }> {
  if (!provider) return { book: generateStoryBook(rawInput), usedFallback: true };
  try { return { book: await generateStoryBookWithLLM(rawInput, provider), usedFallback: false }; }
  catch { return { book: generateStoryBook(rawInput), usedFallback: true }; }
}
