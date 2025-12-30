"use client";

import { useState } from "react";

type Props = {
  eventId?: string;
  initialStatus?: string | null;
};

export function EventRegisterButton({ eventId, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus || "idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !eventId || loading || status === "registered";

  async function handleRegister() {
    if (!eventId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out?.ok) {
        throw new Error(out?.error || "فشل التسجيل");
      }
      setStatus(out?.status || "registered");
    } catch (e: any) {
      setError(e?.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1 text-left">
      <button
        type="button"
        onClick={handleRegister}
        disabled={disabled}
        className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
          disabled
            ? "cursor-not-allowed bg-[color:var(--glass)] text-[color:var(--muted)]"
            : "bg-[color:var(--accent-600)] text-white shadow-[var(--shadow)] hover:opacity-90"
        }`}
      >
        {status === "registered" ? "تم التسجيل" : loading ? "جارٍ التسجيل..." : "سجّلني"}
      </button>
      {error ? <div className="text-[11px] text-red-600">{error}</div> : null}
    </div>
  );
}
