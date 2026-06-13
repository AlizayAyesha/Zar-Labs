"use client";

import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { PublishingHubCards } from "./PublishingHubCards";

export function PublishingHubDashboard() {
  return (
    <AdminCmsEditorShell
      title="Publishing"
      description="Plan your week, fill the calendar, and create on-brand images from any post slot."
    >
      <PublishingHubCards title={null} />
    </AdminCmsEditorShell>
  );
}
