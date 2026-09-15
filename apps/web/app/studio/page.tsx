"use client";

import { useMemo, useState } from "react";
import { generateStoryBook, validateBook, renderBookHtml } from "@openstory/core";

const samples = ["برای یک کودک ۴ ساله یک کمیک درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.", "یک خرگوش کوچولو یاد می‌گیرد با دوستش همکاری کند.", "یک ربات کوچک برای اولین بار به باغ می‌رود."];

export default function StudioPage() {
  const [idea, setIdea] = useState(samples[0]!);
  const [ageBand, setAgeBand] = useState<"2-3"|"4-5"|"6-8"|"9-12">("4-5");
  const [pages, setPages] = useState(8);
  const [book, setBook] = useState(() => generateStoryBook({ idea: samples[0]!, ageBand: "4-5", language: "fa", pageCount: 8 }));
  const qa = useMemo(() => validateBook(book), [book]);
  function generate() { const next = generateStoryBook({ idea: idea.trim(), ageBand, language: "fa", pageCount: pages }); setBook(next); }
  function download() { const blob = new Blob([renderBookHtml(book)], { type: "text/html;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${book.id}.html`; a.click(); URL.revokeObjectURL(url); }
  return <main className="shell"><header className="hero"><div className="eyebrow">OPENSTORY STUDIO • V1 CORE</div><h1>استودیو ساخت کتاب کمیک</h1><p>ایده را وارد کن، کتاب ساختاریافته بساز، کیفیت و ایمنی را بررسی کن و خروجی HTML قابل چاپ بگیر.</p></header><div className="grid"><section className="card"><h2>ورودی داستان</h2><label>ایده</label><textarea value={idea} onChange={e=>setIdea(e.target.value)} /><label>گروه سنی</label><select value={ageBand} onChange={e=>setAgeBand(e.target.value as typeof ageBand)}><option value="2-3">۲–۳</option><option value="4-5">۴–۵</option><option value="6-8">۶–۸</option><option value="9-12">۹–۱۲</option></select><label>تعداد صفحات: {pages}</label><input type="range" min="1" max="20" value={pages} onChange={e=>setPages(+e.target.value)} /><div className="actions"><button onClick={generate}>تولید کتاب</button><button className="secondary" onClick={()=>setIdea(samples[Math.floor(Math.random()*samples.length)]!)}>ایده نمونه</button><button className="secondary" onClick={download}>خروجی HTML</button></div><div className={qa.ok ? "success" : "error"}>QA: {qa.score}/100 — {qa.ok ? "ایمن و معتبر" : qa.errors.join(" ")}</div></section><section className="card"><h2 className="book-title">{book.title}</h2><div className="meta">{book.ageBand} • {book.pages.length} صفحه • {book.characters.length} شخصیت • نسخه {book.schemaVersion}</div><div className="character-card"><strong>{book.characters[0]?.name}</strong><span>{book.characters[0]?.description}</span><small>{book.characters[0]?.visualTraits.join(" • ")}</small></div>{book.pages.map(page=><article className="page" key={page.id}><div className="page-head">صفحه {page.pageNumber} — {page.title}</div>{page.panels.map(panel=><div className="panel" key={panel.id}><div className="character">{book.characters[0]?.id === "character-dino" ? "🦖" : "🌈"}</div><p>{panel.narration}</p>{panel.dialogue.map((d,i)=><div className="bubble" key={i}>{d}</div>)}</div>)}</article>)}</section></div></main>;
}
