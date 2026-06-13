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
    .from("site_videos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ videos: data || [] });
}

export async function PATCH(request) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const body = await request.json();
  if (!body.id) {
    return Response.json({ error: "Missing video id" }, { status: 400 });
  }

  const db = getAdminDb();
  const { data, error } = await db
    .from("site_videos")
    .update({
      title: body.title,
      is_published: body.is_published ?? body.isPublished,
      sort_order: body.sort_order ?? body.sortOrder,
    })
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ video: data });
}
