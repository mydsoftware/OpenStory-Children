import { describe, expect, it } from "vitest";
import { createDeterministicBook } from "../src/pipeline.js";

 describe("story to book vertical slice", () => {
  it("creates a validated deterministic book", () => {
    const book = createDeterministicBook({
      idea: "دینو دوستش را گم کرده است.",
      ageBand: "4-5",
      language: "fa",
      pageCount: 3
    });

    expect(book.pages).toHaveLength(3);
    expect(book.characters[0]?.name).toBe("دینو");
    expect(book.pages[0]?.panels[0]?.characterIds).toContain("character-dino");
  });
});
