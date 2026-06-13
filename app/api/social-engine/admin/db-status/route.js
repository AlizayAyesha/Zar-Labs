import { requireDashboardAdmin } from "../../../../../lib/dashboard/access";
import { createServerClient } from "../../../../../lib/supabase/server";

const REQUIRED_TABLES = [
  "social_engine_members",
  "social_engine_member_profiles",
  "social_engine_chat_sessions",
  "social_engine_generated_images",
  "social_engine_member_calendars",
  "social_engine_usage_monthly",
  "social_engine_style_catalog",
  "social_engine_catalog_generations",
];

export async function GET() {
  try {
    await requireDashboardAdmin();
  } catch {
    return Response.json({ error: "Admin only" }, { status: 403 });
  }

  const db = createServerClient();
  const status = {};

  for (const table of REQUIRED_TABLES) {
    const { error } = await db.from(table).select("*").limit(0);
    status[table] = error ? { ok: false, code: error.code, message: error.message } : { ok: true };
  }

  const allOk = Object.values(status).every((s) => s.ok);
  return Response.json({
    ready: allOk,
    tables: status,
    applyScript: "/supabase/scripts/APPLY_SOCIAL_ENGINE_SAAS.sql",
    hint: allOk
      ? "Database ready for Social Engine."
      : "Run supabase/scripts/APPLY_SOCIAL_ENGINE_SAAS.sql in Supabase SQL Editor (project aaptopqqtxhbujbxgtzy).",
  });
}
