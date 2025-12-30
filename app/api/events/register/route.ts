import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json().catch(() => ({}));
    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ ok: false, error: "Missing eventId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          },
        },
      }
    );

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("event_registrations")
      .upsert(
        { user_id: user.id, event_id: eventId, status: "registered" },
        { onConflict: "user_id,event_id" }
      )
      .select("event_id,status")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      status: data?.status ?? "registered",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Unexpected error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
