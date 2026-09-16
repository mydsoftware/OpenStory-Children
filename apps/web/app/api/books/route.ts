import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { StoryInputSchema, generateWithFallback, generateBookImages, createLLMProvider, createLLMProviderFromEnv, createImageProviderFromEnv, validateBook, type LLMProviderSelection } from "@openstory/core";
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

export async function GET() {
  const books = await store.list();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
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
    const saved = await store.save(book);
    return NextResponse.json({ book: saved, qa, provider: provider?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true }, imageProvider: imageProvider?.metadata ?? null, imageGeneration, usedFallback: result.usedFallback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
