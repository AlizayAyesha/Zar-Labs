import { AdminCmsEditorShell } from "../../../../components/dashboard/AdminCmsEditorShell";

export default function DiscardedPage() {
  return (
    <AdminCmsEditorShell
      title="Discarded"
      description="Soft-deleted CMS items — restore or permanently delete (Phase 2: localStorage cms_discarded_v1)."
    >
      <div className="dashboard-card">
        <p className="admin-cms-placeholder">No discarded items yet.</p>
      </div>
    </AdminCmsEditorShell>
  );
}
