"use client";

export function AdminCmsDraftActions({
  onSaveDraft,
  onPublish,
  saving = false,
  publishing = false,
  dirty = false,
}) {
  return (
    <div className="admin-cms-draft-actions">
      {dirty ? <span className="admin-cms-unsaved">Unsaved changes</span> : null}
      <button type="button" className="dashboard-btn" onClick={onSaveDraft} disabled={saving || publishing}>
        {saving ? "Saving draft…" : "Save Draft"}
      </button>
      <button
        type="button"
        className="dashboard-btn dashboard-btn-primary"
        onClick={onPublish}
        disabled={saving || publishing}
      >
        {publishing ? "Publishing…" : "Publish"}
      </button>
    </div>
  );
}
