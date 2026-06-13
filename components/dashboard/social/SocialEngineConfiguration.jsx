"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { StyleCatalogAdmin } from "./StyleCatalogAdmin";

const PLAN_OPTIONS = [
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro ($5/mo)" },
  { id: "included", label: "Included (VIP)" },
];

export function SocialEngineConfiguration() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [testing, setTesting] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("free");
  const [engineSettings, setEngineSettings] = useState(null);
  const [savingEngine, setSavingEngine] = useState(false);

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/social-engine/settings");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to load settings");
      return;
    }
    setSettings(json);
    setEngineSettings(json.engineSettings || null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTest() {
    setTesting(true);
    setNotice("");
    setError("");
    try {
      const res = await fetch("/api/social-engine/test-provider", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Test failed");
      setNotice(json.routing ? `Connected (${json.routing.provider})` : "Connected");
    } catch (err) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  }

  async function addMember(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    const res = await fetch("/api/social-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addMember", email: newEmail, subscriptionPlan: newPlan }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to add member");
      return;
    }
    setNewEmail("");
    setNewPlan("free");
    setNotice(`Added ${json.member?.email} (${json.member?.subscription_plan || newPlan})`);
    load();
  }

  async function setMemberPlan(email, subscriptionPlan) {
    setError("");
    const res = await fetch("/api/social-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setPlan", email, subscriptionPlan }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to update plan");
      return;
    }
    setNotice(`Updated ${email} → ${subscriptionPlan}`);
    load();
  }

  async function saveEngineSettings(partial) {
    setSavingEngine(true);
    setError("");
    setNotice("");
    const next = { ...engineSettings, ...partial };
    const res = await fetch("/api/social-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateEngineSettings", settings: next }),
    });
    const json = await res.json();
    setSavingEngine(false);
    if (!res.ok) {
      setError(json.error || "Failed to save engine settings");
      return;
    }
    setEngineSettings(json.engineSettings);
    setNotice("Engine settings saved");
  }

  async function removeMember(email) {
    if (!window.confirm(`Remove ${email}?`)) return;
    const res = await fetch("/api/social-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "removeMember", email }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to remove member");
      return;
    }
    setNotice(`Removed ${email}`);
    load();
  }

  const tokensUsed = settings?.usage?.totalTokens || 0;
  const usagePct = settings ? Math.min(100, Math.round((tokensUsed / settings.budget) * 100)) : 0;

  return (
    <AdminCmsEditorShell
      title="Social Engine — AI Configuration"
      description="Provider routing, token budget, plans, and member access."
    >
      {notice ? <div className="dashboard-alert dashboard-alert-success">{notice}</div> : null}
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card">
        <h2>Plans (Free vs Pro)</h2>
        <div className="se-plan-compare">
          <div>
            <strong>Free</strong>
            <p>50 chat · 2 week plans · 5 images/mo · 5 AI models · watermarked images</p>
          </div>
          <div>
            <strong>Pro — $5/mo</strong>
            <p>300 chat · 20 week plans · 50 images/mo · all models · no watermark</p>
          </div>
        </div>
        <p className="admin-cms-placeholder">Stripe checkout coming soon — set plan manually below until then.</p>
      </div>

      <div className="dashboard-card">
        <h2>Token budget</h2>
        {settings ? (
          <>
            <p>
              {tokensUsed.toLocaleString()} / {settings.budget.toLocaleString()} tokens this month ({usagePct}%)
            </p>
            <div className="social-usage-bar">
              <div className="social-usage-fill" style={{ width: `${usagePct}%` }} />
            </div>
          </>
        ) : (
          <p className="admin-cms-placeholder">Loading…</p>
        )}
        <button type="button" className="dashboard-btn dashboard-btn-primary" disabled={testing} onClick={handleTest}>
          {testing ? "Testing…" : "Test provider chain"}
        </button>
      </div>

      <div className="dashboard-card dashboard-table-wrap">
        <h2>Configured providers</h2>
        {settings?.providers?.length ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Key</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {settings.providers.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.masked || "—"}</td>
                  <td>{p.configured ? "Ready" : "Missing key"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {settings?.isAdmin ? (
        <div className="dashboard-card">
          <h2>Social Engine members</h2>
          <p className="admin-cms-placeholder">
            Each member gets their own schedule calendar and usage limits. Admins keep full dashboard access.
          </p>
          <form className="dashboard-form se-member-add-form" onSubmit={addMember}>
            <label className="dashboard-field">
              Email
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="customer@company.com"
              />
            </label>
            <label className="dashboard-field">
              Plan
              <select value={newPlan} onChange={(e) => setNewPlan(e.target.value)}>
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="dashboard-btn dashboard-btn-primary">
              Add member
            </button>
          </form>
          {settings.members?.length ? (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {settings.members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.email}</td>
                    <td>{m.role}</td>
                    <td>
                      <select
                        className="se-plan-select"
                        value={m.subscription_plan || "free"}
                        onChange={(e) => setMemberPlan(m.email, e.target.value)}
                      >
                        {PLAN_OPTIONS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                        <option value="disabled">Disabled</option>
                      </select>
                    </td>
                    <td>
                      <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => removeMember(m.email)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-cms-placeholder">No DB members yet — add above or use SOCIAL_ENGINE_ALLOWED_EMAILS.</p>
          )}
        </div>
      ) : null}

      {settings?.isAdmin && engineSettings ? (
        <div className="dashboard-card">
          <h2>Strategy Chat &amp; images</h2>
          <p className="admin-cms-placeholder">
            Strategy Chat proposes image briefs but never renders until the user confirms. Image Studio and Trending
            Looks stay separate standalone generators.
          </p>
          <label className="dashboard-field">
            Chat image mode
            <select
              value={engineSettings.strategyChatImages || "confirm"}
              disabled={savingEngine}
              onChange={(e) => saveEngineSettings({ strategyChatImages: e.target.value })}
            >
              <option value="confirm">Confirm required (button + “generate the image”)</option>
              <option value="command_only">Command only (user must ask explicitly)</option>
              <option value="disabled">Disabled (Strategy Chat text only)</option>
            </select>
          </label>
          <label className="dashboard-field se-admin-checkbox">
            <input
              type="checkbox"
              checked={engineSettings.chatImageBriefsEnabled !== false}
              disabled={savingEngine}
              onChange={(e) => saveEngineSettings({ chatImageBriefsEnabled: e.target.checked })}
            />
            Allow IMAGE_BRIEF proposals in Strategy Chat
          </label>
          <label className="dashboard-field se-admin-checkbox">
            <input
              type="checkbox"
              checked={engineSettings.showCopyPromptOnFail !== false}
              disabled={savingEngine}
              onChange={(e) => saveEngineSettings({ showCopyPromptOnFail: e.target.checked })}
            />
            Offer copy-prompt when FAL/Gemini fail
          </label>
        </div>
      ) : null}

      {settings?.isAdmin ? <StyleCatalogAdmin /> : null}
    </AdminCmsEditorShell>
  );
}
