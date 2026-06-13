import { getDueSchedules, getMemberEmail, markReminderSent } from "../../../../../lib/social-engine/schedules";
import { sendPostReminderEmail } from "../../../../../lib/social-engine/email";
import { recordUsage } from "../../../../../lib/social-engine/usage";
import { createServerClient } from "../../../../../lib/supabase/server";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await getDueSchedules(30);
  const results = [];

  for (const row of due) {
    try {
      const member = await getMemberEmail(row.member_id);
      if (!member?.email) continue;

      let timezone = row.timezone || "Asia/Karachi";
      try {
        const db = createServerClient();
        const { data: profile } = await db
          .from("social_engine_member_profiles")
          .select("timezone")
          .eq("member_id", row.member_id)
          .maybeSingle();
        if (profile?.timezone) timezone = profile.timezone;
      } catch {
        /* profile table optional until migration */
      }

      const sent = await sendPostReminderEmail({
        to: member.email,
        postTitle: row.post_title,
        channel: row.channel,
        brief: row.brief,
        ctaLink: row.cta_link,
        scheduledAt: row.scheduled_at,
        timezone,
        plan: member.subscription_plan || "free",
      });

      if (sent.sent) {
        await markReminderSent(row.id);
        await recordUsage({ userEmail: member.email, metric: "remindersSent" });
      }
      results.push({ id: row.id, email: member.email, ...sent });
    } catch (err) {
      results.push({ id: row.id, error: err.message });
    }
  }

  return Response.json({ processed: results.length, results });
}
