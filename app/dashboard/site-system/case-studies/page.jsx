"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CaseStudiesDashboardPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/case-studies")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setCaseStudies(data.caseStudies || []);
      })
      .catch(() => setError("Failed to load case studies"));
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Case Studies</h1>
          <p>Portfolio pages at /works/[slug]. Public site still reads case-studies-data.js until wired.</p>
        </div>
      </header>

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <div className="dashboard-card dashboard-table-wrap">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {caseStudies.map((cs) => (
              <tr key={cs.id}>
                <td>{cs.title}</td>
                <td>
                  <code style={{ fontSize: "0.8rem" }}>{cs.slug}</code>
                </td>
                <td>
                  <span className={`dashboard-badge${!cs.isPublished ? " dashboard-badge-muted" : ""}`}>
                    {cs.isPublished ? "Yes" : "Draft"}
                  </span>
                </td>
                <td>
                  <Link href={`/dashboard/site-system/case-studies/${cs.id}`} className="dashboard-btn">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
