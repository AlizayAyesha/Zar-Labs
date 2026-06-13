export const SITE_NAME = "Zar Labs";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://zar-labs.vercel.app").replace(
  /\/$/,
  ""
);
export const SITE_HOST = new URL(SITE_URL).host;
export const SITE_TAGLINE =
  "Custom software, AI automation, and digital products for businesses that need measurable outcomes.";
export const SITE_DESCRIPTION =
  "Zar Labs builds websites, SaaS platforms, AI automation, and integrations for startups and enterprises across the US, UK, UAE, and beyond.";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";
export const TWITTER_HANDLE = "@zarlabs";

export const SAME_AS = [
  "https://www.instagram.com/zar_labs/",
  "https://x.com/zarlabs",
];
