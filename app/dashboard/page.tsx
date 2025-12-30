import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fetchEvents } from "@/lib/data";
import { EventRegisterButton } from "./EventRegisterButton";

type ProfileRecord = {
  id: string;
  first_name_latin?: string | null;
  last_name_latin?: string | null;
  first_name_ar?: string | null;
  last_name_ar?: string | null;
  email?: string | null;
  phone_country?: string | null;
  phone_number?: string | null;
  street?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
};

type MembershipRecord = {
  id: string;
  status?: string | null;
  started_at?: string | null;
  expires_at?: string | null;
  document_url?: string | null;
  certificate_url?: string | null;
};

type PaymentRecord = {
  id: string;
  created_at?: string | null;
  amount_cents?: number | null;
  currency?: string | null;
  method?: string | null;
  status?: string | null;
  receipt_url?: string | null;
};

type DashboardData = {
  userId: string;
  profile: ProfileRecord | null;
  membership: MembershipRecord | null;
  payments: PaymentRecord[];
  membershipDocUrl: string | null;
  receiptUrl: string | null;
  registrations: Record<string, string>;
  upcomingEvents: EventItem[];
};

function formatDate(date?: string | null) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("ar-FR", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return date;
  }
}

async function loadDashboardData(): Promise<DashboardData | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) return null;

  const [profileRes, membershipRes, paymentsRes, registrationsRes, eventsData] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, first_name_latin, last_name_latin, first_name_ar, last_name_ar, email, phone_country, phone_number, street, postal_code, city, country"
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("memberships")
      .select("id, status, started_at, expires_at, document_url, certificate_url")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("id, created_at, amount_cents, currency, method, status, receipt_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("event_registrations").select("event_id, status").eq("user_id", user.id),
    fetchEvents(),
  ]);

  const registrationMap: Record<string, string> = {};
  registrationsRes.data?.forEach((r: any) => {
    if (r?.event_id) registrationMap[r.event_id] = r.status || "registered";
  });

  const membership = membershipRes.data ?? null;
  const membershipDocPath = membership?.document_url || membership?.certificate_url || null;
  const membershipDocUrl =
    membershipDocPath && membershipDocPath.startsWith("http")
      ? membershipDocPath
      : membershipDocPath
        ? supabase.storage.from("memberships").getPublicUrl(membershipDocPath).data.publicUrl ?? null
        : null;

  const payments = paymentsRes.data ?? [];
  const latestPayment = payments[0];
  const receiptUrl =
    latestPayment?.receipt_url && latestPayment.receipt_url.startsWith("http")
      ? latestPayment.receipt_url
      : latestPayment?.receipt_url
        ? supabase.storage.from("receipts").getPublicUrl(latestPayment.receipt_url).data.publicUrl ?? null
        : null;

  return {
    userId: user.id,
    profile: profileRes.data ?? null,
    membership,
    payments,
    membershipDocUrl,
    receiptUrl,
    registrations: registrationMap,
    upcomingEvents: eventsData.upcoming,
  };
}

function toCurrency(amountCents?: number | null, currency?: string | null) {
  if (!amountCents) return "—";
  const amount = amountCents / 100;
  return `${amount.toFixed(2)} ${currency || "EUR"}`;
}

