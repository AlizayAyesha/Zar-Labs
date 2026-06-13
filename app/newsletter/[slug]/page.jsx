import { notFound } from "next/navigation";
import { buildPageMetadata } from "../../../lib/seo/build-metadata";
import { JsonLd } from "../../../components/seo/JsonLd";
import { SITE_URL } from "../../../lib/seo/site";
import { getWebsiteData } from "../../../lib/cms/website-data";
import { getNewsletterBySlug, getPublishedNewsletters } from "../../../lib/newsletter/registry";
import { NewsletterDetail } from "./NewsletterDetail";

export async function generateStaticParams() {
  const data = await getWebsiteData("published");
  return getPublishedNewsletters(data).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const data = await getWebsiteData("published");
  const newsletter = getNewsletterBySlug(data, params.slug);

  if (!newsletter || newsletter.status !== "published") {
    return { title: "Newsletter not found | Zar Labs" };
  }

  return buildPageMetadata({
    title: newsletter.seoTitle || `${newsletter.title} | Zar Labs Newsletter`,
    description: newsletter.seoDescription || newsletter.summary,
    path: `/newsletter/${newsletter.slug}`,
    ogType: "article",
  });
}

export default async function NewsletterSlugPage({ params }) {
  const data = await getWebsiteData("published");
  const newsletter = getNewsletterBySlug(data, params.slug);

  if (!newsletter || newsletter.status !== "published") {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: newsletter.title,
    description: newsletter.summary,
    url: `${SITE_URL}/newsletter/${newsletter.slug}`,
    datePublished: newsletter.publishedAt,
    author: { "@type": "Organization", name: "Zar Labs" },
    publisher: { "@type": "Organization", name: "Zar Labs", url: SITE_URL },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <NewsletterDetail newsletter={newsletter} />
    </>
  );
}
