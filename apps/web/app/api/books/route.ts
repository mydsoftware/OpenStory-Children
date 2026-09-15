import { NextResponse } from "next/server";
import { StoryInputSchema, generateWithFallback, createLLMProviderFromEnv, validateBook } from "@openstory/core";
import { FileBookStore } from "@openstory/core/server";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");

export async function GET() {
  const books = await store.list();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  try {
    const input = StoryInputSchema.parse(await request.json());
    const provider = createLLMProviderFromEnv();
    const result = await generateWithFallback(input, provider);
    const qa = validateBook(result.book);
    const saved = await store.save(result.book);
    return NextResponse.json({ book: saved, qa, provider: provider?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true }, usedFallback: result.usedFallback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
