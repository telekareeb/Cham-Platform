import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-[color:var(--glass-border)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-[color:var(--glass-border)] bg-white/60">
                <img
                  src="/brand/cham-logo.png"
                  alt="CHAM"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-[color:var(--primary-700)]">
                  CHAM
                </div>
                <div className="text-xs text-[color:var(--muted)]">
                  Culturelle • Humanitaire • Amitié • Mutuelle
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm text-[color:var(--muted)]">
              منصة جمعية شام لتنظيم العضويات، الفعاليات، الأخبار، والتبرعات بطريقة
              بسيطة وشفافة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
            <div className="space-y-2">
              <div className="font-semibold text-[color:var(--text)]">الجمعية</div>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/about">من نحن</Link>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/mission">مهمتنا</Link>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/vision">رؤيتنا</Link>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-[color:var(--text)]">المحتوى</div>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/news">الأخبار</Link>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/events">الفعاليات</Link>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-[color:var(--text)]">الدعم</div>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/membership">الانتساب</Link>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/donate">تبرع</Link>
              <Link className="block text-[color:var(--muted)] hover:text-[color:var(--text)]" href="/contact">التواصل</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-[color:var(--muted)]">
          © {new Date().getFullYear()} CHAM — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}