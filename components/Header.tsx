/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "من نحن" },
  { href: "/mission", label: "مهمتنا" },
  { href: "/vision", label: "رؤيتنا" },
  { href: "/news", label: "الأخبار" },
  { href: "/events", label: "الفعاليات" },
  { href: "/membership", label: "الانتساب" },
  { href: "/dashboard", label: "حسابي" },
  { href: "/donate", label: "تبرع" },
  { href: "/contact", label: "التواصل" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname() || "/";

  // Avoid hydration mismatch: default to "/" then update after mount
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const effectivePath = ready ? pathname : "/";
  const isFr = ready ? effectivePath.startsWith("/fr") : false;
  const localePrefix = isFr ? "/fr" : "";

  const withLocale = (href: string) => {
    if (href === "/") return localePrefix || "/";
    return `${localePrefix}${href}`;
  };

  const handleLocaleChange = (value: string) => {
    if (!ready) return;
    if (value === "fr" && !isFr) {
      router.push(`/fr${effectivePath === "/" ? "" : effectivePath}`);
    } else if (value === "ar" && isFr) {
      const next = effectivePath.replace(/^\/fr/, "") || "/";
      router.push(next || "/");
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* top blur bar */}
      <div className="border-b border-[color:var(--glass-border)] bg-[color:var(--glass)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            {/* ضع الشعار هنا */}
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-[color:var(--glass-border)] bg-white/60">
              {/* إذا عندك شعار في public/brand/cham-logo.png غيّر السطر تحت */}
              <img
                src="/media/cham-logo.png"
                alt="CHAM"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-[color:var(--primary-700)]">
                CHAM
              </div>
              <div className="text-xs text-[color:var(--muted)]">
                Culturelle • Humanitaire • Amitié • Mutuelle
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-5 md:flex">
            {nav.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                className="text-sm text-[color:var(--muted)] hover:text-[color:var(--text)] transition"
              >
                {item.label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="h-5 w-px bg-[color:var(--glass-border)]" />
            <select
              className="rounded-lg border border-[color:var(--glass-border)] bg-white/70 px-3 py-1 text-sm text-[color:var(--muted)]"
              value={isFr ? "fr" : "ar"}
              onChange={(e) => handleLocaleChange(e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>

            {/* CTA Buttons */}
            <div className="ml-2 flex items-center gap-2">
              <Link
                href={withLocale("/dashboard")}
                className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-4 py-2 text-sm text-[color:var(--primary-700)] hover:bg-white/80 transition"
              >
                حسابي
              </Link>
              <Link
                href={withLocale("/donate")}
                className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-4 py-2 text-sm text-[color:var(--primary-700)] hover:bg-white/80 transition"
              >
                تبرع
              </Link>
              <Link
                href={withLocale("/membership")}
                className="rounded-xl bg-[color:var(--accent-600)] px-4 py-2 text-sm text-white shadow-[var(--shadow)] hover:opacity-95 transition"
              >
                انتسب الآن
              </Link>
            </div>
          </nav>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={withLocale("/membership")}
              className="rounded-xl bg-[color:var(--accent-600)] px-3 py-2 text-sm text-white shadow-[var(--shadow)]"
            >
              انتسب
            </Link>
            <Link
              href={withLocale("/donate")}
              className="rounded-xl border border-[color:var(--glass-border)] bg-white/60 px-3 py-2 text-sm text-[color:var(--primary-700)]"
            >
              تبرع
            </Link>
          </div>
        </div>

        {/* Secondary nav row (mobile scroll) */}
        <div className="md:hidden">
          <div className="mx-auto max-w-6xl px-2 pb-2">
            <div className="flex gap-2 overflow-x-auto px-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={withLocale(item.href)}
                  className="whitespace-nowrap rounded-full border border-[color:var(--glass-border)] bg-white/55 px-3 py-1.5 text-xs text-[color:var(--muted)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
