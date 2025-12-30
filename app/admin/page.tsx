const members = [
  { name: "أحمد ح.", status: "active", joined: "2024-04-01" },
  { name: "ليلى ر.", status: "pending", joined: "2024-07-10" },
];

const payments = [
  { user: "أحمد ح.", amount: "€50", method: "Stripe", status: "succeeded" },
  { user: "ليلى ر.", amount: "€50", method: "Manual", status: "pending" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section className="glass card">
        <div className="text-sm text-[color:var(--muted)]">لوحة الإدارة</div>
        <h1 className="text-3xl font-semibold text-[color:var(--primary-700)]">إدارة الأعضاء والدفعات والمحتوى</h1>
        <p className="mt-2 text-[color:var(--text)]">بحث، فلترة، إرسال رسائل، ومزامنة Stripe.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-strong card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">المنتسبون</h2>
            <button className="text-sm text-[color:var(--primary-700)] underline">عرض الكل</button>
          </div>
          <div className="mt-3 space-y-2">
            {members.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-2xl bg-white/75 px-3 py-2 text-sm">
                <div>
                  <div className="font-semibold text-[color:var(--text)]">{m.name}</div>
                  <div className="text-xs text-[color:var(--muted)]">انضم: {m.joined}</div>
                </div>
                <span className="rounded-full bg-[color:var(--glass)] px-3 py-1 text-xs text-[color:var(--primary-700)]">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">الدفعات</h2>
            <button className="text-sm text-[color:var(--primary-700)] underline">Sync Stripe</button>
          </div>
          <div className="mt-3 space-y-2">
            {payments.map((p) => (
              <div key={p.user} className="flex items-center justify-between rounded-2xl bg-white/75 px-3 py-2 text-sm">
                <div>
                  <div className="font-semibold text-[color:var(--text)]">{p.user}</div>
                  <div className="text-xs text-[color:var(--muted)]">{p.method} • {p.amount}</div>
                </div>
                <span className="rounded-full bg-[color:var(--glass)] px-3 py-1 text-xs text-[color:var(--primary-700)]">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">الرسائل</h2>
            <span className="text-xs text-[color:var(--muted)]">Email (قابل للتوسع WhatsApp)</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-3">
              <div className="font-semibold text-[color:var(--text)]">إرسال فرد</div>
              <p className="text-xs text-[color:var(--muted)]">إلى عضو محدد</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-3">
              <div className="font-semibold text-[color:var(--text)]">إرسال مجموعة</div>
              <p className="text-xs text-[color:var(--muted)]">حسب حالة العضوية</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-3">
              <div className="font-semibold text-[color:var(--text)]">إرسال للكل</div>
              <p className="text-xs text-[color:var(--muted)]">نشرة عامة</p>
            </div>
          </div>
        </div>

        <div className="glass card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">المحتوى</h2>
            <span className="text-xs text-[color:var(--muted)]">أخبار • فعاليات • صور</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-2xl bg-white/75 px-3 py-2">إضافة خبر جديد</div>
            <div className="rounded-2xl bg-white/75 px-3 py-2">إضافة فعالية</div>
            <div className="rounded-2xl bg-white/75 px-3 py-2">رفع صور</div>
          </div>
        </div>
      </section>
    </div>
  );
}
