import type { Book } from "./schemas.js";

function esc(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

export function renderBookHtml(book: Book): string {
  const pages = book.pages.map(page => `<article class="page"><header><strong>صفحه ${page.pageNumber}</strong><span>${esc(page.title)}</span></header>${page.panels.map(panel => `<section class="panel"><div class="art">${panel.characterIds.length ? "🦖" : "📖"}</div><p>${esc(panel.narration)}</p>${panel.dialogue.map(d => `<div class="bubble">${esc(d)}</div>`).join("")}</section>`).join("")}</article>`).join("");
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(book.title)}</title><style>body{font-family:system-ui,sans-serif;background:#f4f5f7;margin:0;padding:24px;color:#222}.book{max-width:900px;margin:auto}.page{background:white;margin:0 auto 24px;padding:28px;min-height:500px;box-shadow:0 8px 30px #0001;break-after:page}.page header{display:flex;justify-content:space-between;margin-bottom:18px}.panel{border:3px solid #222;border-radius:20px;padding:24px;min-height:300px}.art{font-size:100px;text-align:center}.bubble{background:#fff;border:2px solid #222;border-radius:18px;padding:12px;margin:10px 0;display:inline-block}@media print{body{background:white;padding:0}.page{box-shadow:none;margin:0;min-height:100vh}}</style></head><body><main class="book"><h1>${esc(book.title)}</h1>${pages}</main></body></html>`;
}
