/** Zar Labs Media Library — page tabs and source types */

export const MEDIA_SOURCE_TYPES = {
  CASE_STUDY_HERO: "case-study-hero",
  CASE_STUDY_CAROUSEL: "case-study-carousel",
  CASE_STUDY_GALLERY: "case-study-gallery",
  NEWSLETTER: "newsletter",
  PARTNER_LOGO: "partner-logo",
  PARTNER_IMAGE: "partner-image",
  TEAM_MEMBER: "team-member",
  HOME_FEATURED: "home-featured",
  HOME_MARQUEE: "home-marquee",
  WEBSITE_LOGO: "website-logo",
  WEBSITE_OG_IMAGE: "website-og-image",
};

export const MEDIA_LIBRARY_PAGES = [
  "all",
  "home",
  "about",
  "works",
  "newsletter",
  "certs",
  "contact",
  "faq",
];

export const MEDIA_LIBRARY_PAGE_LABELS = {
  all: "All Pages",
  home: "Home",
  about: "About",
  works: "Works / Portfolio",
  newsletter: "Posts",
  certs: "Certs & Logos",
  contact: "Contact",
  faq: "FAQ",
};

/** Page tab filters — certs aggregates logo-style assets from multiple pages */
export const MEDIA_LIBRARY_PAGE_FILTER = {
  certs: (asset) =>
    asset.sourceType === MEDIA_SOURCE_TYPES.HOME_MARQUEE ||
    asset.sourceType === MEDIA_SOURCE_TYPES.WEBSITE_LOGO ||
    asset.sourceType === MEDIA_SOURCE_TYPES.WEBSITE_OG_IMAGE ||
    asset.sourceType === MEDIA_SOURCE_TYPES.PARTNER_LOGO,
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function assetDedupeKey(asset) {
  return [asset.sourceType, asset.sourceId, asset.type, asset.url, asset.page, asset.section].join("|");
}

export function formatFileSize(bytes) {
  if (!bytes || Number.isNaN(bytes)) return "Unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
