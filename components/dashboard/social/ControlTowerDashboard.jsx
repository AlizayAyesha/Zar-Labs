"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { usePublishingCalendar } from "../../../hooks/usePublishingCalendar";
import { PublishingHubCards } from "./PublishingHubCards";
import { CHANNEL_META } from "../../../constants/booking/channelGroups";
import { getChannelTabPath, SOCIAL_HUB_CHANNELS } from "../../../constants/social/distributionChannelTabs";

export function ControlTowerDashboard() {
  const [counts, setCounts] = useState(null);
  const { tasks, hydrated } = usePublishingCalendar();

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => setCounts(data.counts))
      .catch(() => setCounts({}));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const tasksToday = tasks.filter(
    (t) => t.publishing_date === today || t.generation_slot_date === today
  );
  const duePost = tasks.filter((t) => t.publishing_date === today).length;
  const timeToPost = tasks.filter((t) => t.panel_state?.workflow_step === "Time to Post").length;

  return (
    <AdminCmsEditorShell
      title="Control Tower"
      description="Mission control — calendar, newsletter, booking, and site health."
    >
      <div className="dashboard-stats">
        <div className="dashboard-stat-card social-stat-card">
          <strong>{hydrated ? tasksToday.length : "—"}</strong>
          <span>Calendar today</span>
        </div>
        <div className="dashboard-stat-card social-stat-card">
          <strong>{hydrated ? duePost : "—"}</strong>
          <span>Posts due today</span>
        </div>
        <div className="dashboard-stat-card social-stat-card">
          <strong>{hydrated ? timeToPost : "—"}</strong>
          <span>Time to post</span>
        </div>
        <div className="dashboard-stat-card">
          <strong>{counts?.newsletterSubscribers ?? "—"}</strong>
          <span>Newsletter subscribers</span>
        </div>
        <div className="dashboard-stat-card">
          <strong>{counts?.caseStudies ?? "—"}</strong>
          <span>Case studies</span>
        </div>
        <div className="dashboard-stat-card">
          <strong>{hydrated ? tasks.length : "—"}</strong>
          <span>Calendar tasks (all)</span>
        </div>
      </div>

      <PublishingHubCards description="One schedule for planning and publishing — click any calendar post to open Image Studio with production chat." />

      <div className="dashboard-card">
        <h2>Channels</h2>
        <p className="admin-cms-placeholder">Booking portals, link-ups, and CTAs per platform.</p>
        <div className="channel-hub-grid">
          <Link href="/dashboard/channels/social" className="channel-hub-card dashboard-card">
            <h3>All channels</h3>
            <p>Social and direct channel hubs — portals, link-ups, sitewide CTAs.</p>
            <span className="channel-hub-cta">Open hubs →</span>
          </Link>
          {SOCIAL_HUB_CHANNELS.map((key) => {
            const meta = CHANNEL_META[key];
            return (
              <Link key={key} href={getChannelTabPath(key)} className="channel-hub-card dashboard-card">
                <h3>{meta.label}</h3>
                <p>{meta.description}</p>
                <span className="channel-hub-cta">Open channel →</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="dashboard-card">
        <h2>More</h2>
        <div className="dashboard-actions">
          <Link href="/dashboard/site-system/newsletter" className="dashboard-btn">
            Newsletter
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="dashboard-btn">
            View live site ↗
          </a>
        </div>
      </div>
    </AdminCmsEditorShell>
  );
}
