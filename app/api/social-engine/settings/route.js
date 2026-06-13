import { requireDashboardAdmin, requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import { listConfiguredProviders, getMonthlyUsage, getUserUsage, getTokenBudget, JOB_CHAINS, PLAN_LIMITS } from "../../../../lib/social-engine";
import { listSocialEngineMembers } from "../../../../lib/social-engine/members";
import { getEngineSettings, updateEngineSettings, STRATEGY_IMAGE_MODES } from "../../../../lib/social-engine/engine-settings";

function maskKey(value) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function GET() {
  try {
    const user = await requireSocialEngineAccess();
    const usage = await getMonthlyUsage();
    const userUsage = await getUserUsage(user.email);
    const providers = listConfiguredProviders().map((p) => ({
      ...p,
      masked: maskKey(process.env[p.envName]),
    }));

    let members = [];
    if (user.isAdmin) {
      try {
        members = await listSocialEngineMembers();
      } catch {
        members = [];
      }
    }

    return Response.json({
      usage,
      userUsage,
      budget: getTokenBudget(),
      planLimits: PLAN_LIMITS,
      providers,
      jobChains: JOB_CHAINS,
      members: user.isAdmin ? members : undefined,
      isAdmin: user.isAdmin,
      engineSettings: await getEngineSettings(),
      strategyImageModes: STRATEGY_IMAGE_MODES,
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireDashboardAdmin();
  } catch {
    return Response.json({ error: "Admin only" }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (body.action === "addMember" && body.email) {
      const { upsertSocialEngineMember } = await import("../../../../lib/social-engine/members");
      const row = await upsertSocialEngineMember({
        email: body.email,
        role: body.role || "editor",
        subscriptionPlan: body.subscriptionPlan || "free",
      });
      return Response.json({ success: true, member: row });
    }
    if (body.action === "setPlan" && body.email && body.subscriptionPlan) {
      const { updateMemberPlan } = await import("../../../../lib/social-engine/members");
      const row = await updateMemberPlan(body.email, body.subscriptionPlan);
      return Response.json({ success: true, member: row });
    }
    if (body.action === "removeMember" && body.email) {
      const { removeSocialEngineMember } = await import("../../../../lib/social-engine/members");
      await removeSocialEngineMember(body.email);
      return Response.json({ success: true });
    }
    if (body.action === "updateEngineSettings" && body.settings) {
      const settings = await updateEngineSettings(body.settings);
      return Response.json({ success: true, engineSettings: settings });
    }
    return Response.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
