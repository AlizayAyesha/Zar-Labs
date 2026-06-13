"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { PlanUsagePanel } from "./PlanUsagePanel";

export function SocialEngineMyAccount() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [byok, setByok] = useState({ fal: "", openrouter: "", gemini: "" });
  const [scheduleForm, setScheduleForm] = useState({
    postTitle: "",
    channel: "LinkedIn",
    brief: "",
    scheduledAt: "",
  });

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/social-engine/me");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to load");
      return;
    }
    setData(json);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/social-engine/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: data.displayName,
          timezone: data.timezone,
          business_niche: data.businessNiche,
          primary_channels: data.primaryChannels,
          growth_goal: data.growthGoal,
          byok_keys: byok,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setData(json);
      setNotice("Profile saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function addSchedule(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/social-engine/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postTitle: scheduleForm.postTitle,
          channel: scheduleForm.channel,
          brief: scheduleForm.brief,
          scheduledAt: new Date(scheduleForm.scheduledAt).toISOString(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setNotice("Reminder scheduled — you'll get an email at post time.");
      setScheduleForm({ postTitle: "", channel: "LinkedIn", brief: "", scheduledAt: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  if (!data && !error) {
    return (
      <AdminCmsEditorShell title="My Account">
        <p className="admin-cms-placeholder">Loading…</p>
      </AdminCmsEditorShell>
    );
  }

  if (data?.isAdmin) {
    return (
      <AdminCmsEditorShell title="My Account" description="Admins manage platform settings in AI Configuration.">
        <div className="dashboard-card">
          <p>You are a full dashboard admin. Member settings apply to Social Engine subscribers.</p>
        </div>
      </AdminCmsEditorShell>
    );
  }

  const usage = data?.usage || {};
  const limits = data?.limits || {};

  return (
    <AdminCmsEditorShell title="My Account" description="Profile, plan usage, reminders, and optional BYOK keys.">
      {notice ? <div className="dashboard-alert dashboard-alert-success">{notice}</div> : null}
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card">
        <h2>
          Plan: {data?.subscriptionPlan || "free"}
          {limits?.label ? ` (${limits.label})` : ""}
        </h2>
        <PlanUsagePanel usage={usage} limits={limits} subscriptionPlan={data?.subscriptionPlan} />
      </div>

      <div className="dashboard-card">
        <h2>Onboarding checklist</h2>
        <ul className="se-checklist">
          {(data?.requirements || []).map((r) => (
            <li key={r.id} className={r.done ? "is-done" : ""}>
              {r.done ? "✓" : "○"} {r.label}
              {!r.required ? " (optional)" : ""}
            </li>
          ))}
        </ul>
      </div>

      <form className="dashboard-card dashboard-form" onSubmit={saveProfile}>
        <h2>Profile</h2>
        <label className="dashboard-field">
          Display name
          <input
            value={data?.displayName || ""}
            onChange={(e) => setData({ ...data, displayName: e.target.value })}
          />
        </label>
        <label className="dashboard-field">
          Timezone
          <input value={data?.timezone || ""} onChange={(e) => setData({ ...data, timezone: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Business niche
          <input
            value={data?.businessNiche || ""}
            onChange={(e) => setData({ ...data, businessNiche: e.target.value })}
          />
        </label>
        <label className="dashboard-field">
          Growth goal
          <input value={data?.growthGoal || ""} onChange={(e) => setData({ ...data, growthGoal: e.target.value })} />
        </label>
        <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={saving}>
          Save profile
        </button>
      </form>

      <div className="dashboard-card">
        <h2>Google Calendar</h2>
        <p className="admin-cms-placeholder">
          Status: {data?.integrations?.google_calendar?.status || "not_connected"} — OAuth connect coming in Phase 2.
          Email reminders work today without Calendar.
        </p>
      </div>

      <form className="dashboard-card dashboard-form" onSubmit={addSchedule}>
        <h2>Schedule post reminder (email)</h2>
        <label className="dashboard-field">
          Post title
          <input
            required
            value={scheduleForm.postTitle}
            onChange={(e) => setScheduleForm({ ...scheduleForm, postTitle: e.target.value })}
          />
        </label>
        <label className="dashboard-field">
          Channel
          <input value={scheduleForm.channel} onChange={(e) => setScheduleForm({ ...scheduleForm, channel: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Brief
          <textarea rows={3} value={scheduleForm.brief} onChange={(e) => setScheduleForm({ ...scheduleForm, brief: e.target.value })} />
        </label>
        <label className="dashboard-field">
          Post date & time
          <input
            type="datetime-local"
            required
            value={scheduleForm.scheduledAt}
            onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledAt: e.target.value })}
          />
        </label>
        <button type="submit" className="dashboard-btn dashboard-btn-primary">
          Schedule email reminder
        </button>
      </form>

      <form className="dashboard-card dashboard-form" onSubmit={saveProfile}>
        <h2>Bring your own keys (optional)</h2>
        <p className="admin-cms-placeholder">Overrides platform keys for your account only. Leave blank to use Zar Labs keys.</p>
        {["fal", "openrouter", "gemini"].map((key) => (
          <label key={key} className="dashboard-field">
            {key.toUpperCase()} {data?.byokMasked?.[key] ? `(saved ${data.byokMasked[key]})` : ""}
            <input
              type="password"
              placeholder="Paste new key to update"
              value={byok[key]}
              onChange={(e) => setByok({ ...byok, [key]: e.target.value })}
            />
          </label>
        ))}
        <button type="submit" className="dashboard-btn" disabled={saving}>
          Save BYOK keys
        </button>
      </form>
    </AdminCmsEditorShell>
  );
}
