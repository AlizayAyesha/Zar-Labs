"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { GOOGLE_SHEETS_HEADERS, GOOGLE_SHEETS_RANGE } from "../../../constants/booking/interaction-sources";
import { WEBSITE_CMS_PATHS } from "../../../constants/websiteCmsPaths";

export function SheetsRecordsClient() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/dashboard/booking-crm/submissions");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not load records");
      setLoading(false);
      return;
    }
    setSubmissions(json.submissions || []);
    setSubscribers(json.subscribers || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminCmsEditorShell
      title="Sheets Records"
      description="Form submissions from Supabase. Google Sheets mirror is Phase 2 — column layout is pre-configured below."
      actions={
        <button type="button" className="dashboard-btn" onClick={load} disabled={loading}>
          Refresh
        </button>
      }
    >
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card">
        <h2>Google Sheets (Phase 2)</h2>
        <p className="admin-cms-placeholder">
          Range: <code>{GOOGLE_SHEETS_RANGE}</code> — headers: {GOOGLE_SHEETS_HEADERS.join(", ")}
        </p>
      </div>

      <div className="dashboard-card">
        <h2>Newsletter subscribers</h2>
        <p className="admin-cms-placeholder">
          Full export in{" "}
          <Link href={WEBSITE_CMS_PATHS.newsletter.subscribers}>Newsletter → Subscribers</Link>. Showing latest{" "}
          {subscribers.length} here.
        </p>
        <AdminCmsInitialSkeletonGate loading={loading} variant="table">
          {subscribers.length ? (
            <div className="dashboard-table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Created</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((row) => (
                    <tr key={row.id}>
                      <td>{formatDate(row.created_at)}</td>
                      <td>{row.email}</td>
                      <td>
                        <span className="dashboard-badge">{row.status || "active"}</span>
                      </td>
                      <td>{row.source || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-cms-placeholder">No subscribers yet.</p>
          )}
        </AdminCmsInitialSkeletonGate>
      </div>

      <div className="dashboard-card dashboard-table-wrap">
        <h2>Form submissions</h2>
        <AdminCmsInitialSkeletonGate loading={loading} variant="table">
          {submissions.length ? (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Portal</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(row.created_at)}</td>
                    <td>{row.sourceLabel}</td>
                    <td>{row.full_name || "—"}</td>
                    <td>{row.email}</td>
                    <td>{row.subject || "—"}</td>
                    <td>{row.portalSlug ? `/go/${row.portalSlug}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admin-cms-placeholder">
              No form_submissions rows yet. Contact, project intake (Formspree), and portal leads will appear here when
              wired to Supabase.
            </p>
          )}
        </AdminCmsInitialSkeletonGate>
      </div>

      <div className="dashboard-card">
        <h2>Other surfaces</h2>
        <ul className="admin-cms-placeholder">
          <li>
            <strong>Project intake</strong> — Formspree at /project-intake
          </li>
          <li>
            <strong>Contact</strong> — mailto / tel
          </li>
          <li>
            <strong>Channel portals</strong> —{" "}
            <Link href="/dashboard/channels/direct">Channels</Link>
          </li>
        </ul>
      </div>
    </AdminCmsEditorShell>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
