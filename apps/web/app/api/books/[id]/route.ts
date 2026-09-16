import { NextResponse } from "next/server";
import { BookSchema } from "@openstory/core";
import { FileBookStore } from "@openstory/core/server";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const book = await store.get(id);
  return book ? NextResponse.json({ book }) : NextResponse.json({ error: "Book not found" }, { status: 404 });
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const existing = await store.get(id);
    if (!existing) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    const candidate = BookSchema.parse(await request.json());
    if (candidate.id !== id) return NextResponse.json({ error: "Book id cannot change." }, { status: 400 });
    const saved = await store.save(candidate);
    return NextResponse.json({ book: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid book" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  await store.remove(id);
  return new NextResponse(null, { status: 204 });
}
