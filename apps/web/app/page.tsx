"use client";

import { useState } from "react";
import type { Book } from "@openstory/core";

const examples = [
  "برای یک کودک ۴ ساله یک کمیک درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.",
  "یک داستان شاد درباره یک خرگوش کوچولو که یاد می‌گیرد با دوستش همکاری کند بساز.",
  "یک ماجراجویی کوتاه درباره یک ربات کوچک و اولین سفرش به باغ بساز."
];

type ApiResult = {
  book?: Book;
  job?: { status?: string; stage?: string; error?: { message?: string } };
  provider?: { name?: string; model?: string };
  imageProvider?: { name?: string };
  error?: string;
};

const ages = [
  { value: "2-3", label: "۲ تا ۳ سال", icon: "toy" },
  { value: "4-5", label: "۴ تا ۵ سال", icon: "rainbow" },
  { value: "6-8", label: "۶ تا ۸ سال", icon: "rocket" },
  { value: "9-12", label: "۹ تا ۱۲ سال", icon: "map" }
] as const;

function Illustration({type}:{type:string}) {
  if (type === "rainbow") return <svg viewBox="0 0 64 48" className="age-svg"><path d="M8 42a24 24 0 0 1 48 0" fill="none" stroke="#e98978" strokeWidth="6"/><path d="M14 42a18 18 0 0 1 36 0" fill="none" stroke="#f3c65c" strokeWidth="6"/><path d="M20 42a12 12 0 0 1 24 0" fill="none" stroke="#72b9a3" strokeWidth="6"/></svg>;
  if (type === "rocket") return <svg viewBox="0 0 64 64" className="age-svg"><path d="M32 8c13 8 18 20 13 34L32 54 19 42C14 28 19 16 32 8Z" fill="#7887dc"/><circle cx="32" cy="27" r="6" fill="#fff"/><path d="M20 42l-9 4 5-10M44 42l9 4-5-10M25 52l-3 9 10-7 10 7-3-9" fill="#f0a15d"/></svg>;
  if (type === "map") return <svg viewBox="0 0 64 64" className="age-svg"><path d="M10 13l15-6 14 6 15-6v44l-15 6-14-6-15 6Z" fill="#f8d98c"/><path d="M25 7v44M39 13v44" stroke="#d59d58" strokeWidth="2"/><path d="M18 39c9-15 17 5 28-12" fill="none" stroke="#5e78b9" strokeWidth="3"/></svg>;
  return <svg viewBox="0 0 64 64" className="age-svg"><circle cx="32" cy="28" r="20" fill="#e9a66e"/><circle cx="24" cy="27" r="3" fill="#303852"/><circle cx="40" cy="27" r="3" fill="#303852"/><path d="M25 37c5 5 9 5 14 0" fill="none" stroke="#303852" strokeWidth="2.5" strokeLinecap="round"/><path d="M17 12l-8-6M47 12l8-6" stroke="#e9a66e" strokeWidth="7" strokeLinecap="round"/></svg>;
}

function HeroIllustration() {
  return <svg viewBox="0 0 560 330" className="hero-svg" aria-hidden="true">
    <circle cx="455" cy="62" r="40" fill="#ffd86a"/><circle cx="455" cy="62" r="25" fill="#ffe89a"/>
    <path d="M65 258C145 180 220 180 305 258S470 335 540 220" fill="none" stroke="#e78b79" strokeWidth="18" strokeLinecap="round" opacity=".55"/>
    <path d="M78 258C150 195 220 195 300 258S460 320 525 228" fill="none" stroke="#f1c85f" strokeWidth="16" strokeLinecap="round" opacity=".75"/>
    <path d="M92 258C160 210 220 210 295 258S450 305 510 238" fill="none" stroke="#72b9a3" strokeWidth="14" strokeLinecap="round"/>
    <g transform="translate(235 95)">
      <path d="M0 78c8-49 42-77 91-78 36 18 49 51 42 90l-36 42H37Z" fill="#79bd91"/>
      <path d="M128 75l47 22-50 14M27 111l-32 31 44-8" fill="#68aa82"/>
      <circle cx="66" cy="55" r="9" fill="#fff"/><circle cx="69" cy="55" r="4" fill="#303852"/>
      <path d="M78 77c12 8 22 7 31-1" fill="none" stroke="#303852" strokeWidth="5" strokeLinecap="round"/>
      <circle cx="105" cy="93" r="8" fill="#e88c7a"/><circle cx="24" cy="96" r="7" fill="#e88c7a"/>
    </g>
    <path d="M85 80c25-18 48-18 73 0" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" opacity=".9"/>
    <path d="M415 155c20-14 39-14 59 0" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" opacity=".9"/>
    <g fill="#e9a343"><circle cx="105" cy="145" r="5"/><circle cx="500" cy="120" r="5"/><path d="M155 105l5 12 12 5-12 5-5 12-5-12-12-5 12-5Z"/></g>
  </svg>;
}

