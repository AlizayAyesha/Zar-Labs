import { ALL_FAQ_ITEMS, getFaqAnswerPath } from "../../lib/seo/faq-data";
import { buildEntityJson } from "../../lib/seo/build-entity-json";
import { PARTNERSHIP_NOTE, SERVICE_CATEGORIES, SERVICE_PROFILE_BULLETS } from "../../lib/seo/services-data";
import { NEWSLETTER_LATEST_TOPICS } from "../../lib/seo/newsletter-topics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SAME_AS } from "../../lib/seo/site";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return Response.json(
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      sameAs: SAME_AS,
      services: SERVICE_PROFILE_BULLETS,
      serviceCategories: SERVICE_CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        capabilities: c.items,
      })),
      partnership: PARTNERSHIP_NOTE,
      newsletter: {
        url: `${SITE_URL}/newsletter`,
        focus: "Latest 2026 topics: agentic AI, GEO/AEO, AI crawlers, MCP integrations",
        latestTopics: NEWSLETTER_LATEST_TOPICS.map((t) => ({
          title: t.title,
          url: `${SITE_URL}/newsletter/${t.slug}`,
        })),
      },
      answers: ALL_FAQ_ITEMS.map((item) => ({
        question: item.q,
        url: `${SITE_URL}${getFaqAnswerPath(item.id)}`,
      })),
      machineReadable: {
        faq: `${SITE_URL}/faq.json`,
        entity: `${SITE_URL}/entity.json`,
        llms: `${SITE_URL}/llms.txt`,
        answersHub: `${SITE_URL}/answers`,
      },
      schemaGraph: buildEntityJson()["@graph"],
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}
