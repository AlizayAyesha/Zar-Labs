import { createServerClient } from "../supabase/server";
import { getCmsCollection } from "../cms/cms-store";
import { buildDefaultCalendarData } from "../publishing-calendar/calendar-store";

function normalizeCalendarData(stored) {
  if (!stored) return buildDefaultCalendarData();
  return { ...buildDefaultCalendarData(), ...stored };
}

export async function getMemberCalendar(ownerEmail, { memberId, migrateFromCms = false } = {}) {
  const email = ownerEmail?.toLowerCase();
  if (!email) return buildDefaultCalendarData();

  try {
    const db = createServerClient();
    const { data: row } = await db
      .from("social_engine_member_calendars")
      .select("data, updated_at")
      .eq("owner_email", email)
      .maybeSingle();

    if (row?.data?.tasks) {
      return normalizeCalendarData({ ...row.data, updatedAt: row.updated_at || row.data.updatedAt });
    }

    if (migrateFromCms) {
      const cms = await getCmsCollection("publishing-calendar", "draft");
      if (cms?.tasks?.length) {
        const payload = normalizeCalendarData(cms);
        await saveMemberCalendar(email, memberId, payload);
        return payload;
      }
    }
  } catch {
    /* table may not exist until migration */
  }

  return buildDefaultCalendarData();
}

export async function saveMemberCalendar(ownerEmail, memberId, data) {
  const email = ownerEmail?.toLowerCase();
  if (!email) throw new Error("owner email required");

  const payload = { ...data, updatedAt: new Date().toISOString() };
  const db = createServerClient();
  const { error } = await db.from("social_engine_member_calendars").upsert(
    {
      owner_email: email,
      member_id: memberId || null,
      data: payload,
      updated_at: payload.updatedAt,
    },
    { onConflict: "owner_email" }
  );
  if (error) throw error;
  return payload;
}
