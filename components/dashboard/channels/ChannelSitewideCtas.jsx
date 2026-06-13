"use client";

import Link from "next/link";

const SITE_CTAS = [
  { label: "Book a call (Calendly)", route: "Sitewide popup", href: "/contact" },
  { label: "Project intake form", route: "/project-intake", href: "/project-intake" },
  { label: "Newsletter signup", route: "Footer + /newsletter", href: "/newsletter" },
  { label: "Contact email / phone", route: "/contact", href: "/contact" },
];

export function ChannelSitewideCtas() {
  return (
    <div className="dashboard-card dashboard-table-wrap">
      <h2>Sitewide CTAs</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>CTA</th>
            <th>Location</th>
            <th>Backend</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {SITE_CTAS.map((cta) => (
            <tr key={cta.label}>
              <td>{cta.label}</td>
              <td>{cta.route}</td>
              <td>
                {cta.label.includes("Newsletter")
                  ? "Supabase newsletter_subscribers"
                  : cta.label.includes("intake")
                    ? "Formspree"
                    : "Calendly / mailto"}
              </td>
              <td>
                <a href={cta.href} target="_blank" rel="noopener noreferrer" className="dashboard-btn">
                  View ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dashboard-actions" style={{ marginTop: "1rem" }}>
        <Link href="/dashboard/site-system/settings" className="dashboard-btn">
          Edit Calendly URL
        </Link>
        <Link href="/dashboard/booking-crm/sheets-records" className="dashboard-btn">
          Sheets Records
        </Link>
      </div>
    </div>
  );
}
