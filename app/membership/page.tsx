"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import {
  COUNTRIES,
  DEFAULT_COUNTRY_ISO2,
  DEFAULT_DIAL,
  flagEmojiFromISO2,
  getCountryByISO2,
  getUniqueDialCountries,
} from "@/lib/countries";

type PaymentUI = "stripe" | "apple" | "manual" | "waiver";

type FormState = {
  title: "mr" | "mrs" | "";

  // ✅ Latin (required)
  firstNameLatin: string;
  lastNameLatin: string;

  // ✅ Arabic (optional)
  firstNameAr: string;
  lastNameAr: string;

  dateOfBirth: string; // YYYY-MM-DD

  street: string;
  postalCode: string;
  city: string;
  country: string; // ISO2

  email: string;
  phoneCountry: string; // dial like +33
  phoneNumber: string;
};

function toDbPaymentMethod(p: PaymentUI) {
  if (p === "stripe") return "stripe_card";
  if (p === "apple") return "apple_pay";
  return p;
}

function isEmailValid(email: string) {
  const e = email.trim().toLowerCase();
  return e.includes("@") && e.includes(".");
}

function hasLatin(s: string) {
  return /[A-Za-z]/.test(s);
}
function hasArabic(s: string) {
  return /[\u0600-\u06FF]/.test(s);
}

