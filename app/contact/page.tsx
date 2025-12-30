export default function ContactPage() {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/contact.jpg"
          alt="Contact CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">التواصل</div>
          <h1 className="mt-1 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            تواصل معنا
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            لأي استفسار حول الانتساب، التبرعات، أو الفعاليات — اترك رسالة وسنعود إليك.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Form */}
        <form className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)] space-y-4">
          <div>
            <label className="text-sm text-[color:var(--muted)]">الاسم الكامل</label>
            <input
              className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              placeholder="اسمك"
            />
          </div>

          <div>
            <label className="text-sm text-[color:var(--muted)]">البريد الإلكتروني</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              placeholder="name@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-[color:var(--muted)]">رسالتك</label>
            <textarea
              rows={5}
              className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              placeholder="كيف يمكننا المساعدة؟"
            />
          </div>

          <button className="w-full rounded-xl bg-[color:var(--accent-600)] px-4 py-3 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition">
            إرسال
          </button>
        </form>

        {/* Side card */}
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-white/70 p-8 shadow-[var(--shadow)] space-y-3">
          <div className="text-sm font-semibold text-[color:var(--primary-700)]">
            طرق أخرى
          </div>

          <div className="text-sm text-[color:var(--muted)]">
            Email: <span className="text-[color:var(--text)]">contact@cham.org</span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-[color:var(--muted)]">
            {["Instagram", "Facebook", "LinkedIn"].map((s) => (
              <span
                key={s}
                className="rounded-full border border-[color:var(--glass-border)] bg-white/80 px-3 py-1"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-4 text-xs text-[color:var(--muted)]">
            (لاحقًا) سنضيف نموذج إرسال فعلي مع حفظ الرسائل في قاعدة البيانات + إشعار للإدارة.
          </div>
        </div>
      </section>
    </div>
  );
}