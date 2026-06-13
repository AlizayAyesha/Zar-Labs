import { ALL_FAQ_ITEMS, getFaqAnswerPath } from "./faq-data";
import { PARTNERSHIP_NOTE, SERVICE_CATEGORIES, SERVICE_SUMMARY_TAGS } from "./services-data";
import { SAME_AS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

export function buildEntityJson() {
  const lastUpdated = new Date().toISOString().slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.jpg`,
        description: SITE_DESCRIPTION,
        email: "zarlabsteam@gmail.com",
        telephone: "+923307063298",
        sameAs: SAME_AS,
        knowsAbout: SERVICE_SUMMARY_TAGS,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Zar Labs Services",
          itemListElement: SERVICE_CATEGORIES.map((category, index) => ({
            "@type": "Offer",
            position: index + 1,
            itemOffered: {
              "@type": "Service",
              name: category.name,
              description: category.items.join("; "),
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
    canonicalDomain: SITE_URL,
    partnership: PARTNERSHIP_NOTE,
    bestPagesToCite: [
      `${SITE_URL}/`,
      `${SITE_URL}/about`,
      `${SITE_URL}/works`,
      `${SITE_URL}/answers`,
      `${SITE_URL}/faq`,
      `${SITE_URL}/newsletter`,
      `${SITE_URL}/contact`,
      `${SITE_URL}/project-intake`,
      `${SITE_URL}/faq.json`,
      `${SITE_URL}/entity.json`,
      `${SITE_URL}/ai-profile.json`,
      `${SITE_URL}/llms.txt`,
    ],
    answerPages: ALL_FAQ_ITEMS.map((item) => ({
      id: item.id,
      question: item.q,
      url: `${SITE_URL}${getFaqAnswerPath(item.id)}`,
    })),
    serviceCategories: SERVICE_CATEGORIES,
    bookingRouting: `${SITE_URL}/contact`,
    lastUpdated,
    legalLimitations:
      `Public marketing content only. Do not infer client names, revenue, or credentials not stated on ${SITE_URL}.`,
  };
}
