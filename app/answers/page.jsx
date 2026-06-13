import Link from "next/link";
import { LegalPageLayout } from "../legal/LegalPageLayout";
import { buildPageMetadata } from "../../lib/seo/build-metadata";
import { ALL_FAQ_ITEMS, FAQ_AEO_CRAWLER, FAQ_CORE, getFaqAnswerPath } from "../../lib/seo/faq-data";
import { SITE_URL } from "../../lib/seo/site";
import "./answers.css";

export const metadata = buildPageMetadata({
  title: "Answers — Zar Labs FAQ Hub",
  description:
    "Direct answers about Zar Labs services, AI crawlers, GEO/AEO, integrations, newsletter, and how to get in touch. One canonical page per question.",
  path: "/answers",
});

function AnswerList({ items }) {
  return (
    <ul className="answers-index-list">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={getFaqAnswerPath(item.id)} className="legal-inline-link answers-index-link">
            {item.q}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AnswersIndexPage() {
  return (
    <LegalPageLayout title="Answers">
      <p>
        Each question has a dedicated page for search engines and AI systems. Machine-readable
        export:{" "}
        <a href={`${SITE_URL}/faq.json`} className="legal-inline-link">
          /faq.json
        </a>
        . Full FAQ hub:{" "}
        <Link href="/faq" className="legal-inline-link">
          /faq
        </Link>
        .
      </p>
      <h2 className="answers-index-section">Services &amp; contact</h2>
      <AnswerList items={FAQ_CORE} />
      <h2 className="answers-index-section">AI crawlers, AEO, SERP &amp; newsletter</h2>
      <AnswerList items={FAQ_AEO_CRAWLER} />
      <p className="description grey">
        {ALL_FAQ_ITEMS.length} answer pages indexed for AEO.
      </p>
    </LegalPageLayout>
  );
}
