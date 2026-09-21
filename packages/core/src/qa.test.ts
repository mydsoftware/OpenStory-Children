import { describe, expect, it } from "vitest";
import { generateStoryBook, validateBook } from "./index.js";

describe("book QA", () => {
  it("accepts a generated child-safe book", () => {
    const book = generateStoryBook({ idea: "دینو دوستش را پیدا می‌کند.", ageBand: "4-5", language: "fa", pageCount: 6 });
    const result = validateBook(book);
    expect(result.ok).toBe(true);
    expect(result.score).toBe(95);
    expect(result.warnings.some(w => w.includes("هیچ مرجع تصویری"))).toBe(true);
  });
  it("rejects unsafe text", () => {
    const book = generateStoryBook({ idea: "داستان عادی", ageBand: "4-5", language: "fa", pageCount: 2 });
    book.pages[0]!.panels[0]!.narration = "مواد مخدر";
    expect(validateBook(book).ok).toBe(false);
  });
  it("rejects a missing character reference asset", () => {
    const book = generateStoryBook({ idea: "دینو", ageBand: "4-5", language: "fa", pageCount: 2 });
    book.characters[0]!.referenceAssetIds = ["missing-reference"];
    const result = validateBook(book);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes("missing-reference"))).toBe(true);
  });
  it("rejects a reference asset attached to another character", () => {
    const book = generateStoryBook({ idea: "دینو", ageBand: "4-5", language: "fa", pageCount: 2 });
    book.characters.push({ id: "friend", name: "دوست", description: "دوست مهربان", visualTraits: ["آبی"], version: 1, referenceAssetIds: [], referenceImages: [], appearance: "small friend", personality: "kind", clothing: "simple outfit", colors: ["blue"], visualStyle: "storybook", consistencyNotes: "" });
    book.assets.push({ id: "ref-dino", type: "character-reference", url: "https://example.com/dino.png", prompt: "dino reference", characterId: "friend" });
    book.characters[0]!.referenceAssetIds = ["ref-dino"];
    const result = validateBook(book);
    expect(result.ok).toBe(false);
    expect(result.errors.some(e => e.includes("به شخصیت دیگری"))).toBe(true);
  });
});
