import type { Book, StoryInput } from "./schemas.js";
import { generateStoryBook } from "./story-engine.js";
import { validateBook, repairBook, type QAResult } from "./qa.js";
import type { BookStore } from "./book-store.js";

export type JobStatus = "queued" | "running" | "completed" | "failed";
export interface GenerationJob { id: string; status: JobStatus; input: StoryInput; bookId?: string; qa?: QAResult; error?: string; }

export class BookOrchestrator {
  constructor(private readonly store: BookStore) {}

  async create(input: StoryInput): Promise<{ book: Book; job: GenerationJob }> {
    const job: GenerationJob = { id: `job-${Date.now()}`, status: "running", input };
    try {
      let book = generateStoryBook(input);
      let qa = validateBook(book);
      if (!qa.ok) { book = repairBook(book); qa = validateBook(book); }
      book = await this.store.save(book);
      job.status = qa.ok ? "completed" : "failed";
      job.bookId = book.id;
      job.qa = qa;
      return { book, job };
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }
}
