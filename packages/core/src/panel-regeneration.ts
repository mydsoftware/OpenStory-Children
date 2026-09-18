import type { Book, Panel } from "./schemas.js";
import type { LLMProvider } from "./providers.js";
import { BookSchema } from "./schemas.js";

const panelJsonSchema = {
  type: "object",
  required: ["narration", "dialogue"],
  properties: {
    narration: { type: "string" },
    dialogue: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 }
  }
} as const;

export interface PanelRegenerationResult {
  book: Book;
  usedFallback: boolean;
  providerError?: string;
}

function fallbackPanel(book: Book, pageIndex: number, panel: Panel): Panel {
  const page = book.pages[pageIndex]!;
  const names = panel.characterIds
    .map(id => book.characters.find(character => character.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  const subject = names.join(" و ") || "قهرمان کوچولو";
  return {
    ...panel,
    narration: `${subject} در صفحه ${page.pageNumber} آرام و با شادی ادامه می‌دهد: ${page.title}.`,
    dialogue: ["من می‌تونم با مهربانی ادامه بدم! 🌈"],
    assetIds: []
  };
}

export async function regeneratePanel(
  book: Book,
  pageId: string,
  panelId: string,
  provider?: LLMProvider
): Promise<PanelRegenerationResult> {
  const pageIndex = book.pages.findIndex(page => page.id === pageId);
  if (pageIndex < 0) throw new Error("Page not found.");
  const page = book.pages[pageIndex]!;
  const panelIndex = page.panels.findIndex(panel => panel.id === panelId);
  if (panelIndex < 0) throw new Error("Panel not found.");
  const panel = page.panels[panelIndex]!;

  if (!provider) {
    const nextPanel = fallbackPanel(book, pageIndex, panel);
    const nextBook = BookSchema.parse({ ...book, pages: book.pages.map((p, i) => i === pageIndex ? { ...p, panels: p.panels.map((x, j) => j === panelIndex ? nextPanel : x) } : p) });
    return { book: nextBook, usedFallback: true };
  }

  try {
    const characters = panel.characterIds
      .map(id => book.characters.find(character => character.id === id))
      .filter((character): character is NonNullable<typeof character> => Boolean(character));
    const prompt = [
      "You are regenerating exactly one panel of a children's comic.",
      "Return ONLY valid JSON matching the supplied schema.",
      `Language: ${book.language}; age band: ${book.ageBand}.`,
      `Book title: ${book.title}; page ${page.pageNumber}: ${page.title}.`,
      `Characters: ${characters.map(c => `${c.name}: ${c.description}; traits: ${c.visualTraits.join(", ")}`).join(" | ") || "none"}.`,
      `Current narration: ${panel.narration}`,
      `Current dialogue: ${panel.dialogue.join(" | ")}`,
      "Keep the same characters and continuity. Make the panel warm, safe, age-appropriate and non-graphic.",
      "Do not introduce new characters. Do not change character identity. Keep narration concise and dialogue natural."
    ].join("\n");
    const result = await provider.generateStructured<{ narration: string; dialogue: string[] }>({ prompt, schema: panelJsonSchema });
    const nextPanel: Panel = { ...panel, narration: String(result.narration ?? "").trim(), dialogue: Array.isArray(result.dialogue) ? result.dialogue.map(String).map(x => x.trim()).filter(Boolean) : [], assetIds: [] };
    if (!nextPanel.narration || nextPanel.dialogue.length === 0) throw new Error("LLM returned an empty panel.");
    const nextBook = BookSchema.parse({ ...book, pages: book.pages.map((p, i) => i === pageIndex ? { ...p, panels: p.panels.map((x, j) => j === panelIndex ? nextPanel : x) } : p) });
    return { book: nextBook, usedFallback: false };
  } catch (error) {
    const nextPanel = fallbackPanel(book, pageIndex, panel);
    const nextBook = BookSchema.parse({ ...book, pages: book.pages.map((p, i) => i === pageIndex ? { ...p, panels: p.panels.map((x, j) => j === panelIndex ? nextPanel : x) } : p) });
    return { book: nextBook, usedFallback: true, providerError: error instanceof Error ? error.message : String(error) };
  }
}
