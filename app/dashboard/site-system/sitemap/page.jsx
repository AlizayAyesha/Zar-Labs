import { AdminCmsEditorShell } from "../../../../components/dashboard/AdminCmsEditorShell";
import { SITE_URL } from "../../../../lib/seo/site";

export default function SitemapControlsPage() {
  return (
    <AdminCmsEditorShell
      title="Sitemap Controls"
      description="Dynamic sitemap from app/sitemap.jsx — Phase 2: per-route toggles and portal routes."
      publicRoute="/sitemap.xml"
    >
      <div className="dashboard-card">
        <p className="admin-cms-placeholder">
          Live sitemap:{" "}
          <a href={`${SITE_URL}/sitemap.xml`} target="_blank" rel="noopener noreferrer">
            {SITE_URL}/sitemap.xml
          </a>
        </p>
        <p className="admin-cms-placeholder" style={{ marginTop: "0.75rem" }}>
          API (Phase 2): <code>/api/sitemap-config</code>, regenerate + publish actions.
        </p>
      </div>
    </AdminCmsEditorShell>
  );
}
