import { cmsJsonResponse, parseCmsView } from "../../../lib/cms/draft-publish";
import { getMemberCalendar, saveMemberCalendar } from "../../../lib/social-engine/member-calendar";
import { getOrCreateMemberProfile } from "../../../lib/social-engine/profile";
import { requireSocialEngineAccess } from "../../../lib/dashboard/access";

async function resolveCalendarContext(user) {
  const ctx = await getOrCreateMemberProfile({
    email: user.email,
    authUserId: user.id,
    isAdmin: user.isAdmin,
  });
  return {
    ownerEmail: user.email.toLowerCase(),
    memberId: ctx?.member?.id || null,
    migrateFromCms: user.isAdmin,
  };
}

export async function GET(request) {
  let user;
  try {
    user = await requireSocialEngineAccess();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  parseCmsView(new URL(request.url).searchParams);
  const { ownerEmail, memberId, migrateFromCms } = await resolveCalendarContext(user);
  const data = await getMemberCalendar(ownerEmail, { memberId, migrateFromCms });

  return cmsJsonResponse({
    success: true,
    data,
    ownerEmail,
    view: "draft",
  });
}

export async function PUT(request) {
  let user;
  try {
    user = await requireSocialEngineAccess();
  } catch {
    return cmsJsonResponse({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { intent: _intent, ...payload } = body;
    const { ownerEmail, memberId } = await resolveCalendarContext(user);
    const data = await saveMemberCalendar(ownerEmail, memberId, payload);
    return cmsJsonResponse({ success: true, data, ownerEmail });
  } catch (err) {
    return cmsJsonResponse({ error: err.message }, { status: 400 });
  }
}

export async function POST(request) {
  return PUT(request);
}
