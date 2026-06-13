/** Zar Labs publishing streams — BUILD / AI / GROW / PROOF */

export const PUBLISHING_BRANDS = [
  {
    id: "build",
    label: "Build & Engineering",
    shortcut: "BUILD",
    color: "#22c55e",
    researchUrl: "https://chat.openai.com/",
    enabled: true,
  },
  {
    id: "ai",
    label: "AI & Automation",
    shortcut: "AI",
    color: "#d4af37",
    researchUrl: "https://chat.openai.com/",
    enabled: true,
  },
  {
    id: "grow",
    label: "Growth, SEO & GEO",
    shortcut: "GROW",
    color: "#7dd3a8",
    researchUrl: "https://chat.openai.com/",
    enabled: true,
  },
  {
    id: "proof",
    label: "Proof & Partnerships",
    shortcut: "PROOF",
    color: "#a3a3a3",
    researchUrl: "https://chat.openai.com/",
    enabled: true,
  },
];

export const DEFAULT_TIMEZONE = "Asia/Karachi";

export const BRAND_BY_ID = Object.fromEntries(PUBLISHING_BRANDS.map((b) => [b.id, b]));
