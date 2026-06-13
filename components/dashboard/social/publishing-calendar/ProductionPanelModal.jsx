"use client";

import { useState } from "react";
import { getPanelConfig } from "../../../../lib/publishing-calendar/productionPanels/panelConfigs";
import { WORKFLOW_STEPS } from "../../../../lib/publishing-calendar/types";
import { getBrandStyle } from "../../../../constants/social/brandChipStyles";

export function ProductionPanelModal({
  task,
  preview = false,
  onClose,
  onUpdatePanelState,
  onUpdateTask,
  onDelete,
  onDuplicate,
}) {
  const [urlInput, setUrlInput] = useState(task?.published_url || "");
  const [aiLoading, setAiLoading] = useState("");
  const [aiError, setAiError] = useState("");

  if (!task) return null;

  const config = getPanelConfig(task.production_panel_id);
  const brandStyle = getBrandStyle(task.brand_id);
  const step = task.panel_state?.workflow_step || "Scheduled";

  async function generatePost() {
    setAiError("");
    setAiLoading("post");
    try {
      const res = await fetch("/api/social-engine/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      const d = json.data || {};
      onUpdatePanelState(task.id, {
        panel_fields: {
          ...task.panel_state?.panel_fields,
          hook: d.hook || "",
          body: d.body || "",
          hashtags: Array.isArray(d.hashtags) ? d.hashtags.join(" ") : "",
          first_comment: d.firstCommentLink || "",
        },
      });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading("");
    }
  }

  async function generateBrief() {
    setAiError("");
    setAiLoading("brief");
    try {
      const res = await fetch("/api/social-engine/generate-image-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      const d = json.data || {};
      onUpdatePanelState(task.id, {
        panel_fields: {
          ...task.panel_state?.panel_fields,
          image_headline: d.headline || "",
          image_subline: d.subline || "",
          image_layout: d.layout || "",
        },
      });
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading("");
    }
  }

  function copyPrompt() {
    const text = [
      `Brand: ${task.brand}`,
      `Channel: ${task.channel}`,
      `Topic: ${task.campaign_topic}`,
      `Brief: ${task.what_to_post}`,
      `SEO: ${task.seo_ai_search_terms}`,
      `CTA: ${task.cta} — ${task.cta_link}`,
      `Tagline: Custom software, AI automation, and digital products for measurable outcomes.`,
    ].join("\n");
    navigator.clipboard.writeText(text);
  }

  function openPlatform() {
    const url = task.cta_link || "https://zar-labs.vercel.app";
    window.open(url.startsWith("http") ? url : `https://zar-labs.vercel.app${url}`, "_blank", "noopener,noreferrer");
    onUpdatePanelState(task.id, { platform_opened_at: new Date().toISOString() });
  }

  function savePublishedUrl() {
    onUpdateTask(task.id, { published_url: urlInput });
    onUpdatePanelState(task.id, {
      workflow_step: "Posted",
      verification_status: "verified",
      cta_status: urlInput ? "Verified" : task.panel_state?.cta_status,
    });
  }

  function setWorkflow(next) {
    onUpdatePanelState(task.id, { workflow_step: next });
  }

  return (
    <div className="social-modal-backdrop" role="dialog" aria-modal="true">
      <div className="social-modal">
        <header className="social-modal-header">
          <div>
            <span className="social-task-chip-brand" style={brandStyle.badge}>
              {task.brand_shortcut}
            </span>
            <h2>{task.task_title}</h2>
            <p className="social-modal-meta">
              {task.publishing_date} · {task.scheduled_time} · {task.timezone}
              {preview ? " · Preview" : ""}
            </p>
          </div>
          <button type="button" className="dashboard-btn" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="social-workflow-pills">
          {WORKFLOW_STEPS.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              className={`social-workflow-pill${step === s ? " is-active" : ""}`}
              onClick={() => !preview && setWorkflow(s)}
              disabled={preview}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="social-modal-grid">
          <section className="dashboard-card social-modal-section">
            <h3>Campaign context</h3>
            <dl className="social-dl">
              <dt>Topic</dt>
              <dd>{task.campaign_topic}</dd>
              <dt>Objective</dt>
              <dd>{task.objective || "—"}</dd>
              <dt>What to post</dt>
              <dd>{task.what_to_post}</dd>
              <dt>SEO / AI terms</dt>
              <dd>{task.seo_ai_search_terms || "—"}</dd>
              <dt>CTA</dt>
              <dd>
                {task.cta} — {task.cta_link}
              </dd>
              <dt>Follow-up</dt>
              <dd>{task.follow_up_comment_action || "—"}</dd>
            </dl>
          </section>

          <section className="dashboard-card social-modal-section">
            <h3>{config.title}</h3>
            <ul className="social-checklist">
              {config.requiredOutputs.map((out) => (
                <li key={out.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={task.panel_state?.checklist?.[out.id] === "done"}
                      disabled={preview}
                      onChange={(e) =>
                        onUpdatePanelState(task.id, {
                          checklist: {
                            ...task.panel_state?.checklist,
                            [out.id]: e.target.checked ? "done" : "pending",
                          },
                        })
                      }
                    />
                    {out.label}
                    {out.required ? " *" : ""}
                  </label>
                </li>
              ))}
            </ul>
            {config.fields.map((field) => (
              <label key={field.id} className="dashboard-field">
                {field.label}
                {field.multiline ? (
                  <textarea
                    rows={3}
                    value={task.panel_state?.panel_fields?.[field.id] || ""}
                    disabled={preview}
                    onChange={(e) =>
                      onUpdatePanelState(task.id, {
                        panel_fields: {
                          ...task.panel_state?.panel_fields,
                          [field.id]: e.target.value,
                        },
                      })
                    }
                  />
                ) : (
                  <input
                    value={task.panel_state?.panel_fields?.[field.id] || ""}
                    disabled={preview}
                    onChange={(e) =>
                      onUpdatePanelState(task.id, {
                        panel_fields: {
                          ...task.panel_state?.panel_fields,
                          [field.id]: e.target.value,
                        },
                      })
                    }
                  />
                )}
              </label>
            ))}
          </section>
        </div>

        {aiError ? <p className="dashboard-alert dashboard-alert-error">{aiError}</p> : null}

        {!preview ? (
          <footer className="social-modal-actions">
            <button type="button" className="dashboard-btn" disabled={!!aiLoading} onClick={generatePost}>
              {aiLoading === "post" ? "Generating…" : "Generate post"}
            </button>
            <button type="button" className="dashboard-btn" disabled={!!aiLoading} onClick={generateBrief}>
              {aiLoading === "brief" ? "Generating…" : "Generate image brief"}
            </button>
            <button type="button" className="dashboard-btn" onClick={copyPrompt}>
              Copy prompt
            </button>
            <button type="button" className="dashboard-btn" onClick={openPlatform}>
              Open platform
            </button>
            <label className="dashboard-field social-url-field">
              Published URL
              <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://..." />
            </label>
            <button type="button" className="dashboard-btn dashboard-btn-primary" onClick={savePublishedUrl}>
              Save URL
            </button>
            <button type="button" className="dashboard-btn" onClick={() => onDuplicate(task.id)}>
              Duplicate
            </button>
            <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
