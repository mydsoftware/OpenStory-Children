import { createDeterministicBook } from "@openstory/core";

export default function Home() {
  const book = createDeterministicBook({
    idea: "دینو در جنگل به دنبال دوستش می‌گردد.",
    ageBand: "4-5",
    language: "fa",
    pageCount: 4
  });

  return (
    <main dir="rtl" style={{ maxWidth: 900, margin: "0 auto", padding: 32, fontFamily: "sans-serif" }}>
      <h1>OpenStory Children</h1>
      <p>اولین vertical slice: ایده → کتاب ساختاریافته → صفحه کمیک</p>
      <section style={{ border: "1px solid #ddd", borderRadius: 16, padding: 24, marginTop: 24 }}>
        <h2>{book.title}</h2>
        <p>{book.sourceIdea}</p>
        <div style={{ display: "grid", gap: 12 }}>
          {book.pages.map((page) => (
            <article key={page.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
              <strong>{page.pageNumber}. {page.title}</strong>
              <p>{page.panels[0]?.narration}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
