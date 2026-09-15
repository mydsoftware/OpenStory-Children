import type { StoryInput, Book, Character } from "./schemas.js";
import { StoryInputSchema, BookSchema } from "./schemas.js";

export interface LLMProvider {
  generateStructured<T>(input: { prompt: string; schema: unknown }): Promise<T>;
}

export interface ImageProvider {
  generate(input: { prompt: string; references?: string[] }): Promise<{ assetId: string; url: string }>;
}

export function createDeterministicBook(rawInput: StoryInput): Book {
  const input = StoryInputSchema.parse(rawInput);
  const character: Character = {
    id: "character-dino",
    name: "دینو",
    description: "یک داینوسور کوچولوی مهربان و کنجکاو",
    visualTraits: ["سبز", "کوچک", "چشم‌های بزرگ", "لبخند مهربان"],
    version: 1
  };
  const pages = Array.from({ length: input.pageCount }, (_, index) => ({
    id: `page-${index + 1}`,
    pageNumber: index + 1,
    title: index === 0 ? "شروع ماجرا" : `صفحه ${index + 1}`,
    panels: [{
      id: `panel-${index + 1}-1`,
      narration: index === 0 ? input.idea : "دینو قدم بعدی ماجراجویی را برمی‌دارد.",
      dialogue: [],
      characterIds: [character.id]
    }]
  }));

  return BookSchema.parse({
    id: "book-local-demo",
    title: "ماجراجویی دینو",
    language: input.language,
    ageBand: input.ageBand,
    characters: [character],
    pages,
    sourceIdea: input.idea,
    schemaVersion: 1
  });
}
