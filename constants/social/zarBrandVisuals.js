import { BRAND_BY_ID } from "./publishingBrands";

/** Zar Labs site palette — matches globals.css and marketing site */
export const ZAR_SITE_PALETTE = {
  background: "#010101",
  green: "#22c55e",
  gold: "#d4af37",
  grow: "#7dd3a8",
  proof: "#a3a3a3",
  text: "#ffffff",
  muted: "#888888",
};

export const ZAR_IMAGE_COLORS = [ZAR_SITE_PALETTE.background, ZAR_SITE_PALETTE.green, ZAR_SITE_PALETTE.gold];

export function getBrandImageColors(brandId) {
  const brand = BRAND_BY_ID[brandId] || BRAND_BY_ID.build;
  return [ZAR_SITE_PALETTE.background, brand.color, ZAR_SITE_PALETTE.gold];
}

export function getBrandVisualNotes(brandId) {
  const brand = BRAND_BY_ID[brandId] || BRAND_BY_ID.build;
  return `Zar Labs ${brand.shortcut} stream — dark #010101 background, accent ${brand.color}, gold highlights #d4af37. Match zar-labs.vercel.app: minimal, premium B2B tech, high contrast, no clutter.`;
}