function statBadge(label: string, value: string, tone: "primary" | "muted" | "success" = "primary") {
  const colors =
    tone === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
      : tone === "muted"
        ? "bg-white/70 text-[color:var(--muted)] border-[color:var(--glass-border)]"
        : "bg-white text-[color:var(--primary-700)] border-[color:var(--glass-border)]";

  return (
    <div className={`rounded-2xl border ${colors} p-4`}>
      <div className="text-xs text-[color:var(--muted)]">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await loadDashboardData();
  if (!data) {
    redirect("/membership?auth=login");
  }

  const { profile, membership, payments, membershipDocUrl, receiptUrl, registrations, upcomingEvents } = data;

  const fullName =
    profile?.first_name_latin && profile?.last_name_latin
      ? `${profile.first_name_latin} ${profile.last_name_latin}`
      : "عضو CHAM";

  const membershipStatus = membership?.status || "pending";
  const started = formatDate(membership?.started_at);
  const expires = formatDate(membership?.expires_at);

  return (
    <div className="space-y-8">
      <section className="glass card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-[color:var(--muted)]">حسابي</div>
            <h1 className="text-3xl font-semibold text-[color:var(--primary-700)]">أهلاً {fullName}</h1>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              راجع بياناتك، وثائق العضوية والدفع، وتابع الفعاليات القادمة وسجّل عليها مباشرة.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/membership"
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/70 px-4 py-2 text-sm text-[color:var(--primary-700)]"
            >
              تحديث البيانات
            </Link>
            {membershipDocUrl ? (
              <a
                href={membershipDocUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl gradient-primary px-4 py-2 text-sm text-white shadow-[var(--shadow)]"
              >
                تحميل وثيقة العضوية
              </a>
            ) : (
              <button
                className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-4 py-2 text-sm text-[color:var(--muted)]"
                disabled
              >
                لا يوجد ملف عضوية بعد
              </button>
            )}
            {receiptUrl ? (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-2 text-sm text-[color:var(--primary-700)]"
              >
                تحميل إيصال الدفع
              </a>
            ) : (
              <button
                className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-4 py-2 text-sm text-[color:var(--muted)]"
                disabled
              >
                لا يوجد إيصال حالياً
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="glass-strong card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[color:var(--muted)]">حالة العضوية</div>
              <div className="mt-1 text-lg font-semibold text-[color:var(--primary-700)]">{membershipStatus}</div>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-[color:var(--primary-700)]">
              {started} → {expires}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {statBadge("بداية", started)}
            {statBadge("انتهاء", expires)}
            {statBadge("الدفعات", `${payments.length || 0}`, "muted")}
            {statBadge("الفعاليات القادمة", `${upcomingEvents.length || 0}`, "success")}
          </div>
        </div>

        <div className="glass card">
          <div className="text-sm text-[color:var(--muted)]">وثيقة العضوية</div>
          <p className="mt-2 text-sm text-[color:var(--text)]">
            {membershipDocUrl ? "ملف PDF جاهز للتحميل." : "سيظهر الرابط هنا بعد إصدار الوثيقة."}
          </p>
        </div>

        <div className="glass card">
          <div className="text-sm text-[color:var(--muted)]">وثيقة الدفع</div>
          <p className="mt-2 text-sm text-[color:var(--text)]">
            {receiptUrl ? "آخر إيصال محفوظ ويمكنك تنزيله." : "لم يتم رفع إيصال بعد."}
          </p>
        </div>
      </section>

      <section className="glass card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">بيانات الحساب</h2>
          <Link href="/membership" className="text-xs text-[color:var(--primary-700)] underline">
            تعديل البيانات
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4">
            <div className="text-xs text-[color:var(--muted)]">الاسم (Latin)</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {profile?.first_name_latin || "—"} {profile?.last_name_latin || ""}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4">
            <div className="text-xs text-[color:var(--muted)]">الاسم (عربي)</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {profile?.first_name_ar || "—"} {profile?.last_name_ar || ""}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4">
            <div className="text-xs text-[color:var(--muted)]">البريد الإلكتروني</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">{profile?.email || "—"}</div>
          </div>
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4">
            <div className="text-xs text-[color:var(--muted)]">الهاتف</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {(profile?.phone_country || "") + " " + (profile?.phone_number || "")}
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4 md:col-span-2">
            <div className="text-xs text-[color:var(--muted)]">العنوان</div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--text)]">
              {[profile?.street, profile?.postal_code, profile?.city, profile?.country].filter(Boolean).join("، ") || "—"}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="glass-strong card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">الدفعات</h2>
            <span className="text-xs text-[color:var(--muted)]">آخر المعاملات</span>
          </div>
          <div className="mt-3 space-y-2">
            {payments.length === 0 ? (
              <div className="rounded-2xl bg-white/70 px-3 py-3 text-sm text-[color:var(--muted)]">لا توجد دفعات بعد.</div>
            ) : (
              payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-sm">
                  <div>
                    <div className="font-semibold text-[color:var(--text)]">{toCurrency(p.amount_cents, p.currency)}</div>
                    <div className="text-xs text-[color:var(--muted)]">
                      {formatDate(p.created_at)} • {p.method || "—"}
                    </div>
                  </div>
                  <span className="rounded-full bg-[color:var(--glass)] px-3 py-1 text-xs text-[color:var(--primary-700)]">
                    {p.status || "pending"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">فعاليات قادمة</h2>
            <span className="text-xs text-[color:var(--muted)]">سجّل من هنا</span>
          </div>
          <div className="mt-3 space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="rounded-2xl bg-white/70 px-3 py-3 text-sm text-[color:var(--muted)]">
                لا توجد فعاليات قادمة حالياً.
              </div>
            ) : (
              upcomingEvents.map((e) => (
                <div key={e.id || e.slug || e.title} className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-sm">
                  <div className="max-w-[70%]">
                    <div className="font-semibold text-[color:var(--text)]">{e.title}</div>
                    <div className="text-xs text-[color:var(--muted)]">
                      {formatDate(e.start_at)} • {e.location || "—"}
                    </div>
                  </div>
                  <EventRegisterButton eventId={e.id} initialStatus={registrations[e.id || ""]} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="glass card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--primary-700)]">ألبوم فعاليات</h2>
          <span className="text-xs text-[color:var(--muted)]">صور مختارة</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {["/media/mission.jpg", "/media/vision.jpg", "/media/about.jpg", "/media/membership.jpg", "/media/donate.jpg"].map((src) => (
            <div
              key={src}
              className="relative h-40 overflow-hidden rounded-2xl border border-[color:var(--glass-border)] bg-white/70"
            >
              <img src={src} alt="فعاليات CHAM" className="h-full w-full object-cover transition duration-300 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
