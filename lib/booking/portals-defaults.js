import { ALL_CHANNEL_KEYS, CHANNEL_META } from "../../constants/booking/channelGroups";
import { PORTAL_CONVERSION_PACKS } from "../../constants/booking/portalConversionPacks";

function buildDefaultPortal(channelKey) {
  const meta = CHANNEL_META[channelKey];
  const pack = PORTAL_CONVERSION_PACKS[channelKey];
  return {
    channelKey,
    slug: meta.defaultSlug,
    enabled: true,
    hidden: false,
    headline: pack.headline,
    subheadline: pack.subheadline,
    ctaLabel: pack.ctaLabel,
    ctaUrl: "",
    trustBullets: [...pack.trustBullets],
    tiers: pack.tiers.map((t) => ({ ...t })),
    faq: pack.faq.map((f) => ({ ...f })),
  };
}

export function buildDefaultBookingPortalsData() {
  const portals = {};
  for (const key of ALL_CHANNEL_KEYS) {
    portals[key] = buildDefaultPortal(key);
  }
  return {
    portals,
    uiPrefs: { hiddenChannels: [] },
  };
}

/** Fill in snapchat / facebook / whatsapp (etc.) when CMS data predates new channels */
export function mergeBookingPortalsData(stored) {
  const defaults = buildDefaultBookingPortalsData();
  if (!stored?.portals || !Object.keys(stored.portals).length) return defaults;

  const portals = { ...defaults.portals };
  for (const key of ALL_CHANNEL_KEYS) {
    portals[key] = stored.portals[key]
      ? { ...defaults.portals[key], ...stored.portals[key], channelKey: key }
      : defaults.portals[key];
  }

  return {
    ...defaults,
    ...stored,
    portals,
    uiPrefs: { ...defaults.uiPrefs, ...stored.uiPrefs },
  };
}
