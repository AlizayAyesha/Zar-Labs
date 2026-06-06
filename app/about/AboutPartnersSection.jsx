"use client";

import { ArrowUpRight, Instagram } from "lucide-react";

const PARTNERS = [
  {
    id: "vyzion",
    name: "Vyzion Systems",
    initials: "VS",
    badge: "Enterprise Technology Partner",
    headline: "Enterprise Consulting & Digital Transformation",
    accent: "blue",
    description: [
      "Vyzion Systems is a technology consulting and enterprise solutions company focused on helping organizations modernize operations, optimize technology investments, and accelerate digital transformation initiatives.",
      "With expertise in enterprise architecture, infrastructure modernization, business technology consulting, and large-scale software initiatives, Vyzion Systems helps businesses bridge the gap between strategy and execution.",
      "Working alongside Zar Labs, Vyzion Systems supports organizations in designing scalable technology ecosystems, improving operational efficiency, and implementing solutions that drive sustainable growth.",
    ],
    capabilities: [
      "Enterprise Technology Solutions",
      "Digital Transformation Strategy",
      "Business Technology Consulting",
      "Infrastructure Modernization",
      "Enterprise Software Initiatives",
      "System Architecture & Planning",
      "Cloud Infrastructure Strategy",
      "Business Process Optimization",
      "Technology Assessments",
      "Operational Efficiency Consulting",
    ],
    image: "/images/vyzion%20logo.jpeg",
    imageAlt: "Vyzion Systems logo",
    logo: "/images/vyzion%20logo.jpeg",
    logoAlt: "Vyzion Systems logo",
    website: {
      label: "Visit Website",
      href: "https://vyzionsystems-portfolio.vercel.app/",
      disabled: false,
    },
    instagram: "https://www.instagram.com/vyzionsystems_ofc/",
  },
  {
    id: "redoro",
    name: "Redoro Studio",
    initials: "RS",
    badge: "Creative & Branding Partner",
    headline: "Branding, Creative Production & AI Advertising",
    accent: "gold",
    description: [
      "Redoro Studio is a creative branding and visual communications company specializing in premium brand identity systems, AI-powered content creation, advertising assets, and modern marketing design.",
      "By combining traditional creative expertise with advanced AI production tools, Redoro delivers high-quality visual content, realistic advertising campaigns, brand kits, logos, marketing templates, and digital assets that help businesses establish a strong and consistent market presence.",
      "The company focuses on providing agency-quality creative production with faster turnaround times and cost-efficient workflows through intelligent design technologies.",
    ],
    capabilities: [
      "Brand Identity Systems",
      "Logo Design",
      "Brand Guidelines",
      "Brand Kits",
      "Marketing Templates",
      "Social Media Creative Assets",
      "AI-Powered Advertising",
      "AI Product Visualizations",
      "AI Marketing Content",
      "Creative Campaign Production",
      "Corporate Branding Materials",
      "Visual Design Systems",
    ],
    image: "/images/redoro%20studio.png",
    imageAlt: "Redoro Studio logo",
    logo: "/images/redoro%20studio.png",
    logoAlt: "Redoro Studio logo",
    website: {
      label: "Website Launching Soon",
      href: null,
      disabled: true,
    },
    instagram: "https://www.instagram.com/redoro_studio/",
  },
];

export const AboutPartnersSection = ({ sectionRef }) => (
  <div className="about-partners" ref={sectionRef}>
    <div className="about-partners-glow" aria-hidden="true" />
    <header className="about-partners-header">
      <p className="about-partners-eyebrow">Strategic Ecosystem</p>
      <h1 className="headline about-partners-title white">
        Strategic Partners &amp; <span className="accent-green">Joint Ventures</span>
      </h1>
      <p className="about-partners-subheading grey">
        Through strategic partnerships and specialized ventures, Zar Labs delivers comprehensive solutions
        spanning software engineering, enterprise consulting, digital transformation, branding, creative
        production, and AI-powered marketing.
      </p>
      <p className="about-partners-subheading about-partners-subheading--secondary grey">
        Our ecosystem enables clients to access a broader range of expertise while maintaining a unified
        project experience.
      </p>
    </header>

    <div className="about-partners-grid">
      {PARTNERS.map((partner) => (
        <article
          key={partner.id}
          className={`about-partner-card about-partner-card--${partner.accent}`}
        >
          <div className="about-partner-card-border" aria-hidden="true" />
          <div className={`about-partner-card-media about-partner-card-media--brand${partner.id === "vyzion" ? " about-partner-card-media--cover" : ""}`}>
            <img src={partner.image} alt={partner.imageAlt} className="about-partner-card-image" />
            <div className="about-partner-card-media-overlay" />
            <span className="about-partner-card-badge">{partner.badge}</span>
          </div>

          <div className="about-partner-card-body">
            <div className="about-partner-card-identity">
              <div className="about-partner-logo" aria-label={partner.logoAlt}>
                <img src={partner.logo} alt="" className="about-partner-logo-image" />
              </div>
              <div className="about-partner-card-identity-text">
                <h2 className="about-partner-card-title white">{partner.name}</h2>
                <p className="about-partner-card-role">{partner.badge}</p>
              </div>
            </div>

            <h3 className="about-partner-card-headline white">{partner.headline}</h3>

            <div className="about-partner-card-desc-group">
              {partner.description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="about-partner-card-desc grey">
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="about-partner-capabilities-label">Core Capabilities</p>
            <ul className="about-partner-card-tags">
              {partner.capabilities.map((tag) => (
                <li key={tag} className="about-partner-card-tag">
                  {tag}
                </li>
              ))}
            </ul>

            <div className="about-partner-card-actions">
              {partner.website.disabled ? (
                <button type="button" className="about-partner-btn about-partner-btn--disabled" disabled>
                  {partner.website.label}
                </button>
              ) : (
                <a
                  href={partner.website.href}
                  className="about-partner-btn about-partner-btn--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {partner.website.label}
                  <ArrowUpRight className="about-partner-btn-icon" strokeWidth={1.75} />
                </a>
              )}

              <a
                href={partner.instagram}
                className="about-partner-social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${partner.name} on Instagram`}
              >
                <Instagram strokeWidth={1.5} className="about-partner-social-icon" />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);
