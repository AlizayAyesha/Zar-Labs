import { getCmsCollection, saveCmsCollection } from "../cms/cms-store";
import { ALL_CHANNEL_KEYS } from "../../constants/booking/channelGroups";
import { buildDefaultBookingPortalsData, mergeBookingPortalsData } from "./portals-defaults";

export { buildDefaultBookingPortalsData, mergeBookingPortalsData } from "./portals-defaults";

export async function getBookingPortalsData(view = "draft") {
  const stored = await getCmsCollection("booking-portals", view);
  if (stored?.portals && Object.keys(stored.portals).length) {
    return mergeBookingPortalsData(stored);
  }
  if (view === "draft") {
    const published = await getCmsCollection("booking-portals", "published");
    if (published?.portals) return mergeBookingPortalsData(published);
  }
  return buildDefaultBookingPortalsData();
}

export async function saveBookingPortalsData(view, data) {
  return saveCmsCollection("booking-portals", view, data, {
    page: "booking-crm",
    section: "portals",
  });
}

export function getVisiblePortals(data) {
  const hidden = new Set(data?.uiPrefs?.hiddenChannels || []);
  return ALL_CHANNEL_KEYS.filter((key) => {
    const portal = data?.portals?.[key];
    if (!portal) return false;
    if (hidden.has(key)) return false;
    return portal.enabled !== false;
  }).map((key) => data.portals[key]);
}

export function getPortalBySlug(data, slug) {
  const portals = data?.portals || {};
  return Object.values(portals).find((p) => p.slug === slug && p.enabled !== false) || null;
}
