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

    setLoading(true);
    setError("");
    setBook(null);
    setStatus("در حال ساخت داستان و تصویرهای کتاب...");

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), ageBand, language: "fa", pageCount })
      });

      const data = (await response.json()) as ApiResult;
      if (!response.ok || !data.book) {
        throw new Error(data.error ?? data.job?.error?.message ?? "ساخت کتاب ناموفق بود.");
      }

      setBook(data.book);
      setStatus("کتاب با موفقیت ساخته شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته در ساخت کتاب.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <div className="eyebrow">OPEN SOURCE • AI STORY ENGINE</div>
        <h1>OpenStory Children</h1>
        <p>ایده‌ی کودک را به یک کتاب کمیک واقعی تبدیل کن؛ داستان با مدل محلی و تصویرها با ComfyUI تولید می‌شوند.</p>
      </header>

      <div className="grid">
        <section className="card">
          <h2>ساخت کتاب</h2>

          <label htmlFor="idea">ایده داستان</label>
          <textarea id="idea" value={idea} onChange={e => setIdea(e.target.value)} />

          <label htmlFor="age">گروه سنی</label>
          <select id="age" value={ageBand} onChange={e => setAgeBand(e.target.value as typeof ageBand)}>
            <option value="2-3">۲ تا ۳ سال</option>
            <option value="4-5">۴ تا ۵ سال</option>
            <option value="6-8">۶ تا ۸ سال</option>
            <option value="9-12">۹ تا ۱۲ سال</option>
          </select>

          <label htmlFor="pages">تعداد صفحات: {pageCount}</label>
          <input id="pages" type="range" min="1" max="12" value={pageCount} onChange={e => setPageCount(Number(e.target.value))} />

          <div className="actions">
            <button onClick={generate} disabled={loading}>
              {loading ? "در حال تولید..." : "ساخت کتاب"}
            </button>
            <button className="secondary" disabled={loading} onClick={() => setIdea(examples[Math.floor(Math.random() * examples.length)])}>
              ایده نمونه
            </button>
          </div>

          {status && <div className="status">{status}</div>}
          {error && <div className="error">{error}</div>}
        </section>

        <section className="card">
          {!book ? (
            <div className="empty">{loading ? "لطفاً منتظر بمانید؛ تولید تصویر ممکن است زمان ببرد." : "برای شروع، یک ایده وارد کنید."}</div>
          ) : (
            <>
              <h2 className="book-title">{book.title}</h2>
              <div className="meta">{book.ageBand} • {book.pages.length} صفحه • فارسی</div>

              {book.pages.map(page => (
                <article className="page" key={page.id}>
                  <div className="page-head">صفحه {page.pageNumber} — {page.title}</div>

                  {page.generatedImage ? (
                    <img
                      className="generated-image"
                      src={page.generatedImage}
                      alt={page.title}
                    />
                  ) : (
                    <div className="empty">تصویر این صفحه تولید نشده است.</div>
                  )}

                  <div className="story-text">
                    {page.panels.map(panel => (
                      <div className="panel-text" key={panel.id}>
                        <div>{panel.narration}</div>
                        {panel.dialogue.map((dialogue, index) => (
                          <div className="bubble" key={index}>{dialogue}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
