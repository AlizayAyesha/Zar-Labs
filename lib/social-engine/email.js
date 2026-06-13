const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Social Engine <onboarding@resend.dev>";

export async function sendPostReminderEmail({ to, postTitle, channel, brief, ctaLink, scheduledAt, timezone, plan }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[social-engine] RESEND_API_KEY missing — reminder skipped for", to);
    return { skipped: true, reason: "RESEND_API_KEY not configured" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zar-labs.vercel.app";
  const timeLabel = new Date(scheduledAt).toLocaleString("en-US", {
    timeZone: timezone || "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const proNote =
    plan === "pro" || plan === "enterprise"
      ? `<p><strong>Pro tip:</strong> Open Strategy Chat for a fresh draft before you post.</p>`
      : "";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#111">
      <h2 style="color:#22c55e">Time to post on ${channel}</h2>
      <p>Hi — your scheduled post is due <strong>${timeLabel}</strong> (${timezone}).</p>
      <p><strong>${postTitle}</strong></p>
      ${brief ? `<p style="color:#444">${brief.slice(0, 500)}</p>` : ""}
      ${ctaLink ? `<p>CTA: <a href="${ctaLink}">${ctaLink}</a></p>` : ""}
      ${proNote}
      <p>
        <a href="${siteUrl}/dashboard/site-system/social-engine/strategy-chat" style="display:inline-block;background:#22c55e;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open Strategy Chat</a>
        &nbsp;
        <a href="${siteUrl}/dashboard/site-system/social-engine/image-studio" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Image Studio</a>
      </p>
      <p style="color:#888;font-size:12px">Zar Labs Social Engine</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject: `[${channel}] Time to post — ${postTitle.slice(0, 60)}`,
      html,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Resend HTTP ${res.status}`);
  }
  return { id: json.id, sent: true };
}
