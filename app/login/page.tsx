"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section className="relative overflow-hidden rounded-[32px] border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="text-sm text-[color:var(--muted)]">تسجيل الدخول</div>
        <h1 className="mt-2 text-3xl font-semibold text-[color:var(--primary-700)]">ادخل إلى حسابك</h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
          استخدم بريدك وكلمة المرور. إذا لم يكن لديك حساب، يمكنك إنشاء حساب جديد من صفحة الانتساب.
        </p>
      </section>

      <section className="rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 shadow-[var(--shadow)] backdrop-blur-xl">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-[color:var(--muted)]">البريد الإلكتروني</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              placeholder="name@email.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-[color:var(--muted)]">كلمة المرور</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-xl border border-[color:var(--glass-border)] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--primary-500)]"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-[color:var(--glass-border)] bg-white/80 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[color:var(--accent-600)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[color:var(--muted)]">
          ليس لديك حساب؟{" "}
          <Link href="/membership" className="text-[color:var(--primary-700)] underline">
            أنشئ حسابك من صفحة الانتساب
          </Link>
        </div>
      </section>
    </div>
  );
}
