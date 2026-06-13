"use client";

import Link from "next/link";
import { useCalendly } from "../../app/Main/CalendlyProvider";

export function GoPortalView({ portal, channelLabel, calendlyFallback }) {
  const { openCalendly } = useCalendly();

  function handleCta() {
    const url = portal.ctaUrl?.trim();
    if (url) {
      if (url.startsWith("/")) {
        window.location.assign(url);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return;
    }
    openCalendly();
  }

  return (
    <main className="go-portal">
      <div className="go-portal-inner">
        <p className="go-portal-eyebrow">{channelLabel}</p>
        <h1>{portal.headline}</h1>
        {portal.subheadline ? <p className="go-portal-sub">{portal.subheadline}</p> : null}

        {portal.trustBullets?.length ? (
          <ul className="go-portal-trust">
            {portal.trustBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}

        <button type="button" className="go-portal-cta" onClick={handleCta}>
          {portal.ctaLabel || "Book a call"}
        </button>

        {portal.tiers?.length ? (
          <section className="go-portal-tiers">
            <h2>Options</h2>
            <div className="go-portal-tier-grid">
              {portal.tiers.map((tier) => (
                <article
                  key={tier.name}
                  className={`go-portal-tier${tier.highlighted ? " go-portal-tier--highlight" : ""}`}
                >
                  <h3>{tier.name}</h3>
                  <p className="go-portal-tier-price">{tier.priceLabel}</p>
                  <p>{tier.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {portal.faq?.length ? (
          <section className="go-portal-faq">
            <h2>FAQ</h2>
            <dl>
              {portal.faq.map((item) => (
                <div key={item.q} className="go-portal-faq-item">
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <footer className="go-portal-footer">
          <Link href="/project-intake">Project intake form</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/contact">Contact</Link>
          {!portal.ctaUrl && calendlyFallback ? (
            <>
              <span aria-hidden="true"> · </span>
              <a href={calendlyFallback} target="_blank" rel="noopener noreferrer">
                Open Calendly
              </a>
            </>
          ) : null}
        </footer>
      </div>
    </main>
  );
}
