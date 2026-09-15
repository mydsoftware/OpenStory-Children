import { z } from "zod";

export const AgeBandSchema = z.enum(["2-3", "4-5", "6-8", "9-12"]);
export const LanguageSchema = z.enum(["fa", "en"]);

export const StoryInputSchema = z.object({
  idea: z.string().min(1),
  ageBand: AgeBandSchema,
  language: LanguageSchema.default("fa"),
  pageCount: z.number().int().min(1).max(64).default(10)
});

export const CharacterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  visualTraits: z.array(z.string()),
  version: z.number().int().positive().default(1)
});

export const PanelSchema = z.object({
  id: z.string(),
  narration: z.string().default(""),
  dialogue: z.array(z.string()).default([]),
  characterIds: z.array(z.string()).default([])
});

export const PageSchema = z.object({
  id: z.string(),
  pageNumber: z.number().int().positive(),
  title: z.string(),
  panels: z.array(PanelSchema).min(1)
});

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  language: LanguageSchema,
  ageBand: AgeBandSchema,
  characters: z.array(CharacterSchema),
  pages: z.array(PageSchema).min(1),
  sourceIdea: z.string().min(1),
  schemaVersion: z.literal(1)
});

export type StoryInput = z.infer<typeof StoryInputSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Book = z.infer<typeof BookSchema>;
