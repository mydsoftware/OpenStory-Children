import { describe, expect, it } from "vitest";
import { generateStoryBook } from "./story-engine.js";
import { validateBook } from "./qa.js";
import { regeneratePanel } from "./panel-regeneration.js";
import type { LLMProvider } from "./providers.js";

const input = { idea: "یک داینوسور کوچولو دوستش را گم کرده.", ageBand: "4-5" as const, language: "fa" as const, pageCount: 4 };

describe("scoped panel regeneration", () => {
  it("regenerates only the requested panel and invalidates stale art", async () => {
    const book = generateStoryBook(input);
    const first = book.pages[0]!;
    first.panels[0]!.assetIds = ["old-art"];
    const secondBefore = JSON.stringify(book.pages[1]);
    const provider: LLMProvider = {
      metadata: { id: "test-llm", name: "Test LLM", local: true },
      async generateStructured() {
        return { narration: "دینو آرام جلو می‌رود.", dialogue: ["بیا با هم پیدایش کنیم!"] };
      }
    };
    const result = await regeneratePanel(book, first.id, first.panels[0]!.id, provider);
    expect(result.usedFallback).toBe(false);
    expect(result.book.pages[0]!.panels[0]!.narration).toBe("دینو آرام جلو می‌رود.");
    expect(result.book.pages[0]!.panels[0]!.assetIds).toEqual([]);
    expect(JSON.stringify(result.book.pages[1])).toBe(secondBefore);
    expect(validateBook(result.book).ok).toBe(true);
  });

  it("falls back deterministically when the provider fails", async () => {
    const book = generateStoryBook(input);
    const provider: LLMProvider = {
      metadata: { id: "test-llm", name: "Test LLM", local: true },
      async generateStructured() { throw new Error("provider timeout"); }
    };
    const result = await regeneratePanel(book, book.pages[0]!.id, book.pages[0]!.panels[0]!.id, provider);
    expect(result.usedFallback).toBe(true);
    expect(result.providerError).toContain("provider timeout");
    expect(result.book.pages[0]!.panels[0]!.dialogue.length).toBeGreaterThan(0);
  });
});
