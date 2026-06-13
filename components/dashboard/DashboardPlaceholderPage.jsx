import { AdminCmsEditorShell } from "./AdminCmsEditorShell";

export function DashboardPlaceholderPage({ title, description, phase2Items = [] }) {
  return (
    <AdminCmsEditorShell title={title} description={description}>
      <div className="dashboard-card">
        <p className="admin-cms-placeholder">
          This module follows the Sh3ikhMABZ dashboard pattern. Phase 2 will wire publishing
          calendar, channel URLs, and post editor to Supabase.
        </p>
        {phase2Items.length ? (
          <ul className="admin-cms-placeholder">
            {phase2Items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </AdminCmsEditorShell>
  );
}
