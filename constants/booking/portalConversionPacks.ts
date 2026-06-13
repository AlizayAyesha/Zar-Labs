import type { ChannelKey } from "./channelGroups";

export type PortalTier = {
  name: string;
  priceLabel: string;
  description: string;
  highlighted?: boolean;
};

export type PortalFaq = { q: string; a: string };

export type PortalPack = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  trustBullets: string[];
  tiers: PortalTier[];
  faq: PortalFaq[];
};

/** Default conversion copy per channel — override in CTA Management editor */
export const PORTAL_CONVERSION_PACKS: Record<ChannelKey, PortalPack> = {
  linkedin: {
    headline: "Book a strategy call with Zar Labs",
    subheadline:
      "Custom software, AI automation, and digital products for teams investing in serious outcomes.",
    ctaLabel: "Schedule on Calendly",
    trustBullets: [
      "US, UK, UAE & global delivery",
      "$20k–$100k+ transformation projects",
      "Discovery call — no obligation",
    ],
    tiers: [
      {
        name: "Discovery",
        priceLabel: "Free 30 min",
        description: "Scope, timeline, and fit assessment",
        highlighted: true,
      },
      {
        name: "Build",
        priceLabel: "From $20k",
        description: "Web, SaaS, AI, integrations",
      },
      {
        name: "Partner",
        priceLabel: "Custom",
        description: "Enterprise + Vyzion collaboration",
      },
    ],
    faq: [
      {
        q: "What happens on the first call?",
        a: "We review your goals, systems, and constraints, then outline a phased plan if there is a fit.",
      },
      {
        q: "Do you work with startups?",
        a: "Yes — startups and growing companies investing in $20k+ digital builds.",
      },
    ],
  },
  instagram: {
    headline: "Let's build your next digital product",
    subheadline: "Zar Labs — design, engineering, and AI under one roof.",
    ctaLabel: "Book a call",
    trustBullets: ["Portfolio on zarlabs.com/works", "Newsletter on AI & product strategy"],
    tiers: [
      {
        name: "Quick intro",
        priceLabel: "Free",
        description: "15–30 min intro call",
        highlighted: true,
      },
      {
        name: "Project intake",
        priceLabel: "Online",
        description: "Full brief at /project-intake",
      },
    ],
    faq: [
      {
        q: "How do I start a project?",
        a: "Book a call or complete the project intake form on our website.",
      },
    ],
  },
  snapchat: {
    headline: "Zar Labs — book a quick intro",
    subheadline: "Custom software & AI for teams that want outcomes, not hype.",
    ctaLabel: "Schedule a call",
    trustBullets: ["Link in bio for Snap & Spotlight", "Works + case studies on site"],
    tiers: [
      {
        name: "Intro call",
        priceLabel: "Free",
        description: "15–30 min discovery",
        highlighted: true,
      },
    ],
    faq: [
      {
        q: "What do you build?",
        a: "Web apps, SaaS, AI automation, and integrations for $20k+ projects.",
      },
    ],
  },
  facebook: {
    headline: "Work with Zar Labs",
    subheadline: "From MVP to enterprise — web, SaaS, and AI delivery.",
    ctaLabel: "Book discovery call",
    trustBullets: ["US · UK · UAE delivery", "See /works for proof"],
    tiers: [
      {
        name: "Discovery",
        priceLabel: "Free",
        description: "Scope your project on a call",
        highlighted: true,
      },
      {
        name: "Build",
        priceLabel: "From $20k",
        description: "Full product engineering",
      },
    ],
    faq: [
      {
        q: "Can I share this link in a Facebook post?",
        a: "Yes — use /go/facebook in posts, stories, or page buttons.",
      },
    ],
  },
  whatsapp: {
    headline: "Chat with Zar Labs — book a call",
    subheadline: "Tap to schedule a discovery call or send a project brief.",
    ctaLabel: "Pick a time on Calendly",
    trustBullets: ["WhatsApp Business friendly link", "Project intake at /project-intake"],
    tiers: [
      {
        name: "Quick call",
        priceLabel: "Free",
        description: "Intro via Calendly",
        highlighted: true,
      },
    ],
    faq: [
      {
        q: "How do I use this in WhatsApp?",
        a: "Paste /go/whatsapp in status, broadcast messages, or your business profile link.",
      },
    ],
  },
  website: {
    headline: "Get in touch with Zar Labs",
    subheadline: "Technology partner for measurable business outcomes.",
    ctaLabel: "Book a discovery call",
    trustBullets: ["Custom software · SaaS · AI · Integrations"],
    tiers: [
      {
        name: "Discovery",
        priceLabel: "Free",
        description: "Calendly scheduling",
        highlighted: true,
      },
    ],
    faq: [],
  },
  email: {
    headline: "Zar Labs — schedule a call",
    subheadline: "Reply to this thread or pick a time that works for you.",
    ctaLabel: "Open Calendly",
    trustBullets: ["zarlabsteam@gmail.com", "+92 330 706 3298"],
    tiers: [],
    faq: [],
  },
  referral: {
    headline: "Partner introduction — Zar Labs",
    subheadline: "Thank you for the referral. Let's align on scope and next steps.",
    ctaLabel: "Book partner call",
    trustBullets: ["Vyzion Systems enterprise collaboration available"],
    tiers: [],
    faq: [],
  },
};
