import { AdminCmsEditorShell } from "../../../../components/dashboard/AdminCmsEditorShell";

export default function DiscoveryCallEmailPage() {
  return (
    <AdminCmsEditorShell
      title="Booking Email"
      description="Email templates for discovery call / Calendly booking notifications."
    >
      <div className="dashboard-card">
        <p className="admin-cms-placeholder">
          Calendly URL is edited in{" "}
          <a href="/dashboard/site-system/settings">Platform Config → Site Settings</a>. Phase 2:{" "}
          <code>/api/discovery-call-config</code> for admin notification templates.
        </p>
      </div>
    </AdminCmsEditorShell>
  );
}
