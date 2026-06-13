import { getAdminDb } from "../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../lib/dashboard/auth";

export async function GET() {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("id, email, status, source, metadata, created_at, unsubscribed_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ subscribers: data || [] });
}
