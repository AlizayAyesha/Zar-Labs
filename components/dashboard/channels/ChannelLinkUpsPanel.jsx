"use client";

import { useMemo, useState } from "react";
import { SOCIAL_CHANNELS, getChannelTypes } from "../../../constants/social/socialChannelCatalog";
import { createPreviewTask } from "../../../lib/publishing-calendar/taskFactory";
import { ProductionPanelModal } from "../social/publishing-calendar/ProductionPanelModal";

export function ChannelLinkUpsPanel({ channelId }) {
  const [previewTask, setPreviewTask] = useState(null);

  const channel = useMemo(
    () => SOCIAL_CHANNELS.find((c) => c.id === channelId) || SOCIAL_CHANNELS.find((c) => c.id === "linkedin"),
    [channelId]
  );

  const channelTypes = channel ? getChannelTypes(channel.id) : [];

  if (!channel) return null;

  return (
    <div className="dashboard-card">
      <h2>Link Ups — {channel.label}</h2>
      <p className="admin-cms-placeholder">{channel.defaultUrl}</p>
      <p className="admin-cms-placeholder">Preview production panel templates for this channel.</p>
      <div className="dashboard-actions">
        {channelTypes.map((typeEntry) => (
          <button
            key={typeEntry.id}
            type="button"
            className="dashboard-btn"
            onClick={() => setPreviewTask(createPreviewTask(channel, typeEntry))}
          >
            Preview: {typeEntry.label}
          </button>
        ))}
      </div>

      {previewTask ? (
        <ProductionPanelModal
          task={previewTask}
          preview
          onClose={() => setPreviewTask(null)}
          onUpdatePanelState={() => {}}
          onUpdateTask={() => {}}
          onDelete={() => setPreviewTask(null)}
          onDuplicate={() => {}}
        />
      ) : null}
    </div>
  );
}