function ageInYearsFromISO(dobIso: string) {
  const dob = new Date(dobIso);
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export default function MembershipPage() {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentUI>("stripe");
  const [receipt, setReceipt] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",

    firstNameLatin: "",
    lastNameLatin: "",
    firstNameAr: "",
    lastNameAr: "",

    dateOfBirth: "",

    street: "",
    postalCode: "",
    city: "",
    country: DEFAULT_COUNTRY_ISO2,

    email: "",
    phoneCountry: DEFAULT_DIAL,
    phoneNumber: "",
  });

  const dialOptions = useMemo(() => getUniqueDialCountries(), []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onCountryChange(iso2: string) {
    setField("country", iso2);
    const found = getCountryByISO2(iso2);
    if (found?.dial) setField("phoneCountry", found.dial);
  }

  function validate() {
    if (!form.title) return "اختر السيد/السيدة";

    // ✅ Latin required
    if (!form.firstNameLatin.trim()) return "الاسم باللاتيني مطلوب";
    if (!form.lastNameLatin.trim()) return "الكنية باللاتيني مطلوبة";
    if (!hasLatin(form.firstNameLatin)) return "الاسم باللاتيني يجب أن يحتوي أحرف A-Z";
    if (!hasLatin(form.lastNameLatin)) return "الكنية باللاتيني يجب أن تحتوي أحرف A-Z";

    // ✅ Arabic optional (if provided, must contain Arabic letters)
    if (form.firstNameAr.trim() && !hasArabic(form.firstNameAr))
      return "الاسم بالعربي يجب أن يحتوي حروف عربية";
    if (form.lastNameAr.trim() && !hasArabic(form.lastNameAr))
      return "الكنية بالعربي يجب أن تحتوي حروف عربية";

    // ✅ DOB 16+
    if (!form.dateOfBirth) return "تاريخ الميلاد مطلوب";
    const age = ageInYearsFromISO(form.dateOfBirth);
    if (age === null) return "تاريخ الميلاد غير صحيح";
    if (age < 16) return "الانتساب متاح لمن عمره 16 سنة فما فوق";

    if (!form.street.trim()) return "اسم ورقم الشارع مطلوب";
    if (!form.postalCode.trim()) return "الرمز البريدي مطلوب";
    if (!form.city.trim()) return "المدينة مطلوبة";
    if (!form.country.trim()) return "الدولة مطلوبة";

    if (!isEmailValid(form.email)) return "البريد الإلكتروني غير صحيح";
    if (!form.phoneNumber.trim()) return "رقم الهاتف مطلوب";

    if (payment === "manual" && !receipt) return "رفع الإيصال مطلوب للدفع اليدوي";
    return null;
  }

  // ✅ restore draft after magic link
  useEffect(() => {
    const raw = localStorage.getItem("cham_membership_draft");
    if (!raw) return;

    try {
      const draft = JSON.parse(raw) as { form?: Partial<FormState>; payment?: PaymentUI };
      if (draft?.form) {
        setForm((prev) => ({
          ...prev,
          ...draft.form,
          country: draft.form?.country || prev.country,
          phoneCountry: draft.form?.phoneCountry || prev.phoneCountry,
        }));
      }
      if (draft?.payment) setPayment(draft.payment);
    } catch {
      // ignore
    }
  }, []);

  // ✅ auto submit if returning from callback (non-manual)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") !== "ok") return;
    if (payment === "manual") return;

    (async () => {
      try {
        const { data } = await supabaseClient.auth.getUser();
        if (!data.user) return;
        await submitMembership({ skipAuth: true });
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitMembership(opts?: { skipAuth?: boolean }) {
    setErrorMsg(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabaseClient.auth.getUser();
      const user = data.user;

      // 1) Not logged in => sign up email + password (sends confirmation email)
      if (!user && !opts?.skipAuth) {
        if (!password || password.length < 6) {
          setErrorMsg("كلمة المرور مطلوبة (٦ محارف على الأقل)");
          return;
        }

        localStorage.setItem(
          "cham_membership_draft",
          JSON.stringify({
            form,
            payment,
          })
        );

        const redirectTo =
          process.env.NEXT_PUBLIC_SITE_URL
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            : typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : "http://localhost:3000/auth/callback";

        const { error } = await supabaseClient.auth.signUp({
          email: form.email.trim().toLowerCase(),
          password,
          options: { emailRedirectTo: redirectTo },
        });

        if (error) {
          setErrorMsg(error.message || "فشل إنشاء الحساب");
          return;
        }

        setSuccessMsg("تم إنشاء الحساب وإرسال رابط تأكيد البريد ✅ افتح الرابط ثم ارجع لهذه الصفحة لإكمال الطلب.");
        return;
      }

      // 2) Logged in => submit
      const fd = new FormData();
      fd.append("gender", form.title);

      // ✅ Names (latin required + arabic optional)
      fd.append("first_name_latin", form.firstNameLatin.trim());
      fd.append("last_name_latin", form.lastNameLatin.trim());
      if (form.firstNameAr.trim()) fd.append("first_name_ar", form.firstNameAr.trim());
      if (form.lastNameAr.trim()) fd.append("last_name_ar", form.lastNameAr.trim());

      fd.append("date_of_birth", form.dateOfBirth);

      // keep your existing profile columns too (email etc.)
      fd.append("email", form.email.trim().toLowerCase());
      fd.append("phone_country", form.phoneCountry);
      fd.append("phone_number", form.phoneNumber.trim());

      fd.append("street", form.street.trim());
      fd.append("postal_code", form.postalCode.trim());
      fd.append("city", form.city.trim());
      fd.append("country", form.country);

      fd.append("payment_method", toDbPaymentMethod(payment));
      fd.append("amount_cents", "5000");
      fd.append("currency", "EUR");

      if (receipt) fd.append("receipt", receipt);

      const res2 = await fetch("/api/membership/submit", { method: "POST", body: fd });
      const out2 = await res2.json().catch(() => null);

      if (!res2.ok || !out2?.ok) {
        setErrorMsg(out2?.error || "فشل إرسال الطلب");
        return;
      }

      setSuccessMsg("تم إرسال طلب الانتساب بنجاح ✅");
      localStorage.removeItem("cham_membership_draft");
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitMembership();
  }

  const selectedCountry = useMemo(() => getCountryByISO2(form.country), [form.country]);

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] shadow-[var(--shadow)]">
        <img
          src="/media/membership.jpg"
          alt="Membership CHAM"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 backdrop-blur-[6px]" />
        <div className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-[color:var(--primary-500)] blur-[120px] opacity-35" />

        <div className="relative p-10 md:p-12">
          <div className="text-sm text-[color:var(--muted)]">الانتساب</div>
          <h1 className="mt-1 text-3xl font-semibold text-[color:var(--primary-700)] md:text-4xl">
            نموذج الانتساب
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
            أدخل بياناتك ثم اختر وسيلة الدفع المناسبة. إذا لم تكن مسجّلًا، أنشئ حسابك
            ببريدك وكلمة مرور، أكّد بريدك ثم أكمل إرسال الطلب.
          </p>
        </div>
      </section>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 backdrop-blur-xl shadow-[var(--shadow)] space-y-8"
      >
        {/* Alerts */}
        {errorMsg ? (
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4 text-sm text-[color:var(--muted)]">
            <div className="font-semibold text-[color:var(--primary-700)]">تنبيه</div>
            <div className="mt-1">{errorMsg}</div>
          </div>
        ) : null}

        {successMsg ? (
          <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-4 text-sm text-[color:var(--muted)]">
            <div className="font-semibold text-[color:var(--primary-700)]">تم</div>
            <div className="mt-1">{successMsg}</div>
          </div>
        ) : null}

        {/* STEP 1: Personal */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[color:var(--primary-700)]">
            <span className="h-8 w-8 rounded-full border border-[color:var(--glass-border)] bg-white/75 text-center leading-8">
              1
            </span>
            البيانات الشخصية
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]">
                <input
                  type="radio"
                  name="title"
                  value="mr"
                  checked={form.title === "mr"}
                  onChange={() => setField("title", "mr")}
                />
                السيد
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]">
                <input
                  type="radio"
                  name="title"
                  value="mrs"
                  checked={form.title === "mrs"}
                  onChange={() => setField("title", "mrs")}
                />
                السيدة
              </label>
            </div>

            {/* Latin required */}
            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">الاسم (Latin) *</label>
              <input
                value={form.firstNameLatin}
                onChange={(e) => setField("firstNameLatin", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="Example: Mohamed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">الكنية (Latin) *</label>
              <input
                value={form.lastNameLatin}
                onChange={(e) => setField("lastNameLatin", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="Example: Ali"
              />
            </div>

            {/* Arabic optional */}
            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">الاسم (عربي) (اختياري)</label>
              <input
                value={form.firstNameAr}
                onChange={(e) => setField("firstNameAr", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="مثال: محمد"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">الكنية (عربي) (اختياري)</label>
              <input
                value={form.lastNameAr}
                onChange={(e) => setField("lastNameAr", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="مثال: علي"
              />
            </div>

            {/* DOB */}
            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">تاريخ الميلاد *</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              />
              <div className="mt-2 text-xs text-[color:var(--muted)]">الشرط: عمر 16 سنة فما فوق</div>
            </div>
          </div>
        </div>

        {/* STEP 2: Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[color:var(--primary-700)]">
            <span className="h-8 w-8 rounded-full border border-[color:var(--glass-border)] bg-white/75 text-center leading-8">
              2
            </span>
            العنوان
          </div>

          <div className="grid gap-4 md:grid-cols-12">
            <div className="md:col-span-12">
              <label className="text-sm text-[color:var(--muted)]">اسم ورقم الشارع</label>
              <input
                value={form.street}
                onChange={(e) => setField("street", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="مثال: 10 Rue Victor Hugo"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm text-[color:var(--muted)]">الرمز البريدي</label>
              <input
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="75000"
              />
            </div>

            <div className="md:col-span-5">
              <label className="text-sm text-[color:var(--muted)]">المدينة</label>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="Paris"
              />
            </div>

            <div className="md:col-span-4">
              <label className="text-sm text-[color:var(--muted)]">الدولة</label>
              <select
                value={form.country}
                onChange={(e) => onCountryChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.iso2} value={c.iso2}>
                    {flagEmojiFromISO2(c.iso2)} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* STEP 3: Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[color:var(--primary-700)]">
            <span className="h-8 w-8 rounded-full border border-[color:var(--glass-border)] bg-white/75 text-center leading-8">
              3
            </span>
            معلومات التواصل
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm text-[color:var(--muted)]">البريد الإلكتروني</label>
              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                type="email"
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="name@email.com"
              />
              <div className="mt-2 text-xs text-[color:var(--muted)]">
                يستخدم للدخول وتأكيد الحساب.
              </div>
            </div>

            <div>
              <label className="text-sm text-[color:var(--muted)]">كلمة المرور</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                placeholder="••••••••"
              />
              <div className="mt-2 text-xs text-[color:var(--muted)]">٦ محارف على الأقل.</div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-[color:var(--muted)]">رقم الهاتف</label>
              <div className="mt-1 flex gap-2">
                <select
                  value={form.phoneCountry}
                  onChange={(e) => setField("phoneCountry", e.target.value)}
                  className="w-28 rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-2 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                >
                  {dialOptions.map((c) => (
                    <option key={c.dial} value={c.dial}>
                      {flagEmojiFromISO2(c.iso2)} {c.dial}
                    </option>
                  ))}
                </select>

                <input
                  value={form.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  className="flex-1 rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
                  placeholder="رقم الهاتف"
                />
              </div>

              <div className="mt-2 text-xs text-[color:var(--muted)]">
                الكود الافتراضي يتبع الدولة:{" "}
                <span className="font-medium">
                  {selectedCountry
                    ? `${flagEmojiFromISO2(selectedCountry.iso2)} ${selectedCountry.name}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: Payment */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-[color:var(--primary-700)]">
            <span className="h-8 w-8 rounded-full border border-[color:var(--glass-border)] bg-white/75 text-center leading-8">
              4
            </span>
            وسائل الدفع
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: "بطاقة (Stripe)", value: "stripe" as const },
              { label: "Apple Pay", value: "apple" as const },
              { label: "رفع إيصال", value: "manual" as const },
              { label: "حالة خاصة", value: "waiver" as const },
            ].map((method) => (
              <label
                key={method.value}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)] hover:bg-white transition"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={payment === method.value}
                  onChange={() => setPayment(method.value)}
                />
                {method.label}
              </label>
            ))}
          </div>

          {payment === "manual" ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--glass-border)] bg-white/70 p-4 text-sm text-[color:var(--muted)]">
              رفع إيصال (PDF/صورة)
              <div className="mt-3">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                />
                {receipt ? (
                  <div className="mt-2 text-xs text-[color:var(--muted)]">
                    الملف: <span className="font-medium">{receipt.name}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 text-xs text-[color:var(--muted)]">
                ملاحظة: بعد إعادة تحميل الصفحة قد تحتاج لإعادة اختيار الملف.
              </div>
            </div>
          ) : null}

          {payment === "waiver" ? (
            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/70 p-4 text-sm text-[color:var(--muted)]">
              حالة خاصة: يتم إرسال الطلب للإدارة للمراجعة (بدون دفع مباشر).
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-[color:var(--muted)]">
            بإرسال الطلب سيتم إنشاء حساب عضوية بحالة{" "}
            <span className="font-medium">Pending</span> حتى تأكيد الدفع.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[color:var(--accent-600)] px-6 py-3 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </form>
    </div>
  );
}
