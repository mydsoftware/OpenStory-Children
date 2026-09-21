import { describe, expect, it } from "vitest";
import { generateStoryBook, generateBookImages, validateBook, type ImageProvider } from "./index.js";

describe("production image generation", () => {
  it("attaches one generated page-art asset to each panel", async () => {
    const book = generateStoryBook({ idea: "دینو در باغ", ageBand: "4-5", language: "fa", pageCount: 2 });
    const calls: { prompt: string; references?: string[] }[] = [];
    const provider: ImageProvider = {
      metadata: { id: "test-image", name: "Test Image", local: true },
      async generate(input) {
        calls.push(input);
        return { assetId: `asset-${calls.length}`, url: `https://example.com/${calls.length}.png` };
      }
    };
    const result = await generateBookImages(book, provider);
    expect(result.failures).toEqual([]);
    expect(result.generatedAssetIds).toHaveLength(2);
    expect(result.book.assets).toHaveLength(2);
    expect(result.book.pages.every(page => page.panels.every(panel => panel.assetIds.length === 1))).toBe(true);
    expect(calls[0]?.prompt).toContain("دینو");
    expect(calls[0]?.references).toBeUndefined();
    expect(calls[1]?.references?.length).toBeGreaterThan(0);
    expect(validateBook(result.book).ok).toBe(true);
  });

  it("continues other panels when an image provider fails", async () => {
    const book = generateStoryBook({ idea: "دینو", ageBand: "4-5", language: "fa", pageCount: 2 });
    const provider: ImageProvider = {
      metadata: { id: "test-image", name: "Test Image", local: true },
      async generate() { throw new Error("provider unavailable"); }
    };
    const result = await generateBookImages(book, provider);
    expect(result.generatedAssetIds).toEqual([]);
    expect(result.failures).toHaveLength(1);
    expect(result.book.assets).toEqual([]);
  });
});
