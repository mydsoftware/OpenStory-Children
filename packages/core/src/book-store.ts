import type { Book } from "./schemas.js";
import { BookSchema } from "./schemas.js";

export interface BookStore {
  save(book: Book): Promise<Book>;
  get(id: string): Promise<Book | null>;
  list(): Promise<Book[]>;
  remove(id: string): Promise<void>;
}

export class MemoryBookStore implements BookStore {
  private readonly books = new Map<string, Book>();
  async save(book: Book) { const value = BookSchema.parse({ ...book, updatedAt: new Date().toISOString(), createdAt: book.createdAt ?? new Date().toISOString() }); this.books.set(value.id, value); return value; }
  async get(id: string) { return this.books.get(id) ?? null; }
  async list() { return [...this.books.values()]; }
  async remove(id: string) { this.books.delete(id); }
}
