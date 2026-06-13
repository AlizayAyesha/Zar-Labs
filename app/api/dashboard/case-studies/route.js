import { getAdminDb, mapCaseStudyInput, mapCaseStudyRow } from "../../../../lib/dashboard/db";
import { requireDashboardUser, unauthorizedResponse } from "../../../../lib/dashboard/auth";

export async function GET() {
  try {
    await requireDashboardUser();
  } catch {
    return unauthorizedResponse();
  }

  const db = getAdminDb();
  const { data, error } = await db
    .from("case_studies")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ caseStudies: (data || []).map(mapCaseStudyRow) });
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
    .from("case_studies")
    .insert(mapCaseStudyInput(body))
    .select("*")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ caseStudy: mapCaseStudyRow(data) }, { status: 201 });
}
