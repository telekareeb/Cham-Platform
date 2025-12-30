import { fetchNews } from "../../lib/data";

export default async function NewsPage() {
  const articles = await fetchNews();

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/news.jpg"
          alt="News CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm text-[color:var(--muted)]">الأخبار</div>
              <h1 className="mt-1 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
                آخر المستجدات
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
                إعلانات، مبادرات، وتحديثات ثقافية — بشكل واضح ومختصر.
              </p>
            </div>

            <div className="rounded-full border border-[color:var(--glass-border)] bg-white/75 px-4 py-2 text-xs text-[color:var(--muted)]">
              التصنيفات: إعلانات • مبادرات • ثقافة
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.title}
            className="rounded-3xl border border-[color:var(--glass-border)] bg-white/70 p-6 shadow-[var(--shadow)]"
          >
            <div className="text-xs text-[color:var(--muted)]">
              {article.category ?? "تصنيف"} • {article.published_at ?? "—"}
            </div>

            <h2 className="mt-2 text-lg font-semibold text-[color:var(--primary-700)]">
              {article.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              {article.excerpt ?? "..."}
            </p>

            <button className="mt-4 text-sm text-[color:var(--primary-700)] hover:opacity-80 transition">
              قراءة المزيد →
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}