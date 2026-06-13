"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsDraftActions } from "../AdminCmsDraftActions";
import { AdminCmsTabBar, AdminCmsTabPanel } from "../AdminCmsTabBar";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { AdminPublishStatusModal } from "../AdminPublishStatusModal";
import { SyncStatusIndicator } from "../SyncStatusIndicator";
import { useJsonDraftBaseline } from "../useJsonDraftBaseline";

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "discover", label: "Discover" },
  { id: "featured", label: "Featured" },
  { id: "newsletter", label: "Newsletter" },
];

export function HomeDataEditor() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [modal, setModal] = useState({ open: false, status: "loading", message: "" });
  const [lastSynced, setLastSynced] = useState("");
  const [initial, setInitial] = useState(null);
  const { data, setData, dirty, markSaved } = useJsonDraftBaseline(initial);

  const loadDraft = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/home-config?view=draft");
    const json = await res.json();
    setInitial(json.data || {});
    setLastSynced(new Date().toLocaleString());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  async function persist(intent) {
    const isPublish = intent === "publish";
    if (isPublish) setPublishing(true);
    else setSaving(true);

    setModal({ open: true, status: "loading", message: "" });

    const res = await fetch("/api/home-config?view=draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, intent }),
    });
    const json = await res.json();

    if (!res.ok) {
      setModal({ open: true, status: "error", message: json.error || "Save failed" });
    } else {
      markSaved(json.data);
      setLastSynced(new Date().toLocaleString());
      setModal({
        open: true,
        status: "success",
        message: isPublish ? "Live homepage will update after revalidation." : "Draft saved.",
      });
    }

    setSaving(false);
    setPublishing(false);
  }

  function updateHero(field, value) {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  }

  function updateSection(section, field, value) {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }

  return (
    <AdminCmsEditorShell
      title="Home"
      description="Hero copy, discover cards, featured projects, footer newsletter — draft/publish via /api/home-config."
      publicRoute="/"
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
      <SyncStatusIndicator lastSynced={lastSynced} onSync={loadDraft} syncing={loading} />

      <AdminCmsInitialSkeletonGate loading={loading}>
        <div className="dashboard-card">
          <AdminCmsTabBar tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

          <AdminCmsTabPanel id="hero" activeId={activeTab}>
            <div className="dashboard-form" style={{ marginTop: "1rem" }}>
              <div className="dashboard-field">
                <label>Headline (H1)</label>
                <input
                  value={data.hero?.heading || ""}
                  onChange={(e) => updateHero("heading", e.target.value)}
                />
              </div>
              <div className="dashboard-field">
                <label>Description</label>
                <textarea
                  value={data.hero?.description || ""}
                  onChange={(e) => updateHero("description", e.target.value)}
                />
              </div>
              <div className="dashboard-field-row">
                <div className="dashboard-field">
                  <label>Primary CTA label</label>
                  <input
                    value={data.hero?.primaryCta || ""}
                    onChange={(e) => updateHero("primaryCta", e.target.value)}
                  />
                </div>
                <div className="dashboard-field">
                  <label>Primary CTA link</label>
                  <input
                    value={data.hero?.primaryLink || ""}
                    onChange={(e) => updateHero("primaryLink", e.target.value)}
                  />
                </div>
              </div>
              <div className="dashboard-field">
                <label>Service tags (marquee, comma-separated)</label>
                <input
                  value={(data.hero?.serviceTags || []).join(", ")}
                  onChange={(e) =>
                    updateHero(
                      "serviceTags",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
            </div>
          </AdminCmsTabPanel>

          <AdminCmsTabPanel id="discover" activeId={activeTab}>
            <div className="dashboard-form" style={{ marginTop: "1rem" }}>
              <label className="dashboard-checkbox">
                <input
                  type="checkbox"
                  checked={data.discover?.enabled ?? true}
                  onChange={(e) => updateSection("discover", "enabled", e.target.checked)}
                />
                Show Discover section (About + Works cards)
              </label>
            </div>
          </AdminCmsTabPanel>

          <AdminCmsTabPanel id="featured" activeId={activeTab}>
            <div className="dashboard-form" style={{ marginTop: "1rem" }}>
              <label className="dashboard-checkbox">
                <input
                  type="checkbox"
                  checked={data.featuredProjects?.showProjects ?? true}
                  onChange={(e) => updateSection("featuredProjects", "showProjects", e.target.checked)}
                />
                Show projects carousel
              </label>
            </div>
          </AdminCmsTabPanel>

          <AdminCmsTabPanel id="newsletter" activeId={activeTab}>
            <div className="dashboard-form" style={{ marginTop: "1rem" }}>
              <label className="dashboard-checkbox">
                <input
                  type="checkbox"
                  checked={data.newsletter?.footerEnabled ?? true}
                  onChange={(e) => updateSection("newsletter", "footerEnabled", e.target.checked)}
                />
                Footer newsletter signup enabled
              </label>
              <div className="dashboard-field">
                <label>Footer headline</label>
                <input
                  value={data.newsletter?.headline || ""}
                  onChange={(e) => updateSection("newsletter", "headline", e.target.value)}
                />
              </div>
            </div>
          </AdminCmsTabPanel>
        </div>
      </AdminCmsInitialSkeletonGate>

      <p className="admin-cms-placeholder" style={{ marginTop: "1rem" }}>
        Public homepage still reads hardcoded JSX until wired to <code>GET /api/home-config?view=published</code>.
      </p>

      <AdminPublishStatusModal
        open={modal.open}
        status={modal.status}
        message={modal.message}
        onClose={() => setModal({ open: false, status: "loading", message: "" })}
      />
    </AdminCmsEditorShell>
  );
}
