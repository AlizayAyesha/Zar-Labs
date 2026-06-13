import { notFound } from "next/navigation";
import Link from "next/link";
import { LegalPageLayout } from "../../legal/LegalPageLayout";
import { buildPageMetadata } from "../../../lib/seo/build-metadata";
import { JsonLd } from "../../../components/seo/JsonLd";
import { ALL_FAQ_ITEMS, getFaqBySlug } from "../../../lib/seo/faq-data";
import { SITE_URL } from "../../../lib/seo/site";
import "../answers.css";

export function generateStaticParams() {
  return ALL_FAQ_ITEMS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const item = getFaqBySlug(params.slug);

  if (!item) {
    return { title: "Answer not found | Zar Labs" };
  }

  return buildPageMetadata({
    title: item.q,
    description: item.a,
    path: `/answers/${item.id}`,
  });
}

export default function AnswerPage({ params }) {
  const item = getFaqBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const pageUrl = `${SITE_URL}/answers/${item.id}`;

  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: item.q,
      url: pageUrl,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
        url: pageUrl,
      },
    },
  };

  return (
    <>
      <JsonLd data={qaSchema} />
      <LegalPageLayout title={item.q}>
        <p className="answer-category description grey">
          Category: {item.category.replace(/-/g, " ")}
        </p>
        <p className="answer-body">{item.a}</p>
        <div className="answer-actions">
          <Link href="/project-intake" className="legal-inline-link">
            Start a project brief
          </Link>
          <span className="answer-actions-sep"> · </span>
          <Link href="/contact" className="legal-inline-link">
            Contact Zar Labs
          </Link>
          <span className="answer-actions-sep"> · </span>
          <Link href="/faq" className="legal-inline-link">
            All FAQs
          </Link>
        </div>
      </LegalPageLayout>
    </>
  );
}
