import { NextResponse } from "next/server";
import { BookSchema, createLLMProvider, createLLMProviderFromEnv, type LLMProvider } from "@openstory/core";
import { FileBookStore } from "@openstory/core/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");
const configPath = path.join(path.dirname(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books"), "providers.json");

type Context = { params: Promise<{ id: string }> };
async function provider(): Promise<LLMProvider | undefined> { try { const c = JSON.parse(await fs.readFile(configPath, "utf8")); if (c.provider === "ollama" || c.provider === "lmstudio") return createLLMProvider(c); } catch {} return createLLMProviderFromEnv(); }

export async function POST(request: Request, context: Context) {
  try {
    const { id } = await context.params; const book = await store.get(id); if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    const body = await request.json() as { pageId?: string; panelId?: string; instruction?: string };
    const page = book.pages.find(p => p.id === body.pageId); const panel = page?.panels.find(p => p.id === body.panelId);
    if (!page || !panel) return NextResponse.json({ error: "Page or panel not found" }, { status: 404 });
    const llm = await provider(); if (!llm) return NextResponse.json({ error: "No local LLM configured. Configure Ollama or LM Studio first." }, { status: 409 });
    const result = await llm.generateStructured<{ narration: string; dialogue: string[] }>({
      prompt: ["Rewrite only this comic panel for OpenStory Children.", `Age: ${book.ageBand}; language: ${book.language}.`, `Character context: ${book.characters.map(c => `${c.name}: ${c.description}; ${c.visualTraits.join(", ")}`).join(" | ")}`, `Current narration: ${panel.narration}`, `Current dialogue: ${panel.dialogue.join(" | ")}`, `User instruction: ${String(body.instruction ?? "Make it clearer, warm and engaging for the target age.")}`, "Keep it child-safe and preserve character identity. Return JSON only."].join("\n"),
      schema: { type: "object", required: ["narration", "dialogue"], properties: { narration: { type: "string" }, dialogue: { type: "array", items: { type: "string" } } } }
    });
    const updated = BookSchema.parse({ ...book, pages: book.pages.map(p => p.id === page.id ? { ...p, panels: p.panels.map(x => x.id === panel.id ? { ...x, narration: result.narration, dialogue: result.dialogue } : x) } : p) });
    return NextResponse.json({ book: await store.save(updated), provider: llm.metadata });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Regeneration failed" }, { status: 400 }); }
}
