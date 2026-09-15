"use client";

import { useEffect, useMemo, useState } from "react";
import type { Book } from "@openstory/core";
import { renderBookHtml, validateBook } from "@openstory/core";

const samples = ["برای یک کودک ۴ ساله یک کمیک درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.", "یک خرگوش کوچولو یاد می‌گیرد با دوستش همکاری کند.", "یک ربات کوچک برای اولین بار به باغ می‌رود."];
type AgeBand = "2-3" | "4-5" | "6-8" | "9-12";

export default function StudioPage() {
  const [idea, setIdea] = useState(samples[0]!);
  const [ageBand, setAgeBand] = useState<AgeBand>("4-5");
  const [pages, setPages] = useState(8);
  const [book, setBook] = useState<Book | null>(null);
  const [library, setLibrary] = useState<Book[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const qa = useMemo(() => book ? validateBook(book) : null, [book]);

  async function refreshLibrary() {
    const response = await fetch("/api/books", { cache: "no-store" });
    if (response.ok) setLibrary((await response.json()).books ?? []);
  }

  useEffect(() => { refreshLibrary().catch(() => undefined); }, []);

  async function generate() {
    if (!idea.trim()) return setMessage("ایده داستان را وارد کن.");
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/books", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idea: idea.trim(), ageBand, language: "fa", pageCount: pages }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "ساخت کتاب ناموفق بود.");
      setBook(data.book); setMessage("کتاب با موفقیت ساخته و ذخیره شد."); await refreshLibrary();
    } catch (error) { setMessage(error instanceof Error ? error.message : "خطای ناشناخته"); }
    finally { setBusy(false); }
  }

  async function load(id: string) {
    const response = await fetch(`/api/books/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) return setMessage("کتاب پیدا نشد.");
    setBook((await response.json()).book); setMessage("کتاب بارگذاری شد.");
  }

  async function remove(id: string) {
    if (!window.confirm("این کتاب حذف شود؟")) return;
    const response = await fetch(`/api/books/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) { if (book?.id === id) setBook(null); await refreshLibrary(); setMessage("کتاب حذف شد."); }
  }

  function download() {
    if (!book) return;
    const blob = new Blob([renderBookHtml(book)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${book.id}.html`; a.click(); URL.revokeObjectURL(url);
  }

  return <main className="shell">
    <header className="hero"><div className="eyebrow">OPENSTORY STUDIO • V1 CORE</div><h1>استودیو ساخت کتاب کمیک</h1><p>ایده را وارد کن، کتاب بساز، کیفیت و ایمنی را بررسی کن و پروژه را در کتابخانه محلی نگه دار.</p></header>
    <div className="grid">
      <aside>
        <section className="card">
          <h2>ساخت کتاب</h2><label>ایده</label><textarea value={idea} onChange={e=>setIdea(e.target.value)} />
          <label>گروه سنی</label><select value={ageBand} onChange={e=>setAgeBand(e.target.value as AgeBand)}><option value="2-3">۲–۳</option><option value="4-5">۴–۵</option><option value="6-8">۶–۸</option><option value="9-12">۹–۱۲</option></select>
          <label>تعداد صفحات: {pages}</label><input type="range" min="1" max="20" value={pages} onChange={e=>setPages(+e.target.value)} />
          <div className="actions"><button onClick={generate} disabled={busy}>{busy ? "در حال ساخت…" : "تولید کتاب"}</button><button className="secondary" onClick={()=>setIdea(samples[Math.floor(Math.random()*samples.length)]!)}>ایده نمونه</button>{book && <button className="secondary" onClick={download}>خروجی HTML</button>}</div>
          {message && <div className="notice">{message}</div>}
          {qa && <div className={qa.ok ? "success" : "error"}>QA: {qa.score}/100 — {qa.ok ? "ایمن و معتبر" : qa.errors.join(" ")}</div>}
        </section>
        <section className="card library"><h2>کتابخانه پروژه‌ها</h2>{library.length === 0 ? <div className="empty">هنوز کتابی ذخیره نشده.</div> : library.map(item=><div className="library-item" key={item.id}><button className="library-open" onClick={()=>load(item.id)}>{item.title}</button><small>{item.pages.length} صفحه • {item.ageBand}</small><button className="danger" onClick={()=>remove(item.id)} aria-label={`حذف ${item.title}`}>×</button></div>)}</section>
      </aside>
      <section className="card">
        {!book ? <div className="empty"><h2>هنوز کتابی باز نشده</h2><p>یک ایده بساز یا یکی از پروژه‌های کتابخانه را باز کن.</p></div> : <><h2 className="book-title">{book.title}</h2><div className="meta">{book.ageBand} • {book.pages.length} صفحه • {book.characters.length} شخصیت • نسخه {book.schemaVersion}</div><div className="character-card"><strong>{book.characters[0]?.name}</strong><span>{book.characters[0]?.description}</span><small>{book.characters[0]?.visualTraits.join(" • ")}</small></div>{book.pages.map(page=><article className="page" key={page.id}><div className="page-head">صفحه {page.pageNumber} — {page.title}</div>{page.panels.map(panel=><div className="panel" key={panel.id}><div className="character">{book.characters[0]?.id === "character-dino" ? "🦖" : "🌈"}</div><p>{panel.narration}</p>{panel.dialogue.map((d,i)=><div className="bubble" key={i}>{d}</div>)}</div>)}</article>)}</>}
      </section>
    </div>
  </main>;
}
