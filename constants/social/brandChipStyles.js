import { PUBLISHING_BRANDS } from "./publishingBrands";

export const BRAND_CHIP_STYLES = Object.fromEntries(
  PUBLISHING_BRANDS.map((b) => [
    b.id,
    {
      badge: { background: `${b.color}22`, color: b.color, borderColor: `${b.color}55` },
      bar: { background: b.color },
    },
  ])
);

export function getBrandStyle(brandId) {
  return BRAND_CHIP_STYLES[brandId] || BRAND_CHIP_STYLES.build;
}
