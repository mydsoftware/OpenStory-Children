import { describe, expect, it } from "vitest";
import { BookSchema, StoryInputSchema, createDeterministicBook } from "./index.js";

describe("story pipeline", () => {
  it("validates story input defaults", () => {
    const input = StoryInputSchema.parse({ idea: "یک داینوسور کوچک", ageBand: "4-5" });
    expect(input.language).toBe("fa");
    expect(input.pageCount).toBe(10);
  });

  it("creates a deterministic valid book", () => {
    const input = { idea: "دینو دوستش را پیدا می‌کند.", ageBand: "4-5" as const, language: "fa" as const, pageCount: 3 };
    const first = createDeterministicBook(input);
    const second = createDeterministicBook(input);
    expect(first).toEqual(second);
    expect(BookSchema.safeParse(first).success).toBe(true);
    expect(first.pages).toHaveLength(3);
    expect(first.characters[0]?.version).toBe(1);
  });
});
