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
  { value: "2-3", label: "۲ تا ۳ سال", icon: "🧸" },
  { value: "4-5", label: "۴ تا ۵ سال", icon: "🌈" },
  { value: "6-8", label: "۶ تا ۸ سال", icon: "🚀" },
  { value: "9-12", label: "۹ تا ۱۲ سال", icon: "🗺️" }
] as const;

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
        <div className="brand"><span className="brand-mark">✦</span><span>OpenStory</span><b>Kids</b></div>
        <div className="topbar-badge">داستان‌ساز هوش مصنوعی</div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span>✨</span> قصه‌ای که از یک ایده شروع می‌شود</div>
          <h1>داستان خودت را<br /><em>بساز و ببین!</em></h1>
          <p>ایده‌ی کودک را به یک کتاب تصویری دوست‌داشتنی تبدیل کن؛ با داستان، شخصیت‌های ثابت و تصویرسازی هوش مصنوعی.</p>
          <div className="hero-pills"><span>🎨 تصویرسازی با AI</span><span>📖 کتاب چندصفحه‌ای</span><span>🧒 مناسب کودک</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun">☀️</div><div className="cloud cloud-a">☁️</div><div className="cloud cloud-b">☁️</div>
          <div className="rainbow">🌈</div><div className="hero-dino">🦖</div><div className="hero-star star-a">✦</div><div className="hero-star star-b">✦</div>
        </div>
      </section>

      <div className="workspace">
        <aside className="creator-card">
          <div className="section-title"><span className="step">۱</span><div><strong>قصه‌ات را تعریف کن</strong><small>هر چیزی که دوست داری بنویس</small></div></div>
          <textarea className="idea-box" aria-label="ایده داستان" value={idea} onChange={e => setIdea(e.target.value)} />
          <button className="sample-link" disabled={loading} onClick={() => setIdea(examples[Math.floor(Math.random() * examples.length)])}>🎲 یک ایده تصادفی</button>

          <div className="section-title compact"><span className="step">۲</span><div><strong>سن کودک</strong><small>داستان متناسب با سن ساخته می‌شود</small></div></div>
          <div className="age-grid">
            {ages.map(age => <button key={age.value} className={ageBand === age.value ? "age-card active" : "age-card"} onClick={() => setAgeBand(age.value)} disabled={loading}><span>{age.icon}</span><b>{age.label}</b></button>)}
          </div>

          <div className="section-title compact"><span className="step">۳</span><div><strong>تعداد صفحات</strong><small>{pageCount} صفحه کتاب تصویری</small></div></div>
          <div className="range-row"><span>۱</span><input type="range" min="1" max="12" value={pageCount} onChange={e => setPageCount(Number(e.target.value))} /><span>۱۲</span></div>

          <button className="create-button" onClick={generate} disabled={loading}><span>{loading ? "⏳" : "✨"}</span>{loading ? "در حال ساخت کتاب..." : "ساخت کتاب من"}</button>
          {status && <div className="status success">✓ {status}</div>}
          {error && <div className="status error">⚠ {error}</div>}
        </aside>

        <section className="book-stage">
          {!book ? (
            <div className="empty-stage">
              <div className="empty-illustration"><div className="empty-book">📖</div><span>✦</span><span>✧</span></div>
              <h2>{loading ? "جادو در حال اتفاق افتادن است..." : "اینجا کتابت ساخته می‌شود"}</h2>
              <p>{loading ? "داستان و تصویرها در حال تولید هستند؛ کمی صبر کن." : "ایده‌ات را بنویس و دکمه «ساخت کتاب من» را بزن."}</p>
              {!loading && <div className="hint-row"><span>📝 ایده</span><b>→</b><span>🤖 داستان</span><b>→</b><span>🎨 تصویر</span><b>→</b><span>📖 کتاب</span></div>}
            </div>
          ) : (
            <div className="book-result">
              <div className="result-head"><div><span className="result-label">کتاب جدید شما</span><h2>{book.title}</h2><p>{book.ageBand} سال • {book.pages.length} صفحه • فارسی</p></div><div className="result-badge">✓ آماده است</div></div>
              <div className="book-cover"><div className="cover-art">🌈<span>🦖</span><i>✦</i></div><div><small>کتاب تصویری کودک</small><h3>{book.title}</h3><p>ساخته‌شده با OpenStory AI</p></div></div>
              <div className="pages-grid">
                {book.pages.map(page => (
                  <article className="story-page" key={page.id}>
                    <div className="page-number">صفحه {page.pageNumber}</div>
                    <div className="image-frame">{page.generatedImage ? <img src={page.generatedImage} alt={page.title} /> : <div className="image-placeholder">🎨<span>تصویر این صفحه هنوز تولید نشده</span></div>}</div>
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
