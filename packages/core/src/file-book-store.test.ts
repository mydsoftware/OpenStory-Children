import { describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FileBookStore } from "./file-book-store.js";
import { createDeterministicBook } from "./pipeline.js";

describe("FileBookStore", () => {
  it("persists and reloads books", async () => {
    const dir = await mkdtemp(join(tmpdir(), "openstory-"));
    try {
      const store = new FileBookStore(dir);
      const book = createDeterministicBook({ idea: "دینو", ageBand: "4-5", language: "fa", pageCount: 2 });
      await store.save(book);
      await expect(store.get(book.id)).resolves.toMatchObject({ id: book.id, pages: book.pages });
      await expect(store.list()).resolves.toHaveLength(1);
      await store.remove(book.id);
      await expect(store.get(book.id)).resolves.toBeNull();
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
