import { createServerClient } from "../supabase/server";

export async function listSchedulesForMember(memberId) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_post_schedules")
    .select("*")
    .eq("member_id", memberId)
    .order("scheduled_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createSchedule({ memberId, channel, postTitle, brief, ctaLink, scheduledAt, timezone }) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_post_schedules")
    .insert({
      member_id: memberId,
      channel: channel || "LinkedIn",
      post_title: postTitle,
      brief: brief || "",
      cta_link: ctaLink || "",
      scheduled_at: scheduledAt,
      timezone: timezone || "Asia/Karachi",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getDueSchedules(withinMinutes = 30) {
  const db = createServerClient();
  const now = new Date();
  const end = new Date(now.getTime() + withinMinutes * 60 * 1000);

  const { data, error } = await db
    .from("social_engine_post_schedules")
    .select("*")
    .eq("status", "scheduled")
    .is("reminder_sent_at", null)
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", end.toISOString());
  if (error) throw error;
  return data || [];
}

export async function getMemberEmail(memberId) {
  const db = createServerClient();
  const { data } = await db.from("social_engine_members").select("email, subscription_plan").eq("id", memberId).maybeSingle();
  return data;
}

export async function markReminderSent(scheduleId) {
  const db = createServerClient();
  await db
    .from("social_engine_post_schedules")
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq("id", scheduleId);
}
