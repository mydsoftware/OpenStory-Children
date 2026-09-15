"use client";

import { useMemo, useState } from "react";
import { createDeterministicBook } from "@openstory/core";

const examples = [
  "برای یک کودک ۴ ساله یک کمیک درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.",
  "یک داستان شاد درباره یک خرگوش کوچولو که یاد می‌گیرد با دوستش همکاری کند بساز.",
  "یک ماجراجویی کوتاه درباره یک ربات کوچک و اولین سفرش به باغ بساز."
];

export default function Home() {
  const [idea, setIdea] = useState(examples[0]);
  const [ageBand, setAgeBand] = useState<"2-3"|"4-5"|"6-8"|"9-12">("4-5");
  const [pageCount, setPageCount] = useState(6);
  const [submitted, setSubmitted] = useState(idea);
  const [error, setError] = useState("");

  const book = useMemo(() => {
    try { return createDeterministicBook({ idea: submitted, ageBand, language: "fa", pageCount }); }
    catch { return null; }
  }, [submitted, ageBand, pageCount]);

  function generate() {
    if (!idea.trim()) { setError("ایده داستان را وارد کنید."); return; }
    setError(""); setSubmitted(idea.trim());
  }

  return (
    <main className="shell">
      <header className="hero"><div className="eyebrow">OPEN SOURCE • AI STORY ENGINE</div><h1>OpenStory Children</h1><p>ایده‌ی کودک را به یک کتاب کمیک ساختاریافته تبدیل کن؛ با پشتیبانی از فارسی و معماری آماده برای مدل‌های هوش مصنوعی محلی و ابری.</p></header>
      <div className="grid">
        <section className="card"><h2>ساخت کتاب</h2>
          <label htmlFor="idea">ایده داستان</label><textarea id="idea" value={idea} onChange={e=>setIdea(e.target.value)} />
          <label htmlFor="age">گروه سنی</label><select id="age" value={ageBand} onChange={e=>setAgeBand(e.target.value as typeof ageBand)}><option value="2-3">۲ تا ۳ سال</option><option value="4-5">۴ تا ۵ سال</option><option value="6-8">۶ تا ۸ سال</option><option value="9-12">۹ تا ۱۲ سال</option></select>
          <label htmlFor="pages">تعداد صفحات: {pageCount}</label><input id="pages" type="range" min="1" max="12" value={pageCount} onChange={e=>setPageCount(Number(e.target.value))}/>
          <div className="actions"><button onClick={generate}>ساخت کتاب</button><button className="secondary" onClick={()=>setIdea(examples[Math.floor(Math.random()*examples.length)])}>ایده نمونه</button></div>
          {error && <div className="error">{error}</div>}
        </section>
        <section className="card">{!book ? <div className="empty">برای شروع، یک ایده وارد کنید.</div> : <><h2 className="book-title">{book.title}</h2><div className="meta">{book.ageBand} • {book.pages.length} صفحه • فارسی</div>{book.pages.map(page=><article className="page" key={page.id}><div className="page-head">صفحه {page.pageNumber} — {page.title}</div><div className="comic"><div className="panel"><div className="character">🦖</div><div>{page.panels[0]?.narration}</div>{page.panels[0]?.dialogue.map((d,i)=><div className="bubble" key={i}>{d}</div>)}</div></div></article>)}</>}</section>
      </div>
    </main>
  );
}
