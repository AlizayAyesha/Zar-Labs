import { LegalPageLayout } from "../legal/LegalPageLayout";
import { buildPageMetadata } from "../../lib/seo/build-metadata";
import { ALL_FAQ_ITEMS, FAQ_AEO_CRAWLER, FAQ_CORE, getFaqAnswerPath } from "../../lib/seo/faq-data";
import { JsonLd } from "../../components/seo/JsonLd";
import { SITE_URL } from "../../lib/seo/site";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "FAQ — Services, AEO, Crawlers & Newsletter",
  description:
    "Answers about Zar Labs services, AI crawlers, GEO/AEO, Open Graph, JSON exports (faq.json, entity.json, llms.txt), and the latest newsletter topics.",
  path: "/faq",
});

function FaqSection({ title, items }) {
  return (
  <>
    <h2 className="faq-section-title">{title}</h2>
    {items.map((item) => (
      <div key={item.id} id={item.id} className="faq-item">
        <h3 className="faq-question">
          <Link href={getFaqAnswerPath(item.id)} className="legal-inline-link">
            {item.q}
          </Link>
        </h3>
        <p className="faq-answer">{item.a}</p>
      </div>
    ))}
  </>
  );
}

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ALL_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      url: `${SITE_URL}${getFaqAnswerPath(item.id)}`,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
        url: `${SITE_URL}${getFaqAnswerPath(item.id)}`,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <LegalPageLayout title="Frequently Asked Questions">
        <p>
          For the latest 2026 briefs on agentic AI, GEO, and crawlers, see our{" "}
          <Link href="/newsletter" className="legal-inline-link">
            newsletter
          </Link>
          . Dedicated answer pages:{" "}
          <Link href="/answers" className="legal-inline-link">
            /answers
          </Link>
          . Machine-readable FAQ:{" "}
          <a href={`${SITE_URL}/faq.json`} className="legal-inline-link">
            /faq.json
          </a>
        </p>
        <FaqSection title="Services & contact" items={FAQ_CORE} />
        <FaqSection title="AI crawlers, AEO, SERP & newsletter" items={FAQ_AEO_CRAWLER} />
      </LegalPageLayout>
    </>
  );
}
