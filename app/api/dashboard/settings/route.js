import { getAdminDb } from "../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../lib/dashboard/auth";

export async function GET() {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { data, error } = await db.from("site_settings").select("*").limit(1).maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ settings: data });
}

export async function PATCH(request) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const db = getAdminDb();

  const { data: existing } = await db.from("site_settings").select("id").limit(1).maybeSingle();

  const payload = {
    company_name: body.company_name ?? body.companyName,
    tagline: body.tagline,
    email: body.email,
    phone: body.phone,
    phone_display: body.phone_display ?? body.phoneDisplay,
    location: body.location,
    calendly_url: body.calendly_url ?? body.calendlyUrl,
    instagram_url: body.instagram_url ?? body.instagramUrl,
    twitter_url: body.twitter_url ?? body.twitterUrl,
  };

  const cleaned = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));

  let result;
  if (existing?.id) {
    result = await db.from("site_settings").update(cleaned).eq("id", existing.id).select("*").single();
  } else {
    result = await db.from("site_settings").insert(cleaned).select("*").single();
  }

  if (result.error) {
    return Response.json({ error: result.error.message }, { status: 400 });
  }

  return Response.json({ settings: result.data });
}
