import { getAdminDb, mapCaseStudyInput, mapCaseStudyRow } from "../../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../../lib/dashboard/auth";

export async function GET(_request, { params }) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { data, error } = await db.from("case_studies").select("*").eq("id", params.id).maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ caseStudy: mapCaseStudyRow(data) });
}

export async function PATCH(request, { params }) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const db = getAdminDb();
  const { data, error } = await db
    .from("case_studies")
    .update(mapCaseStudyInput(body))
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ caseStudy: mapCaseStudyRow(data) });
}

export async function DELETE(_request, { params }) {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { error } = await db.from("case_studies").delete().eq("id", params.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
