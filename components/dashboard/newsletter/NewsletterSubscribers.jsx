"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { WEBSITE_CMS_PATHS } from "../../../constants/websiteCmsPaths";

export function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/newsletter")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setSubscribers(data.subscribers || []);
      })
      .catch(() => setError("Could not load subscribers"));
  }, []);

  function exportCsv() {
    const rows = [["email", "status", "source", "created_at"]];
    subscribers.forEach((s) => rows.push([s.email, s.status, s.source, s.created_at]));
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminCmsEditorShell
      title="Subscribers"
      description="People subscribed to Zar Labs newsletters via footer and /newsletter signup."
      actions={
        <>
          <Link href={WEBSITE_CMS_PATHS.newsletter.list} className="dashboard-btn">
            ← Newsletters
          </Link>
          <button type="button" className="dashboard-btn dashboard-btn-primary" onClick={exportCsv} disabled={!subscribers.length}>
            Export CSV
          </button>
        </>
      }
    >
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>
                  <span className={`dashboard-badge${s.status !== "active" ? " dashboard-badge-muted" : ""}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.source}</td>
                <td>{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!subscribers.length && !error ? (
              <tr>
                <td colSpan={4} style={{ color: "#666" }}>
                  No subscribers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminCmsEditorShell>
  );
}
