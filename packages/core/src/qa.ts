import type { Book } from "./schemas.js";

export interface QAResult { ok: boolean; errors: string[]; warnings: string[]; score: number; }

const unsafePatterns = [/خودکشی/i, /خودکشی/i, /مواد مخدر/i, /پورنو/i, /porn/i];

export function validateBook(book: Book): QAResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!book.title.trim()) errors.push("عنوان کتاب خالی است.");
  if (!book.pages.length) errors.push("کتاب باید حداقل یک صفحه داشته باشد.");
  const characterIds = new Set(book.characters.map(c => c.id));
  for (const page of book.pages) {
    if (page.pageNumber < 1) errors.push(`شماره صفحه ${page.id} نامعتبر است.`);
    for (const panel of page.panels) for (const id of panel.characterIds) if (!characterIds.has(id)) errors.push(`شخصیت ${id} در ${panel.id} تعریف نشده است.`);
    const text = [page.title, ...page.panels.flatMap(p => [p.narration, ...p.dialogue])].join(" ");
    if (unsafePatterns.some(p => p.test(text))) errors.push(`محتوای نامناسب کودک در صفحه ${page.pageNumber} شناسایی شد.`);
    if (text.length > 1200) warnings.push(`متن صفحه ${page.pageNumber} برای کتاب کودک طولانی است.`);
  }
  const duplicatePages = new Set(book.pages.map(p => p.pageNumber)).size !== book.pages.length;
  if (duplicatePages) errors.push("شماره صفحات تکراری است.");
  const score = Math.max(0, Math.round(100 - errors.length * 20 - warnings.length * 5));
  return { ok: errors.length === 0, errors, warnings, score };
}

export function repairBook(book: Book): Book {
  const fixed = { ...book, pages: book.pages.map((page, i) => ({ ...page, pageNumber: i + 1 })) };
  return fixed;
}
