"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { usePublishingCalendar } from "../../../hooks/usePublishingCalendar";
import { PUBLISHING_BRANDS } from "../../../constants/social/publishingBrands";
import { getWeekDates, isToday } from "../../../lib/publishing-calendar/calendarDates";
import { imageStudioPathForTask } from "../../../lib/social/calendarTaskNavigation";
import { TaskChip } from "./publishing-calendar/TaskChip";
import { SchedulePlannerPanel } from "./SchedulePlannerPanel";
import { SyncStatusIndicator } from "../SyncStatusIndicator";

export function ScheduleDashboard() {
  const router = useRouter();
  const {
    tasks,
    activity,
    hydrated,
    syncWarning,
    syncing,
    rescheduleTask,
    persistNow,
    exportBackup,
  } = usePublishingCalendar();

  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [rowMode, setRowMode] = useState("split");
  const [dragTaskId, setDragTaskId] = useState(null);
  const [brandFilter, setBrandFilter] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [plannerOpen, setPlannerOpen] = useState(true);

  const weekDates = useMemo(() => getWeekDates(anchorDate), [anchorDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (brandFilter.length && !brandFilter.includes(t.brand_id)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${t.task_title} ${t.what_to_post} ${t.channel} ${t.campaign_topic}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, brandFilter, search]);

  function tasksForDate(isoDate, row) {
    return filteredTasks.filter((t) => {
      if (row === "post") return t.publishing_date === isoDate;
      return (t.generation_slot_date || t.production_date) === isoDate;
    });
  }

  function shiftWeek(delta) {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() + delta * 7);
    setAnchorDate(d);
  }

  function onDrop(date, row) {
    if (!dragTaskId) return;
    const patch = row === "post" ? { publishing_date: date } : { generation_slot_date: date };
    const result = rescheduleTask(dragTaskId, patch);
    setDragTaskId(null);
    if (result.conflicts?.warnings?.length) {
      alert(result.conflicts.warnings.join("\n"));
    }
  }

  function openTaskChat(task) {
    router.push(imageStudioPathForTask(task));
  }

  const stats = useMemo(() => {
    const byBrand = {};
    for (const t of filteredTasks) {
      byBrand[t.brand_shortcut] = (byBrand[t.brand_shortcut] || 0) + 1;
    }
    return { total: filteredTasks.length, byBrand };
  }, [filteredTasks]);

  if (!hydrated) {
    return <div className="social-calendar-shell"><p className="admin-cms-placeholder">Loading schedule…</p></div>;
  }

  return (
    <div className="social-calendar-shell tech-pattern-bg">
      <header className="social-calendar-toolbar">
        <div>
          <h1>Schedule</h1>
          <p>Plan your week → calendar fills with titles → click any post for Strategy Chat (images confirm inline)</p>
        </div>
        <div className="dashboard-actions">
          <button type="button" className="dashboard-btn" onClick={() => shiftWeek(-1)}>
            ← Prev
          </button>
          <button type="button" className="dashboard-btn" onClick={() => setAnchorDate(new Date())}>
            Today
          </button>
          <button type="button" className="dashboard-btn" onClick={() => shiftWeek(1)}>
            Next →
          </button>
          <button type="button" className="dashboard-btn" onClick={() => setPlannerOpen((v) => !v)}>
            {plannerOpen ? "Hide planner" : "Plan week"}
          </button>
          <button type="button" className="dashboard-btn" onClick={persistNow} disabled={syncing}>
            {syncing ? "Syncing…" : "Sync now"}
          </button>
          <button
            type="button"
            className="dashboard-btn"
            onClick={() => {
              const blob = new Blob([exportBackup()], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "zar-calendar-backup.json";
              a.click();
            }}
          >
            Export JSON
          </button>
        </div>
      </header>

      {syncWarning ? <div className="dashboard-alert dashboard-alert-error">{syncWarning}</div> : null}

      {plannerOpen ? (
        <SchedulePlannerPanel
          defaultOpen
          onImported={() => {
            setPlannerOpen(false);
            persistNow();
          }}
        />
      ) : null}

      <div className="social-calendar-filters">
        <input
          type="search"
          className="admin-cms-search"
          placeholder="Search titles, channel, topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="social-brand-filters">
          {PUBLISHING_BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`dashboard-btn social-brand-filter${brandFilter.includes(b.id) ? " is-on" : ""}`}
              onClick={() =>
                setBrandFilter((prev) =>
                  prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id]
                )
              }
            >
              {b.shortcut}
            </button>
          ))}
          {brandFilter.length ? (
            <button type="button" className="dashboard-btn" onClick={() => setBrandFilter([])}>
              Clear
            </button>
          ) : null}
        </div>
        <div className="dashboard-actions">
          <button type="button" className={`dashboard-btn${rowMode === "split" ? " dashboard-btn-primary" : ""}`} onClick={() => setRowMode("split")}>
            Split rows
          </button>
          <button type="button" className={`dashboard-btn${rowMode === "post" ? " dashboard-btn-primary" : ""}`} onClick={() => setRowMode("post")}>
            Post only
          </button>
          <button type="button" className={`dashboard-btn${rowMode === "gen" ? " dashboard-btn-primary" : ""}`} onClick={() => setRowMode("gen")}>
            Gen only
          </button>
          <button type="button" className="dashboard-btn" onClick={() => setSidebarOpen((v) => !v)}>
            {sidebarOpen ? "Hide" : "Show"} sidebar
          </button>
        </div>
      </div>

      <div className={`social-calendar-body${sidebarOpen ? "" : " social-calendar-body--full"}`}>
        <div className="social-kanban-wrap">
          <div className="social-kanban-header">
            {weekDates.map((col) => (
              <div key={col.date} className={`social-kanban-col-head${isToday(col.date) ? " is-today" : ""}`}>
                {col.label}
              </div>
            ))}
          </div>

          {(rowMode === "split" || rowMode === "post") && <div className="social-kanban-row-label">Post</div>}
          {(rowMode === "split" || rowMode === "post") && (
            <div className="social-kanban-grid">
              {weekDates.map((col) => (
                <div
                  key={`post-${col.date}`}
                  className={`social-kanban-cell${isToday(col.date) ? " is-today" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(col.date, "post")}
                >
                  {tasksForDate(col.date, "post").map((task) => (
                    <TaskChip
                      key={task.id}
                      task={task}
                      draggable
                      onDragStart={() => setDragTaskId(task.id)}
                      onClick={() => openTaskChat(task)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {(rowMode === "split" || rowMode === "gen") && <div className="social-kanban-row-label">Generation</div>}
          {(rowMode === "split" || rowMode === "gen") && (
            <div className="social-kanban-grid">
              {weekDates.map((col) => (
                <div
                  key={`gen-${col.date}`}
                  className={`social-kanban-cell${isToday(col.date) ? " is-today" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(col.date, "gen")}
                >
                  {tasksForDate(col.date, "gen").map((task) => (
                    <TaskChip
                      key={task.id}
                      task={task}
                      draggable
                      onDragStart={() => setDragTaskId(task.id)}
                      onClick={() => openTaskChat(task)}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {sidebarOpen ? (
          <aside className="social-calendar-sidebar">
            <div className="dashboard-card">
              <h2>Week summary</h2>
              <p>
                <strong>{stats.total}</strong> posts (filtered)
              </p>
              <ul className="social-sidebar-stats">
                {Object.entries(stats.byBrand).map(([k, v]) => (
                  <li key={k}>
                    {k}: {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-card">
              <h2>How it works</h2>
              <ol className="schedule-how-list">
                <li>Generate or import a 7-day plan above</li>
                <li>Calendar slots fill with post titles</li>
                <li>Click a slot → Strategy Chat plans copy + image brief (confirm to render inline)</li>
              </ol>
            </div>
            <div className="dashboard-card">
              <h2>Activity</h2>
              <ul className="social-activity-list">
                {activity.slice(0, 8).map((a) => (
                  <li key={a.id}>
                    <span>{a.action}</span>
                    <time>{new Date(a.created_at).toLocaleString()}</time>
                  </li>
                ))}
              </ul>
            </div>
            <SyncStatusIndicator lastSynced={syncing ? "Syncing…" : "Auto-save on"} onSync={persistNow} syncing={syncing} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
