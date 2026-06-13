"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { WEBSITE_CMS_PATHS } from "../../../constants/websiteCmsPaths";

export function NewsletterPostsList() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cms/website-data?view=draft")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setNewsletters(json.data?.newsletter_posts_registry || []);
      })
      .catch(() => setError("Could not load newsletters"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminCmsEditorShell
      title="Newsletters"
      description="Create and publish newsletters for the public hub at /newsletter."
      publicRoute="/newsletter"
      actions={
        <Link href={WEBSITE_CMS_PATHS.newsletter.new} className="dashboard-btn dashboard-btn-primary">
          New newsletter
        </Link>
      }
    >
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      <AdminCmsInitialSkeletonGate loading={loading} variant="table">
        <div className="dashboard-card dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {newsletters.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <code style={{ fontSize: "0.75rem" }}>{item.slug}</code>
                  </td>
                  <td>
                    <span
                      className={`dashboard-badge${item.status !== "published" ? " dashboard-badge-muted" : ""}`}
                    >
                      {item.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "—"}</td>
                  <td>
                    <Link href={WEBSITE_CMS_PATHS.newsletter.edit(item.id)} className="dashboard-btn">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {!newsletters.length && !error ? (
                <tr>
                  <td colSpan={5} style={{ color: "#666" }}>
                    No newsletters yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AdminCmsInitialSkeletonGate>
    </AdminCmsEditorShell>
  );
}
