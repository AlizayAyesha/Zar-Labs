"use client";

import Link from "next/link";
import { SectionFooter } from "../../Main/SectionFooter";
import { NewsletterSignup } from "../../../components/NewsletterSignup";
import { PUBLIC_NEWSLETTER_PATHS } from "../../../constants/websiteCmsPaths";
import "../newsletter.css";

export function NewsletterDetail({ newsletter }) {
  if (!newsletter) return null;

  const paragraphs = String(newsletter.body || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <main className="newsletter-page newsletter-detail-page">
        <header className="newsletter-hero">
          <p className="newsletter-eyebrow small-description">Zar Labs Newsletter</p>
          <h1 className="headline white">{newsletter.title}</h1>
          <p className="description grey">{newsletter.summary}</p>
          {newsletter.communitySource ? (
            <p className="newsletter-topic-source">{newsletter.communitySource}</p>
          ) : null}
        </header>

        <article className="newsletter-detail-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="description grey">
              {paragraph}
            </p>
          ))}
        </article>

        <p className="newsletter-back-link">
          <Link href={PUBLIC_NEWSLETTER_PATHS.hub}>← All newsletters</Link>
        </p>

        <section className="newsletter-cta-block" aria-labelledby="newsletter-detail-subscribe-heading">
          <h2 id="newsletter-detail-subscribe-heading" className="small-subheadline white">
            Subscribe for the next newsletter
          </h2>
          <NewsletterSignup source="newsletter-detail" />
        </section>
      </main>
      <SectionFooter />
    </>
  );
}
