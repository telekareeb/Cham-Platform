import { fetchEvents } from "../../lib/data";

export default async function EventsPage() {
  const { upcoming, past } = await fetchEvents();

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/events.jpg"
          alt="Events CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">الفعاليات</div>
          <h1 className="mt-1 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            قادم / منتهي
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            لقاءات وأنشطة ثقافية واجتماعية — تابع الجديد وشاهد ما تمّ سابقًا.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Upcoming */}
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[color:var(--primary-700)]">
              قادم
            </h2>
            <span className="rounded-full border border-[color:var(--glass-border)] bg-white/75 px-3 py-1 text-xs text-[color:var(--muted)]">
              {upcoming.length} فعاليات
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {upcoming.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-5"
              >
                <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                  {event.title}
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  {event.start_at ?? "—"} • {event.location ?? "—"}
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {event.description ?? "التفاصيل قريباً"}
                </p>
                <button className="mt-3 text-sm text-[color:var(--primary-700)] hover:opacity-80 transition">
                  عرض التفاصيل →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Past */}
        <div className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[color:var(--primary-700)]">
              منتهية
            </h2>
            <span className="rounded-full border border-[color:var(--glass-border)] bg-white/75 px-3 py-1 text-xs text-[color:var(--muted)]">
              {past.length} فعاليات
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {past.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-[color:var(--glass-border)] bg-white/75 p-5"
              >
                <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                  {event.title}
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  {event.start_at ?? "—"} • {event.location ?? "—"}
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {event.description ?? "التفاصيل قريباً"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}