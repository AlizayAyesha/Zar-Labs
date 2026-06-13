/** Free tier: 5 text providers. Pro: full router chain. */

export const FREE_PROVIDERS = new Set(["gemini", "groq", "deepseek", "mistral", "openrouter"]);

export const PLAN_LIMITS = {
  free: {
    id: "free",
    label: "Free",
    priceUsd: 0,
    chatMessages: 50,
    weekPlans: 2,
    imageBriefs: 15,
    images: 5,
    remindersPerWeek: 7,
    providers: FREE_PROVIDERS,
    watermark: true,
  },
  pro: {
    id: "pro",
    label: "Pro",
    priceUsd: 5,
    chatMessages: 300,
    weekPlans: 20,
    imageBriefs: 100,
    images: 50,
    remindersPerWeek: 30,
    providers: null,
    watermark: false,
  },
  included: {
    id: "included",
    label: "Included",
    priceUsd: 0,
    chatMessages: 500,
    weekPlans: 50,
    imageBriefs: 200,
    images: 100,
    remindersPerWeek: 50,
    providers: null,
    watermark: false,
  },
  enterprise: {
    id: "enterprise",
    label: "Admin",
    priceUsd: 0,
    chatMessages: 99999,
    weekPlans: 99999,
    imageBriefs: 99999,
    images: 99999,
    remindersPerWeek: 99999,
    providers: null,
    watermark: false,
  },
};

export function getPlanLimits(planId) {
  return PLAN_LIMITS[planId] || PLAN_LIMITS.free;
}

export function resolveUserPlan(member, isAdmin) {
  if (isAdmin) return "enterprise";
  const plan = member?.subscription_plan || "free";
  if (plan === "disabled") return "free";
  return PLAN_LIMITS[plan] ? plan : "free";
}

export function filterChainForPlan(chain, planId) {
  const limits = getPlanLimits(planId);
  if (!limits.providers) return chain;
  return chain.filter((step) => limits.providers.has(step.provider));
}
