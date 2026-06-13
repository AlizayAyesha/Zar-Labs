import { AdminCmsEditorShell } from "../../../../components/dashboard/AdminCmsEditorShell";

export default function ContactCmsPage() {
  return (
    <AdminCmsEditorShell
      title="Contact"
      description="Email, phone, location, Calendly — sync with Site Settings."
      publicRoute="/contact"
    >
      <div className="dashboard-card">
        <p className="admin-cms-placeholder">
          Edit contact fields in{" "}
          <a href="/dashboard/site-system/settings">Site Settings</a>. Public page still reads{" "}
          <code>app/config/contact.js</code> until wired to <code>site_settings</code> table.
        </p>
      </div>
    </AdminCmsEditorShell>
  );
}
