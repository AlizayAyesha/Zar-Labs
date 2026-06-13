import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import {
  getOrCreateMemberProfile,
  serializeProfileForClient,
  updateMemberProfile,
} from "../../../../lib/social-engine/profile";
import { getUserUsage } from "../../../../lib/social-engine/usage";
import { getPlanLimits, resolveUserPlan } from "../../../../lib/social-engine/plans";

export async function GET() {
  try {
    const user = await requireSocialEngineAccess();
    const ctx = await getOrCreateMemberProfile({
      email: user.email,
      authUserId: user.id,
      isAdmin: user.isAdmin,
    });
    if (!ctx) return Response.json({ error: "Not a Social Engine member" }, { status: 403 });

    const usage = await getUserUsage(user.email);
    const plan = resolveUserPlan(ctx.member, user.isAdmin);
    const limits = getPlanLimits(plan);

    return Response.json({
      ...serializeProfileForClient({ ...ctx, isAdmin: user.isAdmin }),
      usage,
      limits,
      plan,
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request) {
  try {
    const user = await requireSocialEngineAccess();
    if (user.isAdmin) {
      return Response.json({ error: "Admins use AI Configuration" }, { status: 400 });
    }

    const body = await request.json();
    const patch = {
      display_name: body.display_name ?? body.displayName,
      timezone: body.timezone,
      business_niche: body.business_niche ?? body.businessNiche,
      primary_channels: body.primary_channels ?? body.primaryChannels,
      growth_goal: body.growth_goal ?? body.growthGoal,
      preferences: body.preferences,
      integrations: body.integrations,
      byok_keys: body.byok_keys ?? body.byokKeys,
      markOnboardingComplete: body.markOnboardingComplete,
    };
    const result = await updateMemberProfile(user.email, patch);
    if (!result) return Response.json({ error: "Not a member" }, { status: 403 });

    const usage = await getUserUsage(user.email);
    const plan = resolveUserPlan(result.member, false);
    const limits = getPlanLimits(plan);

    return Response.json({
      ...serializeProfileForClient({ ...result, isAdmin: false }),
      usage,
      limits,
      plan,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
