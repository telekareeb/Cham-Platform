// Minimal mail sender.
// If MAIL_WEBHOOK_URL is set, POSTs to it; otherwise logs to console for dev.

type MailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail(opts: MailOptions) {
  const webhook = process.env.MAIL_WEBHOOK_URL;
  if (!webhook) {
    console.log("[mailer] MAIL_WEBHOOK_URL not set. Skipping send.", opts);
    return { ok: false, skipped: true };
  }

  const payload = {
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    text: opts.text,
    html: opts.html || opts.text,
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Mail webhook failed: ${res.status} ${body}`);
  }

  return { ok: true };
}
