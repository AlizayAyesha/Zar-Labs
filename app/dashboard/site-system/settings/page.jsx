"use client";

import { useEffect, useState } from "react";

export default function SettingsDashboardPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else
          setSettings(
            data.settings || {
              company_name: "Zar Labs",
              email: "",
              phone: "",
              phone_display: "",
              location: "",
              calendly_url: "",
              instagram_url: "",
              twitter_url: "",
            }
          );
      })
      .catch(() => setError("Failed to load settings"));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();

    if (!res.ok) setError(data.error || "Save failed");
    else {
      setSuccess("Settings saved.");
      setSettings(data.settings);
    }
    setSaving(false);
  }

  if (!settings && !error) return <p style={{ color: "#888" }}>Loading…</p>;

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Site Settings</h1>
          <p>Contact info, Calendly, and social links. Public site still reads config/*.js until wired.</p>
        </div>
      </header>

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}
      {success ? <div className="dashboard-alert dashboard-alert-success">{success}</div> : null}

      <form className="dashboard-form dashboard-card" onSubmit={handleSave}>
        {[
          ["company_name", "Company name"],
          ["email", "Email"],
          ["phone", "Phone (tel link)"],
          ["phone_display", "Phone (display)"],
          ["location", "Location"],
          ["calendly_url", "Calendly URL"],
          ["instagram_url", "Instagram URL"],
          ["twitter_url", "Twitter / X URL"],
        ].map(([key, label]) => (
          <div key={key} className="dashboard-field">
            <label>{label}</label>
            <input
              value={settings?.[key] || ""}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
          </div>
        ))}

        <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </>
  );
}
