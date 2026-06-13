"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function linesToArray(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function arrayToLines(arr) {
  return (arr || []).join("\n");
}

export default function CaseStudyEditPage({ params }) {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/dashboard/case-studies/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setForm(data.caseStudy);
      })
      .catch(() => setError("Failed to load case study"));
  }, [params.id]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      results: linesToArray(form.resultsText),
      scope: linesToArray(form.scopeText),
      gallery: linesToArray(form.galleryText),
    };

    const res = await fetch(`/api/dashboard/case-studies/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Save failed");
    } else {
      setSuccess("Saved successfully.");
      setForm({
        ...data.caseStudy,
        resultsText: arrayToLines(data.caseStudy.results),
        scopeText: arrayToLines(data.caseStudy.scope),
        galleryText: arrayToLines(data.caseStudy.gallery),
      });
    }
    setSaving(false);
  }

  useEffect(() => {
    if (form && form.resultsText === undefined) {
      setForm({
        ...form,
        resultsText: arrayToLines(form.results),
        scopeText: arrayToLines(form.scope),
        galleryText: arrayToLines(form.gallery),
      });
    }
  }, [form]);

  if (!form && !error) {
    return <p style={{ color: "#888" }}>Loading…</p>;
  }

  if (!form) {
    return (
      <>
        <div className="dashboard-alert dashboard-alert-error">{error}</div>
        <Link href="/dashboard/site-system/case-studies" className="dashboard-btn">
          ← Back
        </Link>
      </>
    );
  }

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Edit Case Study</h1>
          <p>{form.title}</p>
        </div>
        <Link href="/dashboard/site-system/case-studies" className="dashboard-btn">
          ← All case studies
        </Link>
      </header>

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}
      {success ? <div className="dashboard-alert dashboard-alert-success">{success}</div> : null}

      <form className="dashboard-form dashboard-card" onSubmit={handleSave}>
        <div className="dashboard-field-row">
          <div className="dashboard-field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
          </div>
          <div className="dashboard-field">
            <label>Slug</label>
            <input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required />
          </div>
        </div>

        <div className="dashboard-field">
          <label>Category</label>
          <input value={form.category} onChange={(e) => updateField("category", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Excerpt</label>
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Summary</label>
          <textarea value={form.summary} onChange={(e) => updateField("summary", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Challenge</label>
          <textarea value={form.challenge} onChange={(e) => updateField("challenge", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Solution</label>
          <textarea value={form.solution} onChange={(e) => updateField("solution", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Results (one per line)</label>
          <textarea value={form.resultsText || ""} onChange={(e) => updateField("resultsText", e.target.value)} />
        </div>

        <div className="dashboard-field">
          <label>Scope (one per line)</label>
          <textarea value={form.scopeText || ""} onChange={(e) => updateField("scopeText", e.target.value)} />
        </div>

        <div className="dashboard-field-row">
          <div className="dashboard-field">
            <label>Hero image URL</label>
            <input value={form.heroImage} onChange={(e) => updateField("heroImage", e.target.value)} />
          </div>
          <div className="dashboard-field">
            <label>Carousel image URL</label>
            <input value={form.carouselImage} onChange={(e) => updateField("carouselImage", e.target.value)} />
          </div>
        </div>

        <div className="dashboard-field">
          <label>Gallery URLs (one per line)</label>
          <textarea value={form.galleryText || ""} onChange={(e) => updateField("galleryText", e.target.value)} />
        </div>

        <label className="dashboard-checkbox">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => updateField("isPublished", e.target.checked)}
          />
          Published
        </label>

        <div className="dashboard-actions">
          <button type="submit" className="dashboard-btn dashboard-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <a
            href={`/works/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dashboard-btn"
          >
            Preview on site ↗
          </a>
        </div>
      </form>
    </>
  );
}
