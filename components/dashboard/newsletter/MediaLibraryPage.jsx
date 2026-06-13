"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsDraftActions } from "../AdminCmsDraftActions";
import { AdminCmsTabBar, AdminCmsTabPanel } from "../AdminCmsTabBar";
import { AdminCmsFilterToolbar } from "../AdminCmsFilterToolbar";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { AdminPublishStatusModal } from "../AdminPublishStatusModal";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import {
  MEDIA_LIBRARY_PAGES,
  MEDIA_LIBRARY_PAGE_LABELS,
  MEDIA_LIBRARY_PAGE_FILTER,
  formatFileSize,
} from "../../../lib/media/constants";
import { MediaLibraryWorkflowGuide } from "./MediaLibraryWorkflowGuide";
import { readFileAsDataUrl, validateImageUpload } from "../../../lib/media/upload-validation";

const PAGE_TABS = MEDIA_LIBRARY_PAGES.map((id) => ({
  id,
  label: MEDIA_LIBRARY_PAGE_LABELS[id] || id,
}));

export function MediaLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastSynced, setLastSynced] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, status: "loading", message: "" });
  const baselineRef = useRef("[]");
  const prevSyncedRef = useRef([]);

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/media-library-data?view=draft");
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not load media library");
      setLoading(false);
      return;
    }
    const loaded = json.data?.assets || [];
    setAssets(loaded);
    baselineRef.current = JSON.stringify(loaded);
    prevSyncedRef.current = loaded.map((a) => ({ ...a }));
    setDirty(false);
    setLastSynced(new Date().toLocaleString());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  useEffect(() => {
    setDirty(JSON.stringify(assets) !== baselineRef.current);
  }, [assets]);

  const filteredAssets = useMemo(() => {
    let list = assets;
    if (activePage !== "all") {
      const customFilter = MEDIA_LIBRARY_PAGE_FILTER[activePage];
      list = customFilter ? list.filter(customFilter) : list.filter((a) => a.page === activePage);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.context?.toLowerCase().includes(q) ||
          a.section?.toLowerCase().includes(q) ||
          a.altText?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, activePage, search]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const asset of filteredAssets) {
      const key = asset.section || asset.source || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(asset);
    }
    return [...map.entries()];
  }, [filteredAssets]);

  function updateAsset(id, patch) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function removeAsset(id) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    setNotice("Removed from library. Save Draft to sync sources / persist.");
  }

  async function handleReplace(assetId, file) {
    const validationError = validateImageUpload(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    updateAsset(assetId, {
      url: dataUrl,
      name: file.name,
      size: formatFileSize(file.size),
      date: new Date().toISOString().slice(0, 10),
    });
    setNotice("Preview updated. Save Draft to write to draft; Publish to show on the public site.");
    setError("");
  }

  async function persist(intent) {
    const isPublish = intent === "publish";
    if (isPublish) setPublishing(true);
    else setSaving(true);

    setModal({ open: true, status: "loading", message: "" });

    const res = await fetch("/api/media-library-data?view=draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assets, intent }),
    });
    const json = await res.json();

    if (!res.ok) {
      setModal({ open: true, status: "error", message: json.error || "Save failed" });
    } else {
      const saved = json.data?.assets || assets;
      setAssets(saved);
      baselineRef.current = JSON.stringify(saved);
      prevSyncedRef.current = saved.map((a) => ({ ...a }));
      setDirty(false);
      setLastSynced(new Date().toLocaleString());
      setNotice("");
      setModal({
        open: true,
        status: "success",
        message: isPublish
          ? `Published. Synced ${JSON.stringify(json.syncResults || {})}`
          : "Draft saved. Linked CMS records updated in draft view.",
      });
    }

    setSaving(false);
    setPublishing(false);
  }

  return (
    <AdminCmsEditorShell
      title="Media Library"
      description="Bootstrap → edit → Save Draft → Publish. One hub for Home, Works, Newsletter posts, About, and site logos."
      actions={
        <AdminCmsDraftActions
          onSaveDraft={() => persist("saveDraft")}
          onPublish={() => persist("publish")}
          saving={saving}
          publishing={publishing}
          dirty={dirty}
        />
      }
    >
      <MediaLibraryWorkflowGuide />

      <SyncStatusIndicator lastSynced={lastSynced} onSync={loadLibrary} syncing={loading} />

      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}
      {notice ? <div className="dashboard-alert dashboard-alert-success">{notice}</div> : null}

      <div className="dashboard-card">
        <AdminCmsTabBar tabs={PAGE_TABS} activeId={activePage} onChange={setActivePage} />

        <div className="media-library-toolbar">
          <AdminCmsFilterToolbar search={search} onSearchChange={setSearch} placeholder="Search filename, section, title, alt…" />
          <div className="dashboard-actions">
            <button
              type="button"
              className={`dashboard-btn${viewMode === "grid" ? " dashboard-btn-primary" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              className={`dashboard-btn${viewMode === "list" ? " dashboard-btn-primary" : ""}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>

        <AdminCmsInitialSkeletonGate loading={loading} variant="cards">
          {!filteredAssets.length ? (
            <p className="admin-cms-placeholder" style={{ marginTop: "1rem" }}>
              No linked images for this filter. On first load assets bootstrap from Home (featured + tech logos),
              Works case studies, Newsletter posts, About team/partners, and SEO logo fields.
            </p>
          ) : (
            grouped.map(([section, sectionAssets]) => (
              <div key={section} className="media-library-section">
                <h3 className="media-library-section-title">{section}</h3>
                <div className={viewMode === "grid" ? "media-library-grid" : "media-library-list"}>
                  {sectionAssets.map((asset) => (
                    <MediaAssetCard
                      key={asset.id}
                      asset={asset}
                      viewMode={viewMode}
                      onReplace={handleReplace}
                      onDelete={() => removeAsset(asset.id)}
                      onAltChange={(altText) => updateAsset(asset.id, { altText })}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </AdminCmsInitialSkeletonGate>

      </div>

      <AdminPublishStatusModal
        open={modal.open}
        status={modal.status}
        message={modal.message}
        onClose={() => setModal({ open: false, status: "loading", message: "" })}
      />
    </AdminCmsEditorShell>
  );
}

function MediaAssetCard({ asset, viewMode, onReplace, onDelete, onAltChange }) {
  const inputId = `replace-${asset.id}`;

  return (
    <article className={`media-library-card${viewMode === "list" ? " media-library-card--list" : ""}`}>
      <div className="media-library-preview">
        {asset.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.url} alt={asset.altText || asset.name || "Media asset"} />
        ) : (
          <div className="media-library-preview-empty">No image</div>
        )}
      </div>
      <div className="media-library-meta">
        <strong>{asset.context || asset.name}</strong>
        <span className="media-library-meta-sub">
          {asset.source} · {asset.page} · {asset.size}
        </span>
        <label className="media-library-alt-label">
          Alt text
          <textarea
            maxLength={250}
            value={asset.altText || ""}
            onChange={(e) => onAltChange(e.target.value)}
            rows={2}
          />
        </label>
        <div className="dashboard-actions">
          <label htmlFor={inputId} className="dashboard-btn">
            Replace
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onReplace(asset.id, file);
                e.target.value = "";
              }}
            />
          </label>
          <button type="button" className="dashboard-btn dashboard-btn-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
