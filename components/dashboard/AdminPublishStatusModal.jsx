"use client";

export function AdminPublishStatusModal({ open, status, message, onClose }) {
  if (!open) return null;

  return (
    <div className="admin-cms-modal-backdrop" onClick={onClose} role="presentation">
      <div className="admin-cms-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{status === "error" ? "Publish failed" : status === "success" ? "Published" : "Publishing…"}</h3>
        {message ? <p>{message}</p> : null}
        {status !== "loading" ? (
          <button type="button" className="dashboard-btn dashboard-btn-primary" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
