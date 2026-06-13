import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import { resolveEngineContext } from "../../../../lib/social-engine/context";
import { createSchedule, listSchedulesForMember } from "../../../../lib/social-engine/schedules";

export async function GET() {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    if (!engine.member) return Response.json({ schedules: [] });
    const schedules = await listSchedulesForMember(engine.member.id);
    return Response.json({ schedules });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    if (!engine.member) return Response.json({ error: "Member required" }, { status: 403 });

    const body = await request.json();
    const { channel, postTitle, brief, ctaLink, scheduledAt } = body;
    if (!postTitle || !scheduledAt) {
      return Response.json({ error: "postTitle and scheduledAt required" }, { status: 400 });
    }

    const schedule = await createSchedule({
      memberId: engine.member.id,
      channel,
      postTitle,
      brief,
      ctaLink,
      scheduledAt,
      timezone: engine.profile?.timezone || "Asia/Karachi",
    });

    return Response.json({ success: true, schedule });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
