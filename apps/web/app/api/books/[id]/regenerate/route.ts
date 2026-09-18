import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createLLMProvider, createLLMProviderFromEnv, regeneratePanel, type LLMProviderSelection } from "@openstory/core";
import { FileBookStore } from "@openstory/core/server";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");
const configPath = path.join(path.dirname(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books"), "providers.json");

type Context = { params: Promise<{ id: string }> };

async function provider() {
  try {
    const config = JSON.parse(await fs.readFile(configPath, "utf8")) as LLMProviderSelection;
    if (config.provider === "ollama" || config.provider === "lmstudio") return createLLMProvider(config);
  } catch { /* use environment configuration */ }
  return createLLMProviderFromEnv();
}

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const book = await store.get(id);
    if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

    const body = await request.json() as { pageId?: string; panelId?: string };
    if (!body.pageId || !body.panelId) return NextResponse.json({ error: "pageId and panelId are required." }, { status: 400 });

    const llm = await provider();
    const result = await regeneratePanel(book, body.pageId, body.panelId, llm);
    const saved = await store.save(result.book);

    return NextResponse.json({
      job: {
        id: `regen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        status: "completed",
        stage: "generation",
        usedFallback: result.usedFallback,
        providerError: result.providerError
      },
      book: saved,
      provider: llm?.metadata ?? { id: "deterministic", name: "Deterministic fallback", local: true }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      job: { status: "failed", stage: "generation", retryable: /timeout|network|fetch|provider|connection|429|502|503/i.test(message) },
      error: message
    }, { status: 400 });
  }
}
