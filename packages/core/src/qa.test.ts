import { describe, expect, it } from "vitest";
import { generateStoryBook, validateBook } from "./index.js";

describe("book QA", () => {
  it("accepts a generated child-safe book", () => {
    const book = generateStoryBook({ idea: "دینو دوستش را پیدا می‌کند.", ageBand: "4-5", language: "fa", pageCount: 6 });
    const result = validateBook(book);
    expect(result.ok).toBe(true);
    expect(result.score).toBe(100);
  });
  it("rejects unsafe text", () => {
    const book = generateStoryBook({ idea: "داستان عادی", ageBand: "4-5", language: "fa", pageCount: 2 });
    book.pages[0]!.panels[0]!.narration = "مواد مخدر";
    expect(validateBook(book).ok).toBe(false);
  });
});
