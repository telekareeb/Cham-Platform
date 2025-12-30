import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/mailer";

type PaymentMethod = "stripe_card" | "apple_pay" | "manual" | "waiver";

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function sanitizeText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

function sanitizeEmail(v: unknown): string | null {
  const s = sanitizeText(v);
  if (!s) return null;
  if (!s.includes("@") || s.length < 5) return null;
  return s.toLowerCase();
}

function sanitizeMethod(v: unknown): PaymentMethod | null {
  const s = sanitizeText(v) as PaymentMethod | null;
  if (!s) return null;
  const allowed: PaymentMethod[] = ["stripe_card", "apple_pay", "manual", "waiver"];
  return allowed.includes(s) ? s : null;
}

function hasLatin(s: string) {
  return /[A-Za-z]/.test(s);
}
function hasArabic(s: string) {
  return /[\u0600-\u06FF]/.test(s);
}

function parseDobISO(v: unknown): string | null {
  const s = sanitizeText(v);
  if (!s) return null;
  // expecting YYYY-MM-DD
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return s;
}

function ageInYears(dobIso: string) {
  const dob = new Date(dobIso);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export async function POST(req: Request) {
  try {
    // 1) auth user from cookies
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    // 2) Accept multipart OR JSON
    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const isJson = contentType.includes("application/json");

    if (!isMultipart && !isJson) {
      return badRequest('Content-Type must be "multipart/form-data" or "application/json"');
    }

    let source: { get: (key: string) => unknown };
    let receiptFile: File | null = null;

    if (isMultipart) {
      const form = await req.formData();
      source = { get: (key: string) => form.get(key) };
      const maybeFile = form.get("receipt");
      if (maybeFile instanceof File && maybeFile.size > 0) {
        receiptFile = maybeFile;
      }
    } else {
      const body = (await req.json()) as Record<string, unknown>;
      source = { get: (key: string) => body[key] };
    }

    const gender = sanitizeText(source.get("gender"));
    if (!gender || !["mr", "mrs"].includes(gender)) return badRequest("Invalid gender");

    // ✅ NEW: latin required + arabic optional
    const first_name_latin = sanitizeText(source.get("first_name_latin"));
    const last_name_latin = sanitizeText(source.get("last_name_latin"));
    const first_name_ar = sanitizeText(source.get("first_name_ar")); // optional
    const last_name_ar = sanitizeText(source.get("last_name_ar"));   // optional

    if (!first_name_latin) return badRequest("Missing first_name_latin");
    if (!last_name_latin) return badRequest("Missing last_name_latin");
    if (!hasLatin(first_name_latin)) return badRequest("first_name_latin must contain A-Z");
    if (!hasLatin(last_name_latin)) return badRequest("last_name_latin must contain A-Z");

    if (first_name_ar && !hasArabic(first_name_ar)) return badRequest("first_name_ar must contain Arabic letters");
    if (last_name_ar && !hasArabic(last_name_ar)) return badRequest("last_name_ar must contain Arabic letters");

    // ✅ DOB + 16+
    const dobIso = parseDobISO(source.get("date_of_birth"));
    if (!dobIso) return badRequest("Missing/invalid date_of_birth");
    if (ageInYears(dobIso) < 16) return badRequest("Must be 16+ to register");

    const email = sanitizeEmail(source.get("email"));
    if (!email) return badRequest("Missing/invalid email");

    const phone_country = sanitizeText(source.get("phone_country"));
    const phone_number = sanitizeText(source.get("phone_number"));
    if (!phone_number) return badRequest("Missing phone_number");

    const street = sanitizeText(source.get("street"));
    const postal_code = sanitizeText(source.get("postal_code"));
    const city = sanitizeText(source.get("city"));
    const country = sanitizeText(source.get("country"));
    if (!street || !postal_code || !city || !country) return badRequest("Missing address fields");

    const method = sanitizeMethod(source.get("payment_method"));
    if (!method) return badRequest("Missing/invalid payment_method");

    const hasReceipt = receiptFile instanceof File && receiptFile.size > 0;
    if (method === "manual" && !hasReceipt) {
      return badRequest("Manual payment requires receipt file (multipart/form-data)");
    }

    const currency = (sanitizeText(source.get("currency")) || "EUR").toUpperCase();
    const amount_cents = Number(sanitizeText(source.get("amount_cents")) || "0") || null;

    // ✅ Back-compat: fill old columns from latin
    const full_name = first_name_latin;
    const family_name = last_name_latin;

    // 3) Prevent duplicates (email or name+dob)
    const { data: emailDup, error: emailDupErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .neq("id", userId)
      .maybeSingle();

    if (emailDupErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to validate email uniqueness", details: emailDupErr.message },
        { status: 500 }
      );
    }
    if (emailDup) {
      return NextResponse.json(
        { ok: false, error: "هذا البريد مستخدم مسبقاً. يرجى استخدام بريد آخر أو تسجيل الدخول." },
        { status: 400 }
      );
    }

    const { data: identityDup, error: identityDupErr } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("first_name_latin", first_name_latin)
      .eq("last_name_latin", last_name_latin)
      .eq("date_of_birth", dobIso)
      .neq("id", userId)
      .maybeSingle();

    if (identityDupErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to validate identity uniqueness", details: identityDupErr.message },
        { status: 500 }
      );
    }
    if (identityDup) {
      return NextResponse.json(
        { ok: false, error: "هناك طلب مسجّل بنفس الاسم وتاريخ الميلاد. يرجى تسجيل الدخول أو التواصل مع الإدارة." },
        { status: 400 }
      );
    }

    // 4) Upsert profile
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          gender,

          // old columns (keep)
          full_name,
          family_name,
          email,
          phone_country,
          phone_number,
          street,
          postal_code,
          city,
          country,

          // new columns
          first_name_latin,
          last_name_latin,
          first_name_ar: first_name_ar || null,
          last_name_ar: last_name_ar || null,
          date_of_birth: dobIso,
        },
        { onConflict: "id" }
      );

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to upsert profile", details: profileErr.message },
        { status: 500 }
      );
    }

    // 5) Create or read membership (uniq per user)
    const { data: existingMembership, error: memSelectErr } = await supabaseAdmin
      .from("memberships")
      .select("id,status")
      .eq("user_id", userId)
      .maybeSingle();

    if (memSelectErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to read membership", details: memSelectErr.message },
        { status: 500 }
      );
    }

    let membershipId = existingMembership?.id as string | undefined;

    if (!membershipId) {
      const { data: memIns, error: memInsErr } = await supabaseAdmin
        .from("memberships")
        .insert({ user_id: userId, status: "pending" })
        .select("id")
        .single();

      if (memInsErr) {
        return NextResponse.json(
          { ok: false, error: "Failed to create membership", details: memInsErr.message },
          { status: 500 }
        );
      }
      membershipId = memIns.id;
    }

    // 6) Create payment row
    const { data: payIns, error: payInsErr } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userId,
        membership_id: membershipId,
        amount_cents,
        currency,
        method,
        status: method === "waiver" ? "succeeded" : "pending",
      })
      .select("id")
      .single();

    if (payInsErr) {
      return NextResponse.json(
        { ok: false, error: "Failed to create payment", details: payInsErr.message },
        { status: 500 }
      );
    }

    const paymentId = payIns.id as string;

    // 7) Upload receipt if manual
    let receiptPath: string | null = null;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const treasurerEmail = process.env.TREASURER_EMAIL || "dr.nlnasri@gmail.com";

    if (method === "manual" && hasReceipt) {
      const { data: buckets, error: bucketsErr } = await supabaseAdmin.storage.listBuckets();
      if (bucketsErr || !buckets?.some((b) => b.name === "receipts")) {
        return NextResponse.json(
          { ok: false, error: "Storage bucket 'receipts' not found. Please create it in Supabase." },
          { status: 500 }
        );
      }

      const file = receiptFile as File;
      const ext =
        (file.name.split(".").pop() || "bin")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "bin";

      receiptPath = `${userId}/${paymentId}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadErr } = await supabaseAdmin.storage
        .from("receipts")
        .upload(receiptPath, arrayBuffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadErr) {
        return NextResponse.json(
          { ok: false, error: "Receipt upload failed", details: uploadErr.message },
          { status: 500 }
        );
      }

      const { error: updErr } = await supabaseAdmin
        .from("payments")
        .update({ receipt_url: receiptPath })
        .eq("id", paymentId);

      if (updErr) {
        return NextResponse.json(
          { ok: false, error: "Failed to save receipt path", details: updErr.message },
          { status: 500 }
        );
      }

      const receiptPublicUrl =
        receiptPath && supabaseAdmin.storage.from("receipts").getPublicUrl(receiptPath).data.publicUrl;

      // Notify treasurer for manual payment approval
      const approveUrl = `${siteUrl}/api/admin/payments/approve?payment_id=${paymentId}&membership_id=${membershipId}&token=${process.env.ADMIN_APPROVAL_TOKEN || "REPLACE_TOKEN"}`;
      try {
        await sendMail({
          to: treasurerEmail,
          subject: "مراجعة إيصال الدفع اليدوي لعضوية CHAM",
          text: [
            `وصل إيصال جديد من العضو: ${email}`,
            `الاسم: ${first_name_latin} ${last_name_latin}`,
            first_name_ar ? `الاسم العربي: ${first_name_ar} ${last_name_ar || ""}` : "",
            `تاريخ الميلاد: ${dobIso}`,
            `المبلغ: ${amount_cents ? amount_cents / 100 : 0} ${currency}`,
            receiptPublicUrl ? `رابط الإيصال: ${receiptPublicUrl}` : "لا يوجد رابط مرفق",
            `رابط القبول السريع: ${approveUrl}`,
          ]
            .filter(Boolean)
            .join("\n"),
          html: `
            <p>وصل إيصال دفع يدوي جديد.</p>
            <ul>
              <li>العضو: ${email}</li>
              <li>الاسم: ${first_name_latin} ${last_name_latin}</li>
              ${first_name_ar ? `<li>الاسم العربي: ${first_name_ar} ${last_name_ar || ""}</li>` : ""}
              <li>تاريخ الميلاد: ${dobIso}</li>
              <li>المبلغ: ${amount_cents ? amount_cents / 100 : 0} ${currency}</li>
              ${receiptPublicUrl ? `<li><a href="${receiptPublicUrl}">عرض الإيصال</a></li>` : "<li>لا يوجد رابط مرفق</li>"}
              <li><a href="${approveUrl}">قبول الاشتراك وتفعيل العضوية</a></li>
            </ul>
          `,
        });
      } catch (mailErr: any) {
        console.error("sendMail manual receipt failed", mailErr?.message || mailErr);
      }
    }

    // 8) If waiver => activate immediately
    if (method === "waiver") {
      await supabaseAdmin
        .from("memberships")
        .update({ status: "active", started_at: new Date().toISOString() })
        .eq("id", membershipId);

      try {
        await sendMail({
          to: treasurerEmail,
          subject: "طلب عضوية حالة خاصة - CHAM",
          text: [
            `طلب حالة خاصة من: ${email}`,
            `الاسم: ${first_name_latin} ${last_name_latin}`,
            first_name_ar ? `الاسم العربي: ${first_name_ar} ${last_name_ar || ""}` : "",
            `تاريخ الميلاد: ${dobIso}`,
            `رابط العضو: ${siteUrl}/dashboard`,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch (mailErr: any) {
        console.error("sendMail waiver failed", mailErr?.message || mailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      membership_id: membershipId,
      payment_id: paymentId,
      receipt_path: receiptPath,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Unexpected error", details: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
