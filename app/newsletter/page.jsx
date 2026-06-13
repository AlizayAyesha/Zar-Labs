import { buildPageMetadata } from "../../lib/seo/build-metadata";
import { JsonLd } from "../../components/seo/JsonLd";
import { SITE_URL } from "../../lib/seo/site";
import { getWebsiteData } from "../../lib/cms/website-data";
import { getPublishedNewsletters } from "../../lib/newsletter/registry";
import { NewsletterHub } from "./NewsletterHub";

export const metadata = buildPageMetadata({
  title: "Newsletters — Latest AI, GEO & Product Strategy",
  description:
    "Subscribe to Zar Labs newsletters for new 2026 briefs on agentic AI, generative engine optimization, AI crawlers, and community-sourced product intelligence.",
  path: "/newsletter",
});

const newsletterSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Zar Labs Newsletters",
  url: `${SITE_URL}/newsletter`,
  description: "Latest newsletters on AI, GEO, crawlers, and digital product strategy.",
  isPartOf: { "@type": "WebSite", name: "Zar Labs", url: SITE_URL },
};

export default async function Page() {
  const data = await getWebsiteData("published");
  const newsletters = getPublishedNewsletters(data);

  return (
    <>
      <JsonLd data={newsletterSchema} />
      <NewsletterHub newsletters={newsletters} />
    </>
  );
}
