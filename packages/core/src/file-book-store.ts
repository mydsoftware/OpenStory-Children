import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Book } from "./schemas.js";
import { BookSchema } from "./schemas.js";
import type { BookStore } from "./book-store.js";

export class FileBookStore implements BookStore {
  constructor(private readonly directory: string) {}

  private path(id: string) { return join(this.directory, `${encodeURIComponent(id)}.json`); }

  async save(book: Book): Promise<Book> {
    const value = BookSchema.parse({ ...book, createdAt: book.createdAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() });
    await mkdir(this.directory, { recursive: true });
    await writeFile(this.path(value.id), JSON.stringify(value, null, 2), "utf8");
    return value;
  }

  async get(id: string): Promise<Book | null> {
    try { return BookSchema.parse(JSON.parse(await readFile(this.path(id), "utf8"))); }
    catch (error: any) { if (error?.code === "ENOENT") return null; throw error; }
  }

  async list(): Promise<Book[]> {
    await mkdir(this.directory, { recursive: true });
    const files = (await readdir(this.directory)).filter(file => file.endsWith(".json"));
    const books: Book[] = [];
    for (const file of files) { try { books.push(BookSchema.parse(JSON.parse(await readFile(join(this.directory, file), "utf8")))); } catch { /* ignore invalid project files */ } }
    return books;
  }

  async remove(id: string): Promise<void> {
    try { await unlink(this.path(id)); } catch (error: any) { if (error?.code !== "ENOENT") throw error; }
  }
}
