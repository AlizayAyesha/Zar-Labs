"use client";

export function SyncStatusIndicator({ lastSynced, onSync, syncing = false }) {
  return (
    <div className="admin-cms-sync-status">
      <span>{lastSynced ? `Last synced: ${lastSynced}` : "Not synced yet"}</span>
      {onSync ? (
        <button type="button" className="dashboard-btn" onClick={onSync} disabled={syncing}>
          {syncing ? "Syncing…" : "Sync now"}
        </button>
      ) : null}
    </div>
  );
}
