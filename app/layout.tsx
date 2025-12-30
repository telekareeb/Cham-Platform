import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "جمعية شام | CHAM",
  description: "منصة جمعية شام للانتساب، التبرعات، الأخبار والفعاليات.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} min-h-screen font-sans`}>
        <Header />

        {/* background subtle */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="mx-auto mt-[-120px] h-[320px] max-w-6xl rounded-[40px] bg-[color:var(--primary-500)] blur-[120px]" />
          </div>

          <main className="relative mx-auto max-w-6xl px-4 py-10">
            {children}
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}
