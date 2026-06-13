import { NEWSLETTER_LATEST_TOPICS } from "../seo/newsletter-topics";

/** Default registry seeded from existing 2026 newsletter topics */
export function buildDefaultNewsletterRegistry() {
  return NEWSLETTER_LATEST_TOPICS.map((topic, index) => ({
    id: topic.slug,
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
    body: `${topic.summary}\n\nSource: ${topic.communitySource}`,
    tags: topic.tags,
    communitySource: topic.communitySource,
    status: "published",
    publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
    seoTitle: `${topic.title} | Zar Labs Newsletter`,
    seoDescription: topic.summary,
    heroImage: "",
  }));
}

export function normalizeWebsiteData(raw = {}) {
  const registry = raw.newsletter_posts_registry;
  if (Array.isArray(registry) && registry.length) {
    return { newsletter_posts_registry: registry };
  }
  return { newsletter_posts_registry: buildDefaultNewsletterRegistry() };
}

export function getPublishedNewsletters(data) {
  const normalized = normalizeWebsiteData(data);
  return normalized.newsletter_posts_registry
    .filter((item) => item.status === "published")
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

export function getNewsletterBySlug(data, slug) {
  const normalized = normalizeWebsiteData(data);
  return normalized.newsletter_posts_registry.find((item) => item.slug === slug) || null;
}

export function upsertRegistryItem(registry, item) {
  const list = [...registry];
  const index = list.findIndex((row) => row.id === item.id || row.slug === item.slug);
  if (index >= 0) list[index] = { ...list[index], ...item };
  else list.unshift(item);
  return list;
}
