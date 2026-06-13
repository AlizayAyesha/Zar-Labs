"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { PlanUsagePanel } from "./PlanUsagePanel";

export function StyleCatalogDashboard() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [uploadDataUrl, setUploadDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(null);
  const [limits, setLimits] = useState(null);
  const [plan, setPlan] = useState("free");
  const [category, setCategory] = useState("all");

  const load = useCallback(async () => {
    const [catRes, meRes] = await Promise.all([
      fetch("/api/social-engine/style-catalog"),
      fetch("/api/social-engine/me"),
    ]);
    const cat = await catRes.json();
    setItems(cat.items || []);
    if (meRes.ok) {
      const me = await meRes.json();
      setUsage(me.usage);
      setLimits(me.limits);
      setPlan(me.subscriptionPlan || "free");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function generate() {
    if (!selected) return;
    setError("");
    setGenerating(true);
    setResultUrl("");
    try {
      const res = await fetch("/api/social-engine/style-catalog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogId: selected.id,
          userImageUrl: uploadDataUrl || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setResultUrl(json.imageUrl);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const filtered =
    category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <AdminCmsEditorShell
      title="Trending Looks"
      description="Pick a style from the catalog, upload your photo — no prompts. Uses your monthly image allowance."
    >
      {limits ? (
        <div className="dashboard-card">
          <PlanUsagePanel usage={usage || {}} limits={limits} subscriptionPlan={plan} />
        </div>
      ) : null}

      <div className="dashboard-card">
        <div className="dashboard-actions">
          {["all", "trending", "headshot", "marketing"].map((c) => (
            <button
              key={c}
              type="button"
              className={`dashboard-btn${category === c ? " dashboard-btn-primary" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="style-catalog-grid">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`style-catalog-card${selected?.id === item.id ? " is-selected" : ""}`}
              onClick={() => {
                setSelected(item);
                setResultUrl("");
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview_url} alt={item.title} loading="lazy" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </button>
          ))}
        </div>
        {!items.length ? (
          <p className="admin-cms-placeholder">Catalog loading… Apply Supabase migration for style catalog.</p>
        ) : null}
      </div>

      {selected ? (
        <div className="dashboard-card dashboard-form">
          <h2>{selected.title}</h2>
          <p className="admin-cms-placeholder">{selected.description}</p>
          <label className="dashboard-field">
            Your photo {selected.requires_face ? "(face or portrait)" : "(optional)"}
            <input type="file" accept="image/*" onChange={onFile} />
          </label>
          {uploadDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={uploadDataUrl} alt="Upload preview" className="style-catalog-upload-preview" />
          ) : null}
          <label className="dashboard-field">
            <input type="checkbox" required /> I confirm I have rights to use this photo
          </label>
          {error ? <p className="dashboard-alert dashboard-alert-error">{error}</p> : null}
          <button
            type="button"
            className="dashboard-btn dashboard-btn-primary"
            disabled={generating || (selected.requires_face && !uploadDataUrl)}
            onClick={generate}
          >
            {generating ? "Creating your look…" : "Generate my version"}
          </button>
          {resultUrl ? (
            <figure className="se-studio-image-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="Generated" />
              <figcaption>
                <a href={resultUrl} target="_blank" rel="noopener noreferrer">
                  Open ↗
                </a>
              </figcaption>
            </figure>
          ) : null}
        </div>
      ) : null}
    </AdminCmsEditorShell>
  );
}
