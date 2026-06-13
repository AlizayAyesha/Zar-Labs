import { getOrCreateMemberProfile, getUserByokKeys } from "./profile";
import { getPlanLimits, resolveUserPlan } from "./plans";
import { getUserUsage, assertUserLimit } from "./usage";

export async function resolveEngineContext(user) {
  const ctx = await getOrCreateMemberProfile({
    email: user.email,
    authUserId: user.id,
    isAdmin: user.isAdmin,
  });

  if (!ctx && !user.isAdmin) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const plan = resolveUserPlan(ctx?.member, user.isAdmin);
  const limits = getPlanLimits(plan);
  const usage = await getUserUsage(user.email);
  const byok = await getUserByokKeys(user.email, user.isAdmin);

  return {
    plan,
    limits,
    usage,
    byok,
    member: ctx?.member,
    profile: ctx?.profile,
    tokenBudgetOverride: ctx?.member?.token_budget_monthly || null,
  };
}

export async function assertEngineLimit(user, metric) {
  const ctx = await resolveEngineContext(user);
  assertUserLimit(ctx.usage, ctx.limits, metric);
  return ctx;
}
