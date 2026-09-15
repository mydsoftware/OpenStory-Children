import { NextResponse } from "next/server";
import { FileBookStore, StoryInputSchema, generateStoryBook, validateBook } from "@openstory/core";

export const runtime = "nodejs";

const store = new FileBookStore(process.env.OPENSTORY_DATA_DIR ?? ".openstory/books");

export async function GET() {
  const books = await store.list();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  try {
    const input = StoryInputSchema.parse(await request.json());
    const book = generateStoryBook(input);
    const qa = validateBook(book);
    const saved = await store.save(book);
    return NextResponse.json({ book: saved, qa }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
