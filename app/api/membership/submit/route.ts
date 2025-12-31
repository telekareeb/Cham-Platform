import { NextResponse } from "next/server";

// Temporarily disabled membership submission to rebuild from scratch.
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "نظام الانتساب متوقف مؤقتاً لإعادة البناء." },
    { status: 503 }
  );
}
