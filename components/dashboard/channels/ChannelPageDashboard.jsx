"use client";

import Link from "next/link";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { AdminCmsDraftActions } from "../AdminCmsDraftActions";
import { AdminCmsInitialSkeletonGate } from "../AdminCmsInitialSkeletonGate";
import { AdminPublishStatusModal } from "../AdminPublishStatusModal";
import { ChannelHubDashboard } from "./ChannelHubDashboard";
import { ChannelLinkUpsPanel } from "./ChannelLinkUpsPanel";
import { ChannelPortalEditor, resetPortalDefaults } from "./ChannelPortalEditor";
import { ChannelSitewideCtas } from "./ChannelSitewideCtas";
import { getChannelTab } from "../../../constants/social/distributionChannelTabs";
import { useBookingPortals } from "../../../hooks/useBookingPortals";
import { useState } from "react";

export function ChannelPageDashboard({ channelId }) {
  const tab = getChannelTab(channelId);
  const { loading, data, dirty, error, updatePortal, toggleHidden, persist, hidden } = useBookingPortals();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [modal, setModal] = useState({ open: false, status: "loading", message: "" });

  if (!tab) {
    return (
      <AdminCmsEditorShell title="Channel not found">
        <p className="dashboard-alert dashboard-alert-error">Unknown channel.</p>
        <Link href="/dashboard/channels/social" className="dashboard-btn">
          Back to Social
        </Link>
      </AdminCmsEditorShell>
    );
  }

  async function handlePersist(intent) {
    const isPublish = intent === "publish";
    if (isPublish) setPublishing(true);
    else setSaving(true);
    setModal({ open: true, status: "loading", message: "" });
    try {
      await persist(intent);
      setModal({
        open: true,
        status: "success",
        message: isPublish ? "Published. Public /go/* portals updated." : "Draft saved.",
      });
    } catch (err) {
      setModal({ open: true, status: "error", message: err.message });
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }

  const portalKey = tab.portalKey;
  const portal = portalKey ? data.portals?.[portalKey] : null;
  const showDraftActions = Boolean(portalKey);

  return (
    <AdminCmsEditorShell
      title={tab.label}
      description={
        tab.hub
          ? `Overview — pick a channel tab above.`
          : `Booking portal, link-ups, and templates for ${tab.label}.`
      }
      actions={
        showDraftActions ? (
          <AdminCmsDraftActions
            onSaveDraft={() => handlePersist("saveDraft")}
            onPublish={() => handlePersist("publish")}
            saving={saving}
            publishing={publishing}
            dirty={dirty}
          />
        ) : null
      }
    >
      {error ? <div className="dashboard-alert dashboard-alert-error">{error}</div> : null}

      {tab.id === "direct" ? <ChannelSitewideCtas /> : null}

      {tab.hub ? (
        <ChannelHubDashboard variant={tab.id === "social" ? "social" : "direct"} />
      ) : (
        <AdminCmsInitialSkeletonGate loading={loading} variant="cards">
          {tab.linkUpId ? <ChannelLinkUpsPanel channelId={tab.linkUpId} /> : null}
          {portalKey && portal ? (
            <ChannelPortalEditor
              channelKey={portalKey}
              portal={portal}
              hidden={hidden}
              onUpdatePortal={updatePortal}
              onToggleHidden={toggleHidden}
              onResetDefaults={(key) => resetPortalDefaults(key, updatePortal)}
            />
          ) : null}
        </AdminCmsInitialSkeletonGate>
      )}

      <AdminPublishStatusModal
        open={modal.open}
        status={modal.status}
        message={modal.message}
        onClose={() => setModal({ open: false, status: "loading", message: "" })}
      />
    </AdminCmsEditorShell>
  );
}
