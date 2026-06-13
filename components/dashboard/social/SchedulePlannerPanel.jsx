"use client";

import { useMemo, useState } from "react";
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

export function SchedulePlannerPanel({ onImported, defaultOpen = true }) {
  const { importPreviewRows, hydrated } = usePublishingCalendar();
  const [open, setOpen] = useState(defaultOpen);
  const [brandId, setBrandId] = useState("build");
  const [markdown, setMarkdown] = useState(SAMPLE_TABLE);
  const [generationStart, setGenerationStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [publishingStart, setPublishingStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("pipeline and authority");
  const [generating, setGenerating] = useState(false);

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

  function importPlan() {
    setError("");
    if (parsed.errors.length) {
      setError(parsed.errors.join(" "));
      return null;
    }
    const result = importPreviewRows(parsed.rows, {
      brandId,
      generationStartDate: generationStart,
      publishingStartDate: publishingStart,
      meta: parsed.meta,
    });
    const warnCount = result.issues?.length || 0;
    setNotice(
      `Calendar filled with ${result.imported} posts.${warnCount ? ` ${warnCount} overlap warning(s).` : ""}`
    );
    setOpen(false);
    onImported?.(result);
    return result;
  }

  async function generateAndFill() {
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/social-engine/generate-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, weekStart: publishingStart, theme }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      const md = json.topicPlannerMarkdown || json.data?.topicPlannerMarkdown;
      if (!md) throw new Error("No plan returned");
      setMarkdown(md);
      const nextParsed = parsePublishingPlanMarkdown(md);
      if (nextParsed.errors.length) {
        setError(nextParsed.errors.join(" "));
        return;
      }
      const result = importPreviewRows(nextParsed.rows, {
        brandId,
        generationStartDate: generationStart,
        publishingStartDate: publishingStart,
        meta: nextParsed.meta,
      });
      setNotice(`Plan generated — ${result.imported} posts added to your calendar below.`);
      setOpen(false);
      onImported?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="schedule-planner-panel dashboard-card">
      <header className="schedule-planner-header">
        <div>
          <h2>Plan your week</h2>
          <p className="admin-cms-placeholder">
            Generate or paste a 7-day plan — it feeds straight into the calendar with titles on each slot.
          </p>
        </div>
        <button type="button" className="dashboard-btn" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide planner" : "Show planner"}
        </button>
      </header>

      {open ? (
        <div className="schedule-planner-body">
          {notice ? <div className="dashboard-alert dashboard-alert-success">{notice}</div> : null}
          {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

          <div className="schedule-planner-row">
            <div className="schedule-planner-col">
              <h3>Brand stream</h3>
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
            </div>
            <div className="schedule-planner-col schedule-planner-dates">
              <label className="dashboard-field">
                Week start (publish)
                <input type="date" value={publishingStart} onChange={(e) => setPublishingStart(e.target.value)} />
              </label>
              <label className="dashboard-field">
                Generation start
                <input type="date" value={generationStart} onChange={(e) => setGenerationStart(e.target.value)} />
              </label>
            </div>
          </div>

          <label className="dashboard-field">
            Week theme
            <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. agentic AI for service businesses" />
          </label>

          <div className="dashboard-actions schedule-planner-actions">
            <button
              type="button"
              className="dashboard-btn dashboard-btn-primary"
              disabled={generating || !hydrated}
              onClick={generateAndFill}
            >
              {generating ? "Generating…" : "Generate & fill calendar"}
            </button>
            <button
              type="button"
              className="dashboard-btn"
              disabled={!hydrated || !previewTasks.length}
              onClick={importPlan}
            >
              Import plan ({previewTasks.length})
            </button>
          </div>

          <details className="schedule-planner-details">
            <summary>Edit markdown plan</summary>
            <textarea
              className="social-plan-textarea"
              rows={10}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
            {parsed.errors.length ? (
              <p className="dashboard-alert dashboard-alert-error">{parsed.errors.join(" ")}</p>
            ) : (
              <p className="admin-cms-placeholder">{parsed.rows.length} rows — titles appear on calendar chips</p>
            )}
          </details>
        </div>
      ) : null}
    </section>
  );
}
