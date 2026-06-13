"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";

const CHANNEL_OPTIONS = ["LinkedIn", "Instagram", "X", "Facebook"];

export function SocialEngineOnboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    displayName: "",
    timezone: "Asia/Karachi",
    businessNiche: "",
    primaryChannels: ["LinkedIn"],
    growthGoal: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/social-engine/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.onboardingComplete) return;
        setForm((f) => ({
          ...f,
          displayName: data.displayName || "",
          timezone: data.timezone || f.timezone,
          businessNiche: data.businessNiche || "",
          primaryChannels: data.primaryChannels?.length ? data.primaryChannels : f.primaryChannels,
          growthGoal: data.growthGoal || "",
        }));
      })
      .catch(() => {});
  }, []);

  function toggleChannel(ch) {
    setForm((f) => ({
      ...f,
      primaryChannels: f.primaryChannels.includes(ch)
        ? f.primaryChannels.filter((c) => c !== ch)
        : [...f.primaryChannels, ch],
    }));
  }

  async function finish(markComplete) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/social-engine/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: form.displayName,
          timezone: form.timezone,
          business_niche: form.businessNiche,
          primary_channels: form.primaryChannels,
          growth_goal: form.growthGoal,
          markOnboardingComplete: markComplete,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      if (markComplete) {
        window.location.href = "/dashboard/site-system/social-engine/strategy-chat";
        return;
      }
      setStep((s) => s + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    {
      title: "Welcome to Social Engine",
      body: (
        <>
          <p>Your focused assistant for social media strategy and marketing templates — not a general AI chatbot.</p>
          <p className="admin-cms-placeholder">Free: 5 models + 5 images/mo · Pro ($5): all models + higher limits</p>
        </>
      ),
      action: () => setStep(1),
      actionLabel: "Get started",
    },
    {
      title: "About you",
      body: (
        <>
          <label className="dashboard-field">
            Display name
            <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </label>
          <label className="dashboard-field">
            Timezone (for email reminders)
            <input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          </label>
          <label className="dashboard-field">
            Business niche
            <input
              value={form.businessNiche}
              onChange={(e) => setForm({ ...form, businessNiche: e.target.value })}
              placeholder="e.g. B2B SaaS, agency, e-commerce"
            />
          </label>
        </>
      ),
      action: () => finish(false),
      actionLabel: "Continue",
    },
    {
      title: "Channels & goal",
      body: (
        <>
          <div className="se-onboard-channels">
            {CHANNEL_OPTIONS.map((ch) => (
              <button
                key={ch}
                type="button"
                className={`dashboard-btn${form.primaryChannels.includes(ch) ? " dashboard-btn-primary" : ""}`}
                onClick={() => toggleChannel(ch)}
              >
                {ch}
              </button>
            ))}
          </div>
          <label className="dashboard-field">
            Growth goal
            <input
              value={form.growthGoal}
              onChange={(e) => setForm({ ...form, growthGoal: e.target.value })}
              placeholder="e.g. book discovery calls, build authority"
            />
          </label>
        </>
      ),
      action: () => finish(true),
      actionLabel: "Open Strategy Chat",
    },
  ];

  const current = steps[step];

  return (
    <AdminCmsEditorShell title="Social Engine setup" description="One-time onboarding for your social growth workspace.">
      <div className="dashboard-card se-onboard-card">
        <div className="se-onboard-progress">
          {steps.map((_, i) => (
            <span key={i} className={`se-onboard-dot${i <= step ? " is-on" : ""}`} />
          ))}
        </div>
        <h2>{current.title}</h2>
        {current.body}
        {error ? <p className="dashboard-alert dashboard-alert-error">{error}</p> : null}
        <div className="dashboard-actions">
          {step > 0 ? (
            <button type="button" className="dashboard-btn" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : null}
          <button type="button" className="dashboard-btn dashboard-btn-primary" disabled={saving} onClick={current.action}>
            {saving ? "Saving…" : current.actionLabel}
          </button>
          <Link href="/dashboard/site-system/social-engine/my-account" className="dashboard-btn">
            Skip to My Account
          </Link>
        </div>
      </div>
    </AdminCmsEditorShell>
  );
}
