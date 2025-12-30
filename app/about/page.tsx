import Link from "next/link";

export default function AboutPage() {
  const values = [
    { title: "التضامن", desc: "نقف معًا لدعم أفراد المجتمع واحتياجاتهم الإنسانية." },
    { title: "الشفافية", desc: "إدارة واضحة للموارد، والتقارير، والتواصل مع الأعضاء." },
    { title: "المشاركة", desc: "فعاليات وأنشطة تعزز الثقافة، الصداقة، والعمل التطوعي." },
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/about.jpg"
          alt="About CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">من نحن</div>

          <h1 className="mt-2 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            جمعية شام — ثقافة، إنسانية، صداقة، تكافل
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-[color:var(--muted)]">
            جمعية تعمل على تعزيز الروابط المجتمعية عبر أنشطة ثقافية ومبادرات إنسانية
            ودعم متبادل، ضمن إطار تنظيمي واضح وتجربة رقمية هادئة وموثوقة.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/membership"
              className="rounded-xl bg-[color:var(--accent-600)] px-6 py-2.5 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
            >
              انتسب الآن
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-6 py-2.5 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* تعريف + صورة/رسالة */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
          <h2 className="text-xl font-semibold text-[color:var(--primary-700)]">
            تعريف الجمعية
          </h2>
          <p className="mt-3 leading-7 text-[color:var(--muted)]">
            جمعية شام تربط الأعضاء عبر برامج ثقافية واجتماعية، وتشارك في مبادرات
            إنسانية عند الحاجة، وتعمل على بناء شبكة صداقة ودعم متبادل داخل المجتمع
            وخارجه بروح الاحترام والعيش المشترك.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-[color:var(--glass-border)] bg-white/60 p-8 shadow-[var(--shadow)]">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "url(/media/hero.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative">
            <h2 className="text-xl font-semibold text-[color:var(--primary-700)]">
              صورة جماعية / لحظة من نشاط
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
              ضع هنا صورة تمثل فعالية أو لقاء اجتماعي أو عمل تطوعي — الأفضل صور حقيقية
              غير مبالغ فيها.
            </p>
          </div>
        </div>
      </section>

      {/* قيمنا */}
      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--primary-700)]">
              قيمنا
            </h3>
            <p className="text-sm text-[color:var(--muted)]">
              مرتكزات العمل في الجمعية
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-5"
            >
              <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                {v.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}