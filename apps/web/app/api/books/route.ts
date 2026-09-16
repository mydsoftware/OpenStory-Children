import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { StoryInputSchema, generateWithFallback, generateBookImages, createLLMProvider, createLLMProviderFromEnv, createImageProviderFromEnv, validateBook, type LLMProviderSelection, type JobError } from "@openstory/core";
import { FileBookStore } from "@openstory/core/server";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");
const configPath = path.join(path.dirname(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books"), "providers.json");

async function configuredProvider() {
  try {
    const config = JSON.parse(await fs.readFile(configPath, "utf8")) as LLMProviderSelection;
    if (config.provider === "ollama" || config.provider === "lmstudio") return createLLMProvider(config);
  } catch { /* fall back to environment configuration */ }
  return createLLMProviderFromEnv();
}

function configuredImageProvider() { return createImageProviderFromEnv(); }
function errorState(error: unknown, stage: JobError["stage"]): JobError {
  const message = error instanceof Error ? error.message : String(error);
  const retryable = /timeout|abort|network|fetch|HTTP (429|502|503)|provider|connection/i.test(message) || stage === "persistence";
  const code: JobError["code"] = stage === "persistence" ? "PERSISTENCE_FAILED" : stage === "provider" ? "PROVIDER_FAILED" : stage === "qa" ? "QA_FAILED" : stage === "generation" ? "GENERATION_FAILED" : "UNKNOWN";
  return { code, message, stage, retryable, cause: error instanceof Error ? error.name : undefined };
}

export async function GET() {
  const books = await store.list();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const input = StoryInputSchema.parse(await request.json());
    const provider = await configuredProvider();
    const result = await generateWithFallback(input, provider);
    const imageProvider = configuredImageProvider();
    let book = result.book;
    let imageGeneration: { generatedAssetIds: string[]; failures: string[] } = { generatedAssetIds: [], failures: [] };
    if (imageProvider) {
      const generated = await generateBookImages(book, imageProvider);
      book = generated.book;
      imageGeneration = { generatedAssetIds: generated.generatedAssetIds, failures: generated.failures };
    }
    const qa = validateBook(book);
    if (!qa.ok) return NextResponse.json({ job: { id: jobId, status: "failed", error: errorState(new Error("Book failed quality validation."), "qa"), qa }, book, provider: provider?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true }, imageProvider: imageProvider?.metadata ?? null, imageGeneration, usedFallback: result.usedFallback }, { status: 422 });
    let saved;
    try { saved = await store.save(book); } catch (error) { return NextResponse.json({ job: { id: jobId, status: "failed", error: errorState(error, "persistence") } }, { status: 500 }); }
    const jobError = result.providerError ? errorState(new Error(result.providerError), "provider") : undefined;
    return NextResponse.json({ job: { id: jobId, status: "completed", error: jobError }, book: saved, qa, provider: provider?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true }, imageProvider: imageProvider?.metadata ?? null, imageGeneration, usedFallback: result.usedFallback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ job: { id: jobId, status: "failed", error: errorState(error, "generation") }, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
