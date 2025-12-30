import Link from "next/link";

export default function MissionPage() {
  const pillars = [
    { title: "ثقافة", desc: "تنظيم أنشطة ثقافية واجتماعية تعزز التواصل والانتماء." },
    { title: "إنسانية", desc: "مساندة عند الحاجة عبر مبادرات دعم وتضامن." },
    { title: "صداقة", desc: "بناء علاقات مجتمعية صحية تحترم الاختلاف وتجمع الناس." },
    { title: "تكافل", desc: "دعم متبادل ومرافقة للأفراد ضمن إطار منظم وشفاف." },
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/mission.jpg"
          alt="Mission CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">مهمتنا</div>

          <h1 className="mt-2 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            عمل منظم يخدم المجتمع بروح التضامن
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-[color:var(--muted)]">
            نعمل على تنظيم الانتساب والأنشطة والفعاليات، وتطوير مبادرات ثقافية وإنسانية
            تُعزّز الترابط، وتقدّم دعمًا متبادلًا بكرامة واحترام.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-xl bg-[color:var(--accent-600)] px-6 py-2.5 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
            >
              شاهد الفعاليات
            </Link>
            <Link
              href="/donate"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-6 py-2.5 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
            >
              دعم المبادرات
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
        <div>
          <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">
            محاور العمل
          </h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            إطار واضح لأنشطة الجمعية
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-6"
            >
              <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                {p.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Note block */}
      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-white/70 p-8 shadow-[var(--shadow)]">
        <h3 className="text-lg font-semibold text-[color:var(--primary-700)]">
          كيف نترجم مهمتنا إلى عمل؟
        </h3>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          عبر تنظيم واضح للعضويات والدفعات، وجدولة فعاليات، ونشر أخبار شفافة، وتفعيل
          التبرعات لدعم المبادرات—مع احترام خصوصية الأعضاء وسهولة تجربة الاستخدام.
        </p>
      </section>
    </div>
  );
}