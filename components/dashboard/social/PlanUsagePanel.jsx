"use client";

function usagePct(used, cap) {
  if (!cap) return 0;
  return Math.min(100, Math.round((used / cap) * 100));
}

function UsageMeter({ label, used, cap }) {
  const pct = usagePct(used, cap);
  const atLimit = used >= cap;
  return (
    <div className={`se-usage-meter${atLimit ? " is-at-limit" : ""}`}>
      <div className="se-usage-meter-head">
        <span>{label}</span>
        <strong>
          {used} / {cap}
        </strong>
      </div>
      <div className="social-usage-bar">
        <div className="social-usage-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PlanUsagePanel({ usage, limits, subscriptionPlan }) {
  if (!limits) return null;

  return (
    <div className="se-usage-panel">
      <UsageMeter label="Chat messages" used={usage.chatMessages || 0} cap={limits.chatMessages} />
      <UsageMeter label="Week plans" used={usage.weekPlans || 0} cap={limits.weekPlans} />
      <UsageMeter label="Image briefs" used={usage.imageBriefs || 0} cap={limits.imageBriefs} />
      <UsageMeter label="Images generated" used={usage.imagesGenerated || 0} cap={limits.images} />
      {subscriptionPlan === "free" ? (
        <p className="admin-cms-placeholder se-upgrade-note">
          Pro ($5/mo): 300 chat · 20 week plans · 50 images · all AI models · no watermark. Contact Zar Labs to upgrade
          (Stripe checkout coming soon).
        </p>
      ) : null}
    </div>
  );
}
