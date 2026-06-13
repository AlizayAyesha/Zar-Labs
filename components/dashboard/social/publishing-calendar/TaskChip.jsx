"use client";

import { getBrandStyle } from "../../../../constants/social/brandChipStyles";

function taskDisplayTitle(task) {
  const title = task.what_to_post?.trim() || task.task_title || task.campaign_topic || "Untitled post";
  return title.length > 88 ? `${title.slice(0, 85)}…` : title;
}

export function TaskChip({ task, onClick, draggable, onDragStart }) {
  const brandStyle = getBrandStyle(task.brand_id);
  const step = task.panel_state?.workflow_step || "Scheduled";
  const statusClass =
    step === "Missed" ? "is-missed" : step === "Time to Post" || step === "Posted" ? "is-active" : "";

  return (
    <button
      type="button"
      className={`social-task-chip ${statusClass}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      title={`${taskDisplayTitle(task)} — click to create on-brand images`}
    >
      <span className="social-task-chip-title">{taskDisplayTitle(task)}</span>
      <span className="social-task-chip-meta">
        <span className="social-task-chip-brand" style={brandStyle.badge}>
          {task.brand_shortcut}
        </span>
        <span className="social-task-chip-channel">{task.channel}</span>
        <span className="social-task-chip-time">{task.scheduled_time}</span>
      </span>
      <span className="social-task-chip-step">{step} · Create images →</span>
    </button>
  );
}
