import { SITE_HOST, SITE_URL } from "./site";

/** Core business FAQs (original) */
export const FAQ_CORE = [
  {
    id: "what-does-zar-labs-do",
    category: "core",
    q: "What does Zar Labs do?",
    a: "Zar Labs is a technology partner that builds custom software, SaaS platforms, AI automation, integrations, and cloud infrastructure for businesses that need measurable outcomes—not just deliverables.",
  },
  {
    id: "who-do-you-work-with",
    category: "core",
    q: "Who do you typically work with?",
    a: "We work with startups, growing companies, and enterprise teams in the US, UK, UAE, and beyond—especially organizations investing in $20,000–$100,000+ digital transformation projects.",
  },
  {
    id: "how-projects-start",
    category: "core",
    q: "How does a project usually start?",
    a: "Most engagements begin with a discovery call to understand your goals, systems, and constraints. From there we define scope, timeline, and a phased delivery plan before development begins.",
  },
  {
    id: "ongoing-support",
    category: "core",
    q: "Do you offer ongoing support?",
    a: "Yes. We provide managed support, maintenance, monitoring, and iterative improvements so your platform stays secure, performant, and aligned with business growth.",
  },
  {
    id: "integrations",
    category: "core",
    q: "Can you integrate with our existing tools?",
    a: "Absolutely. We regularly integrate CRMs, ERPs, payment gateways, analytics platforms, APIs, and cloud services into unified digital ecosystems.",
  },
  {
    id: "contact",
    category: "core",
    q: "How do I get in touch?",
    a: "Email zarlabsteam@gmail.com, call +92 330 706 3298, visit our contact page, or book a call directly from the site. We typically respond within one business day.",
  },
];

/** AEO + crawler + newsletter — NEW topics (not duplicates of core) */
export const FAQ_AEO_CRAWLER = [
  {
    id: "what-is-ai-crawler",
    category: "crawlers",
    q: `What is an AI crawler and how does it read ${SITE_HOST}?`,
    a: "AI crawlers (e.g. GPTBot, PerplexityBot, ClaudeBot) fetch public HTML and machine-readable files like llms.txt, faq.json, and entity.json. Zar Labs publishes structured FAQs, JSON exports, and semantic headings so answer engines can cite us accurately.",
  },
  {
    id: "geo-aeo-optimization",
    category: "crawlers",
    q: "How does Zar Labs optimize for ChatGPT, Perplexity, and Google AI Overviews?",
    a: "We use Generative Engine Optimization (GEO): canonical metadata on every page, FAQPage schema, entity JSON, answer-ready copy, internal links to services and case studies, and a newsletter covering the latest AI and product topics—not recycled blog fluff.",
  },
  {
    id: "machine-readable-files",
    category: "crawlers",
    q: `What JSON and text files on ${SITE_HOST} help AI systems understand Zar Labs?`,
    a: "Public routes include /answers/{slug} (one page per question), /faq.json (all FAQs with canonical URLs), /entity.json (organization graph), /ai-profile.json (structured profile), and /llms.txt (crawler guidance). These complement visible on-page content—never invisible schema alone.",
  },
  {
    id: "robots-sitemap",
    category: "crawlers",
    q: "How do search crawlers discover Zar Labs pages?",
    a: `robots.txt allows indexing of public marketing pages and points to sitemap.xml. The sitemap lists home, about, works, case studies, contact, project intake, FAQ, /answers pages, newsletter, and legal pages on the canonical domain ${SITE_URL} only.`,
  },
  {
    id: "newsletter-latest-topics",
    category: "newsletter",
    q: "What is the Zar Labs newsletter and what topics does it cover?",
    a: "The Zar Labs newsletter shares new briefs on agentic AI, GEO/AEO, crawler-friendly architecture, MCP integrations, and community-sourced product insights from forums like Reddit and Quora—curated for founders and operators, not republished old case studies.",
  },
  {
    id: "subscribe-newsletter",
    category: "newsletter",
    q: "How do I subscribe to Zar Labs insights?",
    a: `Visit ${SITE_URL}/newsletter to see the latest topics and subscribe with your email. You can also use the signup form in the site footer. We send practical digital product intelligence, not spam.`,
  },
  {
    id: "reddit-quora-newsletter",
    category: "newsletter",
    q: "Does Zar Labs use Reddit or Quora content in the newsletter?",
    a: `We monitor public discussion trends on Reddit and Quora to identify real buyer questions, then write original Zar Labs briefs on those themes. We do not republish user posts; we link newsletter readers to actionable guides on ${SITE_HOST}.`,
  },
  {
    id: "open-graph-previews",
    category: "serp",
    q: "How does Zar Labs control link previews on Slack, iMessage, and social media?",
    a: "Every indexable page includes Open Graph and Twitter Card metadata: og:title, og:description, og:url, og:image (1200×630), and twitter:card summary_large_image. Case studies use project-specific images where available.",
  },
];

export const ALL_FAQ_ITEMS = [...FAQ_CORE, ...FAQ_AEO_CRAWLER];

export function getFaqAnswerPath(id) {
  return `/answers/${id}`;
}

export function getFaqBySlug(slug) {
  return ALL_FAQ_ITEMS.find((item) => item.id === slug) ?? null;
}

export function buildFaqJsonExport() {
  return {
    name: "Zar Labs FAQ",
    canonicalDomain: SITE_URL,
    lastUpdated: new Date().toISOString().slice(0, 10),
    items: ALL_FAQ_ITEMS.map((item) => ({
      id: item.id,
      category: item.category,
      question: item.q,
      answer: item.a,
      url: `${SITE_URL}${getFaqAnswerPath(item.id)}`,
      faqHubUrl: `${SITE_URL}/faq#${item.id}`,
    })),
  };
}
