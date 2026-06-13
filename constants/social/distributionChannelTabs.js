/** Top-level channel tabs — horizontal bar, not sidebar */

export const CHANNEL_PAGE_TABS = [
  { id: "social", label: "Social", hub: true, portalKey: null },
  { id: "linkedin", label: "LinkedIn", hub: false, portalKey: "linkedin", linkUpId: "linkedin" },
  { id: "instagram", label: "Instagram", hub: false, portalKey: "instagram", linkUpId: "instagram" },
  { id: "snapchat", label: "Snapchat", hub: false, portalKey: "snapchat", linkUpId: "snapchat" },
  { id: "facebook", label: "Facebook", hub: false, portalKey: "facebook", linkUpId: "facebook" },
  { id: "whatsapp", label: "WhatsApp", hub: false, portalKey: "whatsapp", linkUpId: "whatsapp" },
  { id: "direct", label: "Direct", hub: true, portalKey: null },
  { id: "website", label: "Website", hub: false, portalKey: "website", linkUpId: "website" },
  { id: "email", label: "Email", hub: false, portalKey: "email", linkUpId: null },
  { id: "referral", label: "Referral / Partner", hub: false, portalKey: "referral", linkUpId: null },
];

export const CHANNEL_PAGES_BASE = "/dashboard/channels";

export function getChannelTab(id) {
  return CHANNEL_PAGE_TABS.find((t) => t.id === id);
}

export function getChannelTabPath(id) {
  return `${CHANNEL_PAGES_BASE}/${id}`;
}

export const SOCIAL_HUB_CHANNELS = ["linkedin", "instagram", "snapchat", "facebook", "whatsapp"];
export const DIRECT_HUB_CHANNELS = ["website", "email", "referral"];
