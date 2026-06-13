import { AdminCmsEditorShell } from "../../../../components/dashboard/AdminCmsEditorShell";

export default function AboutCmsPage() {
  return (
    <AdminCmsEditorShell
      title="About"
      description="Why us, services sticky list, team, partners — editable via Supabase CMS (Phase 2)."
      publicRoute="/about"
    >
      <div className="dashboard-card">
        <h2>Editable slices</h2>
        <ul className="admin-cms-placeholder">
          <li>Headline + intro copy</li>
          <li>Sticky services (6 cards)</li>
          <li>Team members + units</li>
          <li>Partners carousel</li>
        </ul>
        <p className="admin-cms-placeholder" style={{ marginTop: "1rem" }}>
          Tables: <code>services</code>, <code>team_members</code>, <code>partners</code> (seeded in Supabase).
        </p>
      </div>
    </AdminCmsEditorShell>
  );
}
