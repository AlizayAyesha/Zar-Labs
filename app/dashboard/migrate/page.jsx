"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminCmsEditorShell } from "../../../components/dashboard/AdminCmsEditorShell";

export default function MigratePage() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => setCounts(data.counts))
      .catch(() => setCounts({}));
    const interval = setInterval(() => {
      fetch("/api/dashboard/stats")
        .then((r) => r.json())
        .then((data) => setCounts(data.counts))
        .catch(() => {});
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const rows = [
    { label: "Newsletter subscribers", count: counts?.newsletterSubscribers, href: "/dashboard/booking-crm/sheets-records#newsletter" },
    { label: "Case studies (DB)", count: counts?.caseStudies, href: "/dashboard/site-system/case-studies" },
    { label: "FAQ items (DB)", count: counts?.faqs, href: "/dashboard/site-system/faq" },
    { label: "Site videos (DB)", count: counts?.videos, href: "/dashboard/site-system/videos" },
    { label: "Home CMS", count: "—", href: "/dashboard/site-system/home" },
  ];

  return (
    <AdminCmsEditorShell
      title="Website ↔ Supabase"
      description="Live counts from Supabase. Public site still reads hardcoded JS for most content until publish wiring completes."
    >
      <div className="dashboard-card dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>Count</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.count ?? "—"}</td>
                <td>
                  <Link href={row.href} className="dashboard-btn">
                    Open editor
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-card">
        <h2>Sync status</h2>
        <ul className="admin-cms-placeholder">
          <li>✅ Newsletter signups → Supabase (live)</li>
          <li>✅ Homepage videos → Supabase (live)</li>
          <li>⚠️ Case studies, FAQ, settings — DB seeded; public pages use JS files</li>
          <li>❌ Home/About section CMS — Phase 2</li>
        </ul>
      </div>
    </AdminCmsEditorShell>
  );
}