export default function Home() {
  const [idea, setIdea] = useState(examples[0]);
  const [ageBand, setAgeBand] = useState<"2-3"|"4-5"|"6-8"|"9-12">("4-5");
  const [pageCount, setPageCount] = useState(2);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function generate() {
    if (!idea.trim()) { setError("ایده داستان را وارد کنید."); return; }
    setLoading(true); setError(""); setBook(null);
    setStatus("در حال ساخت داستان و تصویرهای کتاب...");
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), ageBand, language: "fa", pageCount })
      });
      const data = (await response.json()) as ApiResult;
      if (!response.ok || !data.book) throw new Error(data.error ?? data.job?.error?.message ?? "ساخت کتاب ناموفق بود.");
      setBook(data.book);
      setStatus("کتاب با موفقیت ساخته شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته در ساخت کتاب.");
      setStatus("");
    } finally { setLoading(false); }
  }

  return (
    <main className="app-shell">
      <div className="sky-glow glow-one" />
      <div className="sky-glow glow-two" />

      <nav className="topbar">
        <div className="brand"><span className="brand-mark"><svg viewBox="0 0 32 32"><path d="M16 3l3.8 8.1L28 15l-8.2 3.8L16 27l-3.8-8.2L4 15l8.2-3.9Z" fill="currentColor"/></svg></span><span>OpenStory</span><b>Kids</b></div>
        <div className="topbar-badge">داستان‌ساز هوش مصنوعی</div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>✨</span> قصه‌ای که از یک ایده شروع می‌شود</div>
          <h1>داستان خودت را<br /><em>بساز و ببین!</em></h1>
          <p>ایده‌ی کودک را به یک کتاب تصویری دوست‌داشتنی تبدیل کن؛ با داستان، شخصیت‌های ثابت و تصویرسازی هوش مصنوعی.</p>
          <div className="hero-pills"><span><i className="pill-dot purple" /> تصویرسازی با AI</span><span><i className="pill-dot gold" /> کتاب چندصفحه‌ای</span><span><i className="pill-dot green" /> مناسب کودک</span></div>
        </div>
        <div className="hero-art"><HeroIllustration /></div>
      </section>

      <div className="workspace">
        <aside className="creator-card">
          <div className="section-title"><span className="step">۱</span><div><strong>قصه‌ات را تعریف کن</strong><small>هر چیزی که دوست داری بنویس</small></div></div>
          <textarea className="idea-box" aria-label="ایده داستان" value={idea} onChange={e => setIdea(e.target.value)} />
          <button className="sample-link" disabled={loading} onClick={() => setIdea(examples[Math.floor(Math.random() * examples.length)])}>↻ یک ایده تصادفی</button>

          <div className="section-title compact"><span className="step">۲</span><div><strong>سن کودک</strong><small>داستان متناسب با سن ساخته می‌شود</small></div></div>
          <div className="age-grid">
            {ages.map(age => <button key={age.value} className={ageBand === age.value ? "age-card active" : "age-card"} onClick={() => setAgeBand(age.value)} disabled={loading}><Illustration type={age.icon} /><b>{age.label}</b></button>)}
          </div>

          <div className="section-title compact"><span className="step">۳</span><div><strong>تعداد صفحات</strong><small>{pageCount} صفحه کتاب تصویری</small></div></div>
          <div className="range-row"><span>۱</span><input type="range" min="1" max="12" value={pageCount} onChange={e => setPageCount(Number(e.target.value))} /><span>۱۲</span></div>

          <button className="create-button" onClick={generate} disabled={loading}><span className="button-spark">{loading ? "…" : "✦"}</span>{loading ? "در حال ساخت کتاب..." : "ساخت کتاب من"}</button>
          {status && <div className="status success">✓ {status}</div>}
          {error && <div className="status error">⚠ {error}</div>}
        </aside>

        <section className="book-stage">
          {!book ? (
            <div className="empty-stage">
              <div className="empty-illustration"><svg viewBox="0 0 180 150"><path d="M20 35c38-17 67-15 70 2v87c-8-18-42-22-70-8Z" fill="#fff7dc" stroke="#6b75c9" strokeWidth="4"/><path d="M160 35c-38-17-67-15-70 2v87c8-18 42-22 70-8Z" fill="#eef1ff" stroke="#6b75c9" strokeWidth="4"/><path d="M90 38v86" stroke="#6b75c9" strokeWidth="4"/><path d="M42 55h27M42 69h35M112 55h27M112 69h35" stroke="#d5d9e8" strokeWidth="4" strokeLinecap="round"/></svg><span>✦</span><span>✧</span></div>
              <h2>{loading ? "جادو در حال اتفاق افتادن است..." : "اینجا کتابت ساخته می‌شود"}</h2>
              <p>{loading ? "داستان و تصویرها در حال تولید هستند؛ کمی صبر کن." : "ایده‌ات را بنویس و دکمه «ساخت کتاب من» را بزن."}</p>
              {!loading && <div className="hint-row"><span>ایده</span><b>→</b><span>داستان</span><b>→</b><span>تصویر</span><b>→</b><span>کتاب</span></div>}
            </div>
          ) : (
            <div className="book-result">
              <div className="result-head"><div><span className="result-label">کتاب جدید شما</span><h2>{book.title}</h2><p>{book.ageBand} سال • {book.pages.length} صفحه • فارسی</p></div><div className="result-badge">✓ آماده است</div></div>
              <div className="book-cover"><div className="cover-art"><svg viewBox="0 0 150 100"><path d="M10 76c28-36 48-36 72 0s42 31 58-5" fill="none" stroke="#e78b79" strokeWidth="9"/><path d="M15 78c28-28 48-28 69 0s43 25 56-7" fill="none" stroke="#f2c75c" strokeWidth="8"/><circle cx="78" cy="38" r="25" fill="#79bd91"/><circle cx="71" cy="35" r="4" fill="#303852"/><circle cx="87" cy="35" r="4" fill="#303852"/><path d="M73 48c7 5 13 5 19 0" fill="none" stroke="#303852" strokeWidth="3"/></svg></div><div><small>کتاب تصویری کودک</small><h3>{book.title}</h3><p>ساخته‌شده با OpenStory AI</p></div></div>
              <div className="pages-grid">
                {book.pages.map(page => (
                  <article className="story-page" key={page.id}>
                    <div className="page-number">صفحه {page.pageNumber}</div>
                    <div className="image-frame">{page.generatedImage ? <img src={page.generatedImage} alt={page.title} /> : <div className="image-placeholder"><svg viewBox="0 0 100 80"><rect x="8" y="12" width="84" height="58" rx="9" fill="#eef0fa" stroke="#8791d7" strokeWidth="3"/><circle cx="31" cy="32" r="7" fill="#f0bb5a"/><path d="M16 60l22-20 14 13 10-10 22 17" fill="none" stroke="#7481cf" strokeWidth="4" strokeLinecap="round"/></svg><span>تصویر این صفحه هنوز تولید نشده</span></div>}</div>
                    <div className="page-copy"><h3>{page.title}</h3>{page.panels.map(panel => <div key={panel.id} className="panel-copy"><p>{panel.narration}</p>{panel.dialogue.map((dialogue, index) => <div className="speech" key={index}>“{dialogue}”</div>)}</div>)}</div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <footer><span>OpenStory Children</span><span>ساخت کتاب داستان با هوش مصنوعی و مدل‌های محلی</span></footer>
    </main>
  );
}
