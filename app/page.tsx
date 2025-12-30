import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        {/* Background image (واضحة) */}
        <img
          src="/media/hero.jpg"
          alt="CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Soft white overlay لراحة القراءة */}
        <div className="absolute inset-0 bg-white/70" />

        {/* Glass blur overlay (خفيف – لا يبلّر الصورة مباشرة) */}
        

        {/* Burgundy glow */}
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-40" />

        {/* Content */}
        <div className="relative p-10 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-border)] bg-white/70 px-4 py-2 text-xs text-[color:var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--accent-600)]" />
            Culturelle • Humanitaire • Amitié • Mutuelle
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-tight text-[color:var(--primary-700)] md:text-5xl">
            جمعية شام — CHAM
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[color:var(--muted)]">
            منصة جمعية شام لتنظيم الانتساب، الدفعات، الأخبار والفعاليات والتبرعات
            بطريقة بسيطة، إنسانية وشفافة.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="rounded-xl bg-[color:var(--accent-600)] px-6 py-2.5 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
            >
              انتسب الآن
            </Link>

            <Link
              href="/donate"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-6 py-2.5 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
            >
              تبرّع
            </Link>

            <Link
              href="/events"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-6 py-2.5 text-sm text-[color:var(--muted)] hover:bg-white/85 transition"
            >
              الفعاليات
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "المنتسبون",
            value: "—",
            note: "إدارة عضوية منظمة",
          },
          {
            title: "الفعاليات",
            value: "—",
            note: "أنشطة اجتماعية وثقافية",
          },
          {
            title: "الأخبار",
            value: "—",
            note: "تحديثات الجمعية",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-6 backdrop-blur-xl shadow-[var(--shadow)]"
          >
            <div className="text-sm text-[color:var(--muted)]">{item.title}</div>
            <div className="mt-2 text-3xl font-semibold text-[color:var(--primary-700)]">
              {item.value}
            </div>
            <div className="mt-1 text-xs text-[color:var(--muted)]">
              {item.note}
            </div>
          </div>
        ))}
      </section>

      {/* ================= NEWS & EVENTS ================= */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* News */}
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">
              آخر الأخبار
            </h2>
            <Link
              href="/news"
              className="text-sm text-[color:var(--primary-700)] hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {["خبر تجريبي 1", "خبر تجريبي 2", "خبر تجريبي 3"].map((news) => (
              <div
                key={news}
                className="rounded-2xl bg-white/60 px-4 py-3"
              >
                <div className="text-sm font-medium text-[color:var(--text)]">
                  {news}
                </div>
                <div className="text-xs text-[color:var(--muted)]">
                  قريبًا…
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">
              فعاليات قادمة
            </h2>
            <Link
              href="/events"
              className="text-sm text-[color:var(--primary-700)] hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {["فعالية 1", "فعالية 2"].map((event) => (
              <div
                key={event}
                className="rounded-2xl bg-white/60 px-4 py-3"
              >
                <div className="text-sm font-medium text-[color:var(--text)]">
                  {event}
                </div>
                <div className="text-xs text-[color:var(--muted)]">
                  التاريخ والمكان قريبًا…
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DONATION CTA ================= */}
      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-white/70 p-8 shadow-[var(--shadow)]">
        <h3 className="text-xl font-semibold text-[color:var(--primary-700)]">
          دعم أنشطة جمعية شام
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted)]">
          تبرعك يساهم في استمرار الأنشطة الثقافية والإنسانية والاجتماعية للجمعية
          بطريقة منظمة وشفافة.
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/donate"
            className="rounded-xl bg-[color:var(--accent-600)] px-6 py-2.5 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
          >
            تبرّع الآن
          </Link>
          <Link
            href="/membership"
            className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-6 py-2.5 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
          >
            انتسب
          </Link>
        </div>
      </section>
    </div>
  );
}