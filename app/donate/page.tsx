export default function DonatePage() {
  const suggested = [25, 50, 100, 250];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/donate.jpg"
          alt="Donate CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">التبرع</div>
          <h1 className="mt-1 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            ادعم جمعية شام
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            اختر مبلغاً أو أدخل مبلغك. سيتم تفعيل بوابة الدفع لاحقاً بعد إعادة البناء.
            يمكن التبرع باسمك أو كمجهول مع إيصال PDF وشكر تلقائي.
          </p>
        </div>
      </section>

      {/* FORM */}
      <form className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            <div>
              <label className="text-sm text-[color:var(--muted)]">المبلغ</label>

              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                {suggested.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-3 py-3 text-sm text-[color:var(--primary-700)] hover:bg-white transition"
                  >
                    €{amt}
                  </button>
                ))}
              </div>

              <input
                type="number"
                className="mt-3 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="أدخل مبلغ آخر"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]">
                <input type="checkbox" name="anonymous" />
                تبرع كمجهول
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]">
                <input type="checkbox" name="receipt" defaultChecked />
                استلام إيصال PDF
              </label>
            </div>

            <div>
              <div className="text-sm text-[color:var(--muted)]">طريقة الدفع</div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[
                  { label: "بطاقة بنكية", value: "card" },
                  { label: "رفع إيصال", value: "manual" },
                  { label: "طريقة أخرى", value: "other" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]"
                  >
                    <input type="radio" name="method" value={method.value} />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-[color:var(--glass-border)] bg-white/70 p-4 text-sm text-[color:var(--muted)]">
              رفع إيصال (اختياري): اسحب وأفلت الملف هنا
            </div>

            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/60 p-4 text-xs text-[color:var(--muted)]">
              ملاحظة: سيتم ربط بوابة دفع لاحقاً عند تجهيز النظام الجديد.
            </div>
          </div>

          {/* Summary */}
          <aside className="rounded-3xl border border-[color:var(--glass-border)] bg-white/75 p-6 shadow-[var(--shadow)] space-y-3">
            <div className="text-sm font-semibold text-[color:var(--primary-700)]">
              ملخص
            </div>

            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>المبلغ</span>
              <span>—</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>الطريقة</span>
              <span>—</span>
            </div>
            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>الرسوم</span>
              <span>0 €</span>
            </div>

            <div className="h-px bg-[color:var(--glass-border)]" />

            <div className="flex items-center justify-between text-sm font-semibold text-[color:var(--primary-700)]">
              <span>الإجمالي</span>
              <span>—</span>
            </div>

            <button className="w-full rounded-xl bg-[color:var(--accent-600)] px-4 py-3 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition">
              تأكيد التبرع
            </button>
          </aside>
        </div>
      </form>
    </div>
  );
}
