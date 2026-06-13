"use client";

import Link from "next/link";
import { SectionFooter } from "../Main/SectionFooter";
import { NewsletterSignup } from "../../components/NewsletterSignup";
import { PUBLIC_NEWSLETTER_PATHS } from "../../constants/websiteCmsPaths";
import "./newsletter.css";

export function NewsletterHub({ newsletters = [] }) {
  return (
    <>
      <main className="newsletter-page">
        <header className="newsletter-hero">
          <p className="newsletter-eyebrow small-description">Zar Labs Newsletters · 2026</p>
          <h1 className="headline white">Latest newsletters on AI, GEO, and digital product strategy</h1>
          <p className="description grey">
            Original briefs on what founders are asking right now—on Reddit, Quora, and AI answer engines—not recycled case studies or old service pages.
          </p>
        </header>

        <section aria-labelledby="newsletter-list-heading">
          <h2 id="newsletter-list-heading" className="subheadline white">
            Recent newsletters
          </h2>
          <div className="newsletter-topics">
            {newsletters.map((item) => (
              <article key={item.slug} id={item.slug} className="newsletter-topic-card">
                <div className="newsletter-topic-tags">
                  {(item.tags || []).map((tag) => (
                    <span key={tag} className="newsletter-topic-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2>
                  <Link href={PUBLIC_NEWSLETTER_PATHS.detail(item.slug)} className="newsletter-topic-link">
                    {item.title}
                  </Link>
                </h2>
                <p className="description grey">{item.summary}</p>
                {item.communitySource ? (
                  <p className="newsletter-topic-source">{item.communitySource}</p>
                ) : null}
                <Link href={PUBLIC_NEWSLETTER_PATHS.detail(item.slug)} className="newsletter-read-link">
                  Read newsletter →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-cta-block" aria-labelledby="newsletter-subscribe-heading">
          <h2 id="newsletter-subscribe-heading" className="small-subheadline white">
            Subscribe for the next newsletter
          </h2>
          <NewsletterSignup source="newsletter-page" />
        </section>
      </main>
      <SectionFooter />
    </>
  );
}
