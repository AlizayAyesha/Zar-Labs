import { SOURCE_LABEL } from "../../../../../constants/booking/interaction-sources";
import { requireDashboardUser, unauthorizedResponse } from "../../../../../lib/dashboard/auth";
import { createServerClient } from "../../../../../lib/supabase/server";

export async function GET() {
  const user = await requireDashboardUser();
  if (!user) return unauthorizedResponse();

  try {
    const db = createServerClient();
    const { data: submissions, error } = await db
      .from("form_submissions")
      .select("id, source, subject, email, full_name, payload, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const { data: subscribers } = await db
      .from("newsletter_subscribers")
      .select("id, email, status, source, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    return Response.json({
      submissions: (submissions || []).map((row) => ({
        ...row,
        sourceLabel: SOURCE_LABEL[row.source] || row.source,
        portalSlug: row.metadata?.portal_slug || row.payload?.portal_slug || "",
      })),
      subscribers: subscribers || [],
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
