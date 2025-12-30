import Link from "next/link";

export default function VisionPage() {
  const points = [
    "تجربة رقمية بسيطة وواضحة للمجتمع.",
    "شفافية في العضويات والدفعات والتقارير.",
    "محتوى محدث حول الأخبار والفعاليات.",
    "إدارة متكاملة للأعضاء والرسائل والمبادرات.",
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/vision.jpg"
          alt="Vision CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">رؤيتنا</div>

          <h1 className="mt-2 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            منصة مجتمعية موثوقة تربط الثقافة بالعمل الإنساني
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-[color:var(--muted)]">
            نطمح إلى أن تكون جمعية شام إطارًا مجتمعيًا مستدامًا يدعم المشاركة والتكافل
            ويعزز الروابط الإنسانية، عبر تجربة رقمية هادئة وعمل مؤسسي شفاف.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-xl bg-[color:var(--accent-600)] px-6 py-2.5 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
            >
              تعرّف علينا
            </Link>
            <Link
              href="/news"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-6 py-2.5 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
            >
              تابع الأخبار
            </Link>
          </div>
        </div>
      </section>

      {/* Core pillars */}
      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-white/70 p-8 shadow-[var(--shadow)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-[color:var(--primary-700)]">
              ركائز الرؤية
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-[color:var(--muted)]">
              {points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-4 text-sm text-[color:var(--muted)]">
              ملاحظة: التصميم هنا “هادئ ومؤسسي” مناسب لمواقع الجمعيات العالمية—بدون
              مبالغة أو تسويق هجومي.
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-6">
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage: "url(/media/hero.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative">
              <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                صورة رمزية
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                ضع هنا صورة تعبّر عن مستقبل الجمعية: لقاءات، عمل تطوعي، فعالية ثقافية
                أو تعاون مجتمعي.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}