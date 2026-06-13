import { CASE_STUDIES } from "./works/case-studies-data";
import { ALL_FAQ_ITEMS } from "../lib/seo/faq-data";
import { SITE_URL } from "../lib/seo/site";
import { getWebsiteData } from "../lib/cms/website-data";
import { getPublishedNewsletters } from "../lib/newsletter/registry";
import { getBookingPortalsData } from "../lib/booking/portals-store";

export default async function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "weekly" },
    { path: "/works", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "weekly" },
    { path: "/project-intake", priority: 0.85, changeFrequency: "monthly" },
    { path: "/newsletter", priority: 0.9, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "weekly" },
    { path: "/answers", priority: 0.75, changeFrequency: "weekly" },
    { path: "/faq.json", priority: 0.5, changeFrequency: "weekly" },
    { path: "/entity.json", priority: 0.5, changeFrequency: "weekly" },
    { path: "/ai-profile.json", priority: 0.5, changeFrequency: "weekly" },
    { path: "/llms.txt", priority: 0.5, changeFrequency: "weekly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.4, changeFrequency: "yearly" },
  ];

  const caseStudyRoutes = CASE_STUDIES.map((study) => ({
    path: `/works/${study.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const answerRoutes = ALL_FAQ_ITEMS.map((item) => ({
    path: `/answers/${item.id}`,
    priority: 0.72,
    changeFrequency: "monthly",
  }));

  const data = await getWebsiteData("published");
  const newsletterRoutes = getPublishedNewsletters(data).map((item) => ({
    path: `/newsletter/${item.slug}`,
    priority: 0.85,
    changeFrequency: "weekly",
  }));

  const portalData = await getBookingPortalsData("published");
  const portalRoutes = Object.values(portalData.portals || {})
    .filter((p) => p?.slug && p.enabled !== false)
    .map((p) => ({
      path: `/go/${p.slug}`,
      priority: 0.8,
      changeFrequency: "weekly",
    }));

  return [...staticRoutes, ...caseStudyRoutes, ...answerRoutes, ...newsletterRoutes, ...portalRoutes].map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
