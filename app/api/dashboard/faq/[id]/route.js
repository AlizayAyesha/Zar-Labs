import { getAdminDb } from "../../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../../lib/dashboard/auth";

export async function PATCH(request, { params }) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const db = getAdminDb();
  const { data, error } = await db
    .from("faq_items")
    .update({
      question: body.question,
      answer: body.answer,
      sort_order: body.sort_order ?? body.sortOrder,
      is_published: body.is_published ?? body.isPublished,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ faq: data });
}

export async function DELETE(_request, { params }) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { error } = await db.from("faq_items").delete().eq("id", params.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
