import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }
    if (!url || !anonKey) {
      return NextResponse.json({ ok: false, error: "Missing Supabase env vars" }, { status: 500 });
    }

    const lowerEmail = email.trim().toLowerCase();
    const redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : "http://localhost:3000/auth/callback";

    // استعمل service_role إذا متوفر، وإلا fallback إلى anon
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(lowerEmail, {
        redirectTo,
      });
      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, mode: "admin_invite" });
    }

    const supabase = createClient(url, anonKey);
    const { error } = await supabase.auth.signInWithOtp({
      email: lowerEmail,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "anon_magiclink" });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Unexpected error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
