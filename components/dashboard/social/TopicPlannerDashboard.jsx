"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { PUBLISHING_BRANDS } from "../../../constants/social/publishingBrands";
import { parsePublishingPlanMarkdown } from "../../../lib/publishing-calendar/parsePublishingPlanMarkdown";
import { createTaskFromPlanRow } from "../../../lib/publishing-calendar/taskFactory";
import { usePublishingCalendar } from "../../../hooks/usePublishingCalendar";
import { getBrandStyle } from "../../../constants/social/brandChipStyles";

const SAMPLE_TABLE = `Topic: Agentic AI workflows for service businesses
Primary audience: Founders and ops leaders at B2B companies

| Day | Phase | Channel | Format | Time | What to post | SEO terms | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Awareness | LinkedIn | Post | 09:00 | How agentic AI routes intake without replacing your team | agentic AI workflow | Book a call |
| 2 | Education | Instagram | Reel | 11:00 | 30s: custom software + AI for measurable outcomes | Zar Labs AI | Link in bio |
| 3 | Proof | LinkedIn | Article | 10:00 | Case study teaser from /works | digital transformation | /project-intake |
`;

export function TopicPlannerDashboard() {
  const { importPreviewRows, hydrated } = usePublishingCalendar();
  const [brandId, setBrandId] = useState("build");
  const [markdown, setMarkdown] = useState(SAMPLE_TABLE);
  const [generationStart, setGenerationStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [publishingStart, setPublishingStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [importNotice, setImportNotice] = useState("");
  const [importError, setImportError] = useState("");
  const [theme, setTheme] = useState("pipeline and authority");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const parsed = useMemo(() => parsePublishingPlanMarkdown(markdown), [markdown]);

  const previewTasks = useMemo(() => {
    if (!parsed.rows.length) return [];
    return parsed.rows.map((row) =>
      createTaskFromPlanRow(row, {
        brandId,
        generationStartDate: generationStart,
        publishingStartDate: publishingStart,
        meta: parsed.meta,
      })
    );
  }, [parsed, brandId, generationStart, publishingStart]);

  async function handleGenerateWeek() {
    setGenerateError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/social-engine/generate-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          weekStart: publishingStart,
          theme,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      const md = json.topicPlannerMarkdown || json.data?.topicPlannerMarkdown;
      if (md) setMarkdown(md);
      setImportNotice("Plan generated — review and import when ready.");
    } catch (err) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleImport() {
    setImportError("");
    if (parsed.errors.length) {
      setImportError(parsed.errors.join(" "));
      return;
    }
    const result = importPreviewRows(parsed.rows, {
      brandId,
      generationStartDate: generationStart,
      publishingStartDate: publishingStart,
      meta: parsed.meta,
    });
    const warnCount = result.issues?.length || 0;
    setImportNotice(
      `Imported ${result.imported} tasks.${warnCount ? ` ${warnCount} overlap warning(s) — review on calendar.` : ""}`
    );
  }

  const brand = PUBLISHING_BRANDS.find((b) => b.id === brandId);

  return (
    <AdminCmsEditorShell
      title="Topic Planner"
      description="Paste a 7-day AI publishing plan → preview dates → import to Schedule Calendar."
    >
      {importNotice ? <div className="dashboard-alert dashboard-alert-success">{importNotice}</div> : null}
      {importError ? <div className="dashboard-alert dashboard-alert-error">{importError}</div> : null}

      <div className="dashboard-card">
        <h2>Brand stream</h2>
        <div className="social-brand-filters">
          {PUBLISHING_BRANDS.map((b) => {
            const style = getBrandStyle(b.id);
            return (
              <button
                key={b.id}
                type="button"
                className={`dashboard-btn social-brand-filter${brandId === b.id ? " is-on" : ""}`}
                style={brandId === b.id ? style.badge : undefined}
                onClick={() => setBrandId(b.id)}
              >
                {b.shortcut}
              </button>
            );
          })}
        </div>
        {brand ? (
          <p className="admin-cms-placeholder">
            <a href={brand.researchUrl} target="_blank" rel="noopener noreferrer">
              Research topic (external) ↗
            </a>
          </p>
        ) : null}
      </div>

      <div className="dashboard-card dashboard-form">
        <h2>Generate with AI</h2>
        <label className="dashboard-field">
          Week theme
          <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. agentic AI for service businesses" />
        </label>
        {generateError ? <p className="dashboard-alert dashboard-alert-error">{generateError}</p> : null}
        <button
          type="button"
          className="dashboard-btn dashboard-btn-primary"
          disabled={generating}
          onClick={handleGenerateWeek}
        >
          {generating ? "Generating…" : "Generate 7-day plan"}
        </button>
      </div>

      <div className="dashboard-card dashboard-form">
        <h2>Schedule anchors</h2>
        <label className="dashboard-field">
          Generation start date
          <input type="date" value={generationStart} onChange={(e) => setGenerationStart(e.target.value)} />
        </label>
        <label className="dashboard-field">
          Publishing start date
          <input type="date" value={publishingStart} onChange={(e) => setPublishingStart(e.target.value)} />
        </label>
      </div>

      <div className="dashboard-card">
        <h2>7-day plan markdown</h2>
        <textarea
          className="social-plan-textarea"
          rows={14}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        {parsed.errors.length ? (
          <p className="dashboard-alert dashboard-alert-error">{parsed.errors.join(" ")}</p>
        ) : (
          <p className="admin-cms-placeholder">{parsed.rows.length} rows parsed</p>
        )}
      </div>

      <div className="dashboard-card dashboard-table-wrap">
        <h2>Preview</h2>
        {previewTasks.length ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Channel</th>
                <th>Generation</th>
                <th>Publish</th>
                <th>Brief</th>
              </tr>
            </thead>
            <tbody>
              {previewTasks.map((t) => (
                <tr key={t.day_number + t.channel}>
                  <td>{t.day_number}</td>
                  <td>{t.channel}</td>
                  <td>{t.generation_slot_date}</td>
                  <td>{t.publishing_date}</td>
                  <td>{t.what_to_post?.slice(0, 60)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="admin-cms-placeholder">Paste a markdown table above.</p>
        )}
      </div>

      <div className="dashboard-actions">
        <button
          type="button"
          className="dashboard-btn dashboard-btn-primary"
          disabled={!hydrated || !previewTasks.length}
          onClick={handleImport}
        >
          Add to Calendar ({previewTasks.length})
        </button>
        <Link href="/dashboard/social-media-management/schedule-calendar" className="dashboard-btn">
          Open Schedule Calendar →
        </Link>
      </div>
    </AdminCmsEditorShell>
  );
}
