"use client";

import { useMemo, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsTabBar, AdminCmsTabPanel } from "../AdminCmsTabBar";
import { AdminCmsFilterToolbar } from "../AdminCmsFilterToolbar";
import {
  SOCIAL_PLATFORM_CATEGORIES,
  getChannelsForCategory,
  getChannelTypes,
} from "../../../constants/social/socialChannelCatalog";
import { createPreviewTask } from "../../../lib/publishing-calendar/taskFactory";
import { ProductionPanelModal } from "./publishing-calendar/ProductionPanelModal";

export function LinkUpsCollection() {
  const [activeCategory, setActiveCategory] = useState("social");
  const [search, setSearch] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("linkedin");
  const [previewTask, setPreviewTask] = useState(null);

  const channels = useMemo(() => {
    let list = getChannelsForCategory(activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.label.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const channelTypes = selectedChannel ? getChannelTypes(selectedChannel.id) : [];

  const tabs = SOCIAL_PLATFORM_CATEGORIES.map((c) => ({ id: c.id, label: c.label }));

  function openPreview(channel, typeEntry) {
    setPreviewTask(createPreviewTask(channel, typeEntry));
  }

  return (
    <AdminCmsEditorShell
      title="Link Ups"
      description="Preview production panel templates per channel — no calendar tasks created."
    >
      <div className="dashboard-card">
        <AdminCmsTabBar tabs={tabs} activeId={activeCategory} onChange={(id) => {
          setActiveCategory(id);
          const first = getChannelsForCategory(id)[0];
          if (first) setSelectedChannelId(first.id);
        }} />

        <AdminCmsFilterToolbar search={search} onSearchChange={setSearch} placeholder="Search channels…" />

        <div className="social-linkups-channels">
          {channels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              className={`dashboard-btn social-channel-chip${selectedChannelId === ch.id ? " is-on" : ""}`}
              onClick={() => setSelectedChannelId(ch.id)}
            >
              {ch.label}
            </button>
          ))}
        </div>

        <AdminCmsTabPanel id={activeCategory} activeId={activeCategory}>
          {selectedChannel ? (
            <div className="social-linkups-types">
              <h3>{selectedChannel.label}</h3>
              <p className="admin-cms-placeholder">{selectedChannel.defaultUrl}</p>
              <div className="dashboard-actions">
                {channelTypes.map((typeEntry) => (
                  <button
                    key={typeEntry.id}
                    type="button"
                    className="dashboard-btn"
                    onClick={() => openPreview(selectedChannel, typeEntry)}
                  >
                    Preview: {typeEntry.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </AdminCmsTabPanel>
      </div>

      {previewTask ? (
        <ProductionPanelModal task={previewTask} preview onClose={() => setPreviewTask(null)} onUpdatePanelState={() => {}} onUpdateTask={() => {}} onDelete={() => setPreviewTask(null)} onDuplicate={() => {}} />
      ) : null}
    </AdminCmsEditorShell>
  );
}
