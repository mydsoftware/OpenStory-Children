import type { Book, StoryInput } from "./schemas.js";
import { generateStoryBook } from "./story-engine.js";
import { validateBook, repairBook, type QAResult } from "./qa.js";
import type { BookStore } from "./book-store.js";

export type JobStatus = "queued" | "running" | "completed" | "failed";
export type JobErrorCode = "GENERATION_FAILED" | "QA_FAILED" | "PERSISTENCE_FAILED" | "PROVIDER_FAILED" | "UNKNOWN";
export interface JobError { code: JobErrorCode; message: string; stage: "generation" | "qa" | "persistence" | "provider" | "unknown"; retryable: boolean; providerId?: string; cause?: string; }
export interface GenerationJob { id: string; status: JobStatus; input: StoryInput; bookId?: string; qa?: QAResult; error?: JobError; }

function toJobError(error: unknown, stage: JobError["stage"]): JobError {
  const message = error instanceof Error ? error.message : String(error);
  const providerFailure = /provider|ollama|comfyui|lmstudio|openai-compatible|HTTP \d|fetch|timeout/i.test(message);
  const persistenceFailure = stage === "persistence";
  const retryable = providerFailure || persistenceFailure || /temporar|timeout|abort|network|503|502|429/i.test(message);
  return { code: providerFailure ? "PROVIDER_FAILED" : persistenceFailure ? "PERSISTENCE_FAILED" : stage === "qa" ? "QA_FAILED" : stage === "generation" ? "GENERATION_FAILED" : "UNKNOWN", message, stage, retryable, cause: error instanceof Error ? error.name : undefined };
}

export class BookOrchestrator {
  constructor(private readonly store: BookStore) {}

  async create(input: StoryInput): Promise<{ book: Book; job: GenerationJob }> {
    const job: GenerationJob = { id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, status: "running", input };
    try {
      let book: Book;
      try { book = generateStoryBook(input); } catch (error) { job.status = "failed"; job.error = toJobError(error, "generation"); throw error; }
      let qa: QAResult;
      try { qa = validateBook(book); if (!qa.ok) { book = repairBook(book); qa = validateBook(book); } } catch (error) { job.status = "failed"; job.error = toJobError(error, "qa"); throw error; }
      if (!qa.ok) { job.status = "failed"; job.error = { code: "QA_FAILED", message: "Book failed quality validation after repair.", stage: "qa", retryable: false }; job.qa = qa; throw new Error("Book failed quality validation after repair."); }
      try { book = await this.store.save(book); } catch (error) { job.status = "failed"; job.error = toJobError(error, "persistence"); throw error; }
      job.status = "completed"; job.bookId = book.id; job.qa = qa;
      return { book, job };
    } catch (error) {
      if (!job.error) job.error = toJobError(error, "unknown");
      throw error;
    }
  }
}
