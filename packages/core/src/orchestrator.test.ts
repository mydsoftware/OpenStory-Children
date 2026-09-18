import { describe, expect, it } from "vitest";
import { BookOrchestrator } from "./orchestrator.js";
import { MemoryBookStore } from "./book-store.js";
import { generateStoryBook } from "./story-engine.js";
import type { ImageProvider } from "./providers.js";

const input = { idea: "دینو دوستش را پیدا می‌کند.", ageBand: "4-5" as const, language: "fa" as const, pageCount: 2 };

describe("BookOrchestrator", () => {
  it("runs generation, image, QA and persistence as one pipeline", async () => {
    const store = new MemoryBookStore();
    const image: ImageProvider = {
      metadata: { id: "test-image", name: "Test Image", local: true },
      async generate() { return { assetId: "art-1", url: "memory://art-1" }; }
    };
    const result = await new BookOrchestrator(store).create(input, { image });
    expect(result.job.status).toBe("completed");
    expect(result.job.stage).toBe("generation");
    expect(result.job.bookId).toBe(result.book.id);
    expect(result.book.assets.length).toBeGreaterThan(0);
    expect(await store.get(result.book.id)).not.toBeNull();
  });

  it("never reports completed when configured image generation fails", async () => {
    const store = new MemoryBookStore();
    const image: ImageProvider = {
      metadata: { id: "broken-image", name: "Broken Image", local: true },
      async generate() { throw new Error("ComfyUI timeout"); }
    };
    await expect(new BookOrchestrator(store).create(input, { image })).rejects.toThrow("ComfyUI timeout");
    expect(await store.list()).toHaveLength(0);
  });

  it("can complete with deterministic fallback when no LLM is configured", async () => {
    const store = new MemoryBookStore();
    const result = await new BookOrchestrator(store).create(input);
    expect(result.job.status).toBe("completed");
    expect(result.job.usedFallback).toBe(true);
  });
});
