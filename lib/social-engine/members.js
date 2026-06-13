import { createServerClient } from "../supabase/server";
import { isAdminEmail } from "../dashboard/auth";

function getSocialEngineAllowedEmails() {
  return (process.env.SOCIAL_ENGINE_ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isSocialEngineMemberInDb(email) {
  if (!email) return false;
  if (isAdminEmail(email)) return true;

  const allowed = getSocialEngineAllowedEmails();
  if (allowed.includes(email.toLowerCase())) return true;

  try {
    const db = createServerClient();
    const { data } = await db
      .from("social_engine_members")
      .select("id")
      .eq("email", email.toLowerCase())
      .eq("status", "active")
      .maybeSingle();
    return Boolean(data);
  } catch {
    return allowed.includes(email.toLowerCase());
  }
}

export async function listSocialEngineMembers() {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_members")
    .select("id, email, role, status, tenant_id, subscription_plan, token_budget_monthly, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateMemberPlan(email, subscriptionPlan) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_members")
    .update({ subscription_plan: subscriptionPlan })
    .eq("email", email.toLowerCase().trim())
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertSocialEngineMember({ email, role, subscriptionPlan = "free" }) {
  const db = createServerClient();
  const payload = {
    email: email.toLowerCase().trim(),
    status: "active",
    tenant_id: "zar-labs",
    subscription_plan: subscriptionPlan,
  };
  if (role) payload.role = role;

  const { data: existing } = await db
    .from("social_engine_members")
    .select("id, role")
    .eq("email", payload.email)
    .maybeSingle();

  if (!existing) {
    payload.role = role || "editor";
  } else if (role) {
    payload.role = role;
  }

  const { data, error } = await db
    .from("social_engine_members")
    .upsert(payload, { onConflict: "email" })
    .select()
    .single();
  if (error) throw error;

  const { data: existingProfile } = await db
    .from("social_engine_member_profiles")
    .select("id")
    .eq("member_id", data.id)
    .maybeSingle();

  if (!existingProfile) {
    await db.from("social_engine_member_profiles").insert({
      member_id: data.id,
      integrations: { google_calendar: { status: "not_connected", calendar_id: "", connected_at: null } },
    });
  }

  return data;
}

export async function removeSocialEngineMember(email) {
  const db = createServerClient();
  const { error } = await db.from("social_engine_members").delete().eq("email", email.toLowerCase());
  if (error) throw error;
}
