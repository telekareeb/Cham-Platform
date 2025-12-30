"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("جارٍ التحقق من الجلسة...");

  useEffect(() => {
    (async () => {
      try {
        // Handles hash fragments from Supabase (access_token, refresh_token, type=signup|recovery)
        const { error } = await supabaseClient.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          setMessage("فشل إنشاء الجلسة، ستتم إعادتك...");
          setTimeout(() => router.replace("/membership?auth=failed"), 600);
          return;
        }

        setMessage("تم التأكيد، جاري التحويل...");
        setTimeout(() => router.replace("/membership?auth=ok"), 300);
      } catch (e: any) {
        setMessage(e?.message || "خطأ غير متوقع");
        setTimeout(() => router.replace("/membership?auth=failed"), 800);
      }
    })();
  }, [router]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-[color:var(--glass-border)] bg-[color:var(--glass)] p-8 text-center shadow-[var(--shadow)] backdrop-blur-xl">
      <div className="text-sm text-[color:var(--muted)]">تأكيد البريد</div>
      <h1 className="mt-2 text-2xl font-semibold text-[color:var(--primary-700)]">لحظة من فضلك</h1>
      <p className="mt-3 text-sm text-[color:var(--muted)]">{message}</p>
    </div>
  );
}
