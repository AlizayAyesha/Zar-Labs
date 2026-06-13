import { SITE_URL } from "../../../../lib/seo/site";
import Link from "next/link";

export default function SeoDashboardPage() {
  const liveUrls = [
    "/newsletter",
    "/faq",
    "/faq.json",
    "/entity.json",
    "/ai-profile.json",
    "/llms.txt",
    "/sitemap.xml",
    "/robots.txt",
  ];

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>SEO / AEO Hub</h1>
          <p>Machine-readable exports, checklist status, and live URL verification.</p>
        </div>
      </header>

      <div className="dashboard-card">
        <h2>Live crawler URLs</h2>
        <ul className="dashboard-link-list">
          {liveUrls.map((path) => (
            <li key={path}>
              <a href={`${SITE_URL}${path}`} target="_blank" rel="noopener noreferrer">
                {SITE_URL}
                {path}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-card">
        <h2>Checklist status</h2>
        <ul className="dashboard-link-list">
          <li>
            <Link href="/newsletter">Newsletter page</Link> — new 2026 topics (agentic AI, GEO, crawlers)
          </li>
          <li>Open Graph — all pages via buildPageMetadata()</li>
          <li>FAQ + FAQPage schema — /faq</li>
          <li>Metadata — all indexable routes</li>
          <li>JSON exports — faq.json, entity.json, ai-profile.json, llms.txt</li>
          <li>Formspree — still needs real form ID in .env.local</li>
          <li>GSC sitemap — submit after deploy</li>
        </ul>
      </div>

      <div className="dashboard-card">
        <h2>Phase 2 SEO (not yet built)</h2>
        <ul className="dashboard-link-list">
          <li>/answers/[slug] answer pages</li>
          <li>/topics/[slug] topic hubs</li>
          <li>GA4 + generate_lead events</li>
          <li>npm run seo:all validation scripts</li>
          <li>Wire FAQ + case studies from DB to public pages</li>
        </ul>
      </div>
    </>
  );
}
