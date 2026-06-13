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
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ faqs: data || [] });
}

export async function POST(request) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const db = getAdminDb();
  const { data, error } = await db
    .from("faq_items")
    .insert({
      question: body.question,
      answer: body.answer,
      sort_order: body.sort_order ?? body.sortOrder ?? 0,
      is_published: body.is_published ?? body.isPublished ?? true,
    })
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ faq: data }, { status: 201 });
}
