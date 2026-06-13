import { createServerClient } from "../supabase/server";
import { isSocialEngineMemberEmail } from "../dashboard/access";

const BYOK_FIELDS = ["openrouter", "gemini", "groq", "deepseek", "mistral", "cohere", "openai", "fal"];
const DEFAULT_INTEGRATIONS = {
  google_calendar: { status: "not_connected", calendar_id: "", connected_at: null },
};

export function maskSecret(value) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function getOnboardingRequirements(profile, member) {
  const calendar = profile?.integrations?.google_calendar || DEFAULT_INTEGRATIONS.google_calendar;
  return [
    { id: "account", label: "Account active", done: member?.status === "active", required: true },
    {
      id: "profile",
      label: "Display name and timezone",
      done: Boolean(profile?.display_name?.trim() && profile?.timezone),
      required: true,
    },
    {
      id: "niche",
      label: "Business niche and channels",
      done: Boolean(profile?.business_niche?.trim() && profile?.primary_channels?.length),
      required: true,
    },
    {
      id: "subscription",
      label: `Plan: ${member?.subscription_plan || "free"}`,
      done: member?.subscription_plan !== "disabled",
      required: true,
    },
    {
      id: "calendar",
      label: "Google Calendar (optional)",
      done: calendar.status === "connected",
      required: false,
    },
  ];
}

function isOnboardingComplete(profile, member) {
  return getOnboardingRequirements(profile, member)
    .filter((r) => r.required)
    .every((r) => r.done);
}

async function getMemberByEmail(email) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_members")
    .select("id, email, role, status, tenant_id, subscription_plan, token_budget_monthly, created_at")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getProfileByMemberId(memberId) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_member_profiles")
    .select("*")
    .eq("member_id", memberId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function createProfile(memberId, authUserId) {
  const db = createServerClient();
  const { data, error } = await db
    .from("social_engine_member_profiles")
    .insert({
      member_id: memberId,
      auth_user_id: authUserId || null,
      integrations: DEFAULT_INTEGRATIONS,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrCreateMemberProfile({ email, authUserId, isAdmin = false }) {
  if (isAdmin) {
    return {
      member: {
        email,
        role: "owner",
        status: "active",
        subscription_plan: "enterprise",
        tenant_id: "zar-labs",
      },
      profile: {
        display_name: email.split("@")[0],
        timezone: "Asia/Karachi",
        business_niche: "Zar Labs",
        primary_channels: ["LinkedIn", "Instagram"],
        growth_goal: "authority and leads",
        integrations: DEFAULT_INTEGRATIONS,
        byok_keys: {},
        onboarding_completed_at: new Date().toISOString(),
      },
      isAdmin: true,
    };
  }

  let member = await getMemberByEmail(email);
  if (!member && isSocialEngineMemberEmail(email)) {
    const { upsertSocialEngineMember } = await import("./members");
    member = await upsertSocialEngineMember({ email, subscriptionPlan: "free" });
  }
  if (!member) return null;

  let profile = await getProfileByMemberId(member.id);
  if (!profile) {
    profile = await createProfile(member.id, authUserId);
  } else if (authUserId && !profile.auth_user_id) {
    const db = createServerClient();
    const { data } = await db
      .from("social_engine_member_profiles")
      .update({ auth_user_id: authUserId, updated_at: new Date().toISOString() })
      .eq("member_id", member.id)
      .select()
      .single();
    profile = data || profile;
  }

  return { member, profile, isAdmin: false };
}

export async function updateMemberProfile(email, patch) {
  const ctx = await getOrCreateMemberProfile({ email, isAdmin: false });
  if (!ctx?.member) return null;

  const db = createServerClient();
  const updates = { updated_at: new Date().toISOString() };

  if (patch.display_name !== undefined) updates.display_name = patch.display_name.trim();
  if (patch.timezone !== undefined) updates.timezone = patch.timezone;
  if (patch.business_niche !== undefined) updates.business_niche = patch.business_niche.trim();
  if (patch.primary_channels !== undefined) updates.primary_channels = patch.primary_channels;
  if (patch.growth_goal !== undefined) updates.growth_goal = patch.growth_goal.trim();
  if (patch.preferences !== undefined) updates.preferences = patch.preferences;

  if (patch.integrations !== undefined) {
    updates.integrations = { ...(ctx.profile.integrations || {}), ...patch.integrations };
  }

  if (patch.byok_keys !== undefined) {
    const merged = { ...(ctx.profile.byok_keys || {}) };
    for (const field of BYOK_FIELDS) {
      if (patch.byok_keys[field] === "") delete merged[field];
      else if (patch.byok_keys[field]) merged[field] = patch.byok_keys[field].trim();
    }
    updates.byok_keys = merged;
  }

  const mergedProfile = { ...ctx.profile, ...updates };
  if (patch.markOnboardingComplete || isOnboardingComplete(mergedProfile, ctx.member)) {
    updates.onboarding_completed_at = new Date().toISOString();
  }

  const { data, error } = await db
    .from("social_engine_member_profiles")
    .update(updates)
    .eq("member_id", ctx.member.id)
    .select()
    .single();
  if (error) throw error;
  return { member: ctx.member, profile: data };
}

export async function getUserByokKeys(email, isAdmin = false) {
  if (isAdmin) return {};
  const ctx = await getOrCreateMemberProfile({ email, isAdmin: false });
  return ctx?.profile?.byok_keys || {};
}

export function serializeProfileForClient({ member, profile, isAdmin }) {
  const byok = profile?.byok_keys || {};
  const maskedByok = Object.fromEntries(BYOK_FIELDS.map((k) => [k, byok[k] ? maskSecret(byok[k]) : ""]));
  const requirements = getOnboardingRequirements(profile, member);
  const onboardingComplete = Boolean(profile?.onboarding_completed_at) || isOnboardingComplete(profile, member);

  return {
    email: member.email,
    role: member.role,
    status: member.status,
    subscriptionPlan: member.subscription_plan,
    tokenBudgetMonthly: member.token_budget_monthly,
    displayName: profile?.display_name || "",
    timezone: profile?.timezone || "Asia/Karachi",
    businessNiche: profile?.business_niche || "",
    primaryChannels: profile?.primary_channels || [],
    growthGoal: profile?.growth_goal || "",
    integrations: profile?.integrations || DEFAULT_INTEGRATIONS,
    byokMasked: maskedByok,
    hasByok: Object.keys(byok).length > 0,
    requirements,
    onboardingComplete,
    isAdmin,
  };
}
