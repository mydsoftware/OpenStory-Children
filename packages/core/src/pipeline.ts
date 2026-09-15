import type { StoryInput, Book } from "./schemas.js";
import { generateStoryBook, planStory } from "./story-engine.js";
export { generateStoryBook, planStory } from "./story-engine.js";
export { validateBook, repairBook } from "./qa.js";
export { renderBookHtml } from "./renderer.js";
export { createOllamaConfig, createOpenAICompatibleConfig, createComfyUIConfig } from "./providers.js";
export interface LLMProvider { generateStructured<T>(input: { prompt: string; schema: unknown }): Promise<T>; }
export interface ImageProvider { generate(input: { prompt: string; references?: string[] }): Promise<{ assetId: string; url: string }>; }
export function createDeterministicBook(rawInput: StoryInput): Book { return generateStoryBook(rawInput); }
