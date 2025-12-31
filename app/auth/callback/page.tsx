"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseFragmentTokens(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const access_token = params.get("access_token") || undefined;
  const refresh_token = params.get("refresh_token") || undefined;
  return { access_token, refresh_token };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("جارٍ التحقق من الجلسة...");

  useEffect(() => {
    (async () => {
      try {
        // 1) try hash fragments (signup/recovery)
        const { access_token, refresh_token } = parseFragmentTokens(window.location.hash || "");
        if (access_token && refresh_token) {
          const { error } = await supabaseClient.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
          setMessage("تم التأكيد، جاري التحويل...");
          setTimeout(() => router.replace("/membership?auth=ok"), 200);
          return;
        }

        // 2) fallback: code param (PKCE)
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setMessage("تم التأكيد، جاري التحويل...");
          setTimeout(() => router.replace("/membership?auth=ok"), 200);
          return;
        }

        setMessage("لم يتم العثور على بيانات جلسة. ستتم إعادتك...");
        setTimeout(() => router.replace("/membership?auth=failed"), 600);
      } catch (e: any) {
        setMessage(e?.message || "خطأ غير متوقع");
        setTimeout(() => router.replace("/membership?auth=failed"), 800);
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 text-center shadow-[var(--shadow)] backdrop-blur-xl">
      <div className="text-sm text-[color:var(--muted)]">تأكيد البريد</div>
      <h1 className="mt-2 text-2xl font-semibold text-[color:var(--primary-700)]">لحظة من فضلك</h1>
      <p className="mt-3 text-sm text-[color:var(--muted)]">{message}</p>
    </div>
  );
}
