import Link from "next/link";
import { fetchEvents } from "@/lib/data";

export default async function DashboardPage() {
  const { upcoming } = await fetchEvents();

  return (
    <div className="space-y-8">
      <section className="glass card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-[color:var(--muted)]">حسابي</div>
            <h1 className="text-3xl font-semibold text-[color:var(--primary-700)]">لوحة العضو (قيد الإعداد)</h1>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              تم إيقاف التكاملات مؤقتاً. سنفعّل الحسابات والدفع بعد إعادة البناء.
            </p>
          </div>
          <Link
            href="/membership"
            className="rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2 text-sm text-[color:var(--primary-700)]"
          >
            العودة لنموذج الانتساب
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">الفعاليات القادمة (تجريبية)</h2>
            <span className="text-xs text-[color:var(--muted)]">{upcoming.length} فعاليات</span>
          </div>
          <div className="mt-3 space-y-2">
            {upcoming.map((e) => (
              <div
                key={e.title}
                className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-semibold text-[color:var(--text)]">{e.title}</div>
                  <div className="text-xs text-[color:var(--muted)]">{e.start_at ?? "—"} • {e.location ?? "—"}</div>
                </div>
                <span className="text-xs text-[color:var(--primary-700)]">Soon</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass card">
          <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">التنبيهات</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            سيتم عرض حالة العضوية والدفعات هنا بعد تشغيل النظام الجديد.
          </p>
        </div>
      </section>
    </div>
  );
}
