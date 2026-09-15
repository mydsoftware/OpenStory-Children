import { NextResponse } from "next/server";
import { FileBookStore } from "@openstory/core";

export const runtime = "nodejs";
const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const book = await store.get(id);
  return book ? NextResponse.json({ book }) : NextResponse.json({ error: "Book not found" }, { status: 404 });
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  await store.remove(id);
  return new NextResponse(null, { status: 204 });
}
