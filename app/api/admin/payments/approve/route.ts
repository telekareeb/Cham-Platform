import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const paymentId = url.searchParams.get("payment_id");
  const membershipId = url.searchParams.get("membership_id");

  if (!paymentId || !membershipId) {
    return NextResponse.json({ ok: false, error: "Missing ids" }, { status: 400 });
  }

  if (!process.env.ADMIN_APPROVAL_TOKEN || token !== process.env.ADMIN_APPROVAL_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { error: payErr } = await supabaseAdmin
    .from("payments")
    .update({ status: "succeeded" })
    .eq("id", paymentId);

  if (payErr) {
    return NextResponse.json(
      { ok: false, error: "Failed to approve payment", details: payErr.message },
      { status: 500 }
    );
  }

  const { error: memErr } = await supabaseAdmin
    .from("memberships")
    .update({ status: "active", started_at: new Date().toISOString() })
    .eq("id", membershipId);

  if (memErr) {
    return NextResponse.json(
      { ok: false, error: "Failed to activate membership", details: memErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, membership_id: membershipId, payment_id: paymentId });
}
