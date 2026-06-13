import { SITE_URL } from "../lib/seo/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/dashboard/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
