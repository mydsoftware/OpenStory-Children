import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { BookOrchestrator, StoryInputSchema, createLLMProvider, createLLMProviderFromEnv, createImageProviderFromEnv, type LLMProviderSelection } from "@openstory/core";
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
async function configuredImageProvider() { return createImageProviderFromEnv(); }

export async function GET() {
  return NextResponse.json({ books: await store.list() });
}

export async function POST(request: Request) {
  try {
    const input = StoryInputSchema.parse(await request.json());
    const llm = await configuredProvider();
    const image = await configuredImageProvider();
    const result = await new BookOrchestrator(store).create(input, { llm, image });
    return NextResponse.json({
      book: result.book,
      qa: result.job.qa,
      job: result.job,
      provider: llm?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true },
      imageProvider: image?.metadata ?? null,
      usedFallback: result.job.usedFallback ?? false
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Book generation failed.";
    return NextResponse.json({ job: { status: "failed", error: { message } }, error: message }, { status: 400 });
  }
}
