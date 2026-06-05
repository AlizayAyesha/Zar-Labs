"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { Calendar, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useCalendly } from "./CalendlyProvider";
import { ZAR_LABS_EMAIL, ZAR_LABS_PHONE, ZAR_LABS_PHONE_DISPLAY } from "../config/contact";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/zar_labs/", Icon: Instagram },
  { label: "X (Twitter)", href: "https://x.com/zarlabs", Icon: Twitter },
];

const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "AI & Automation", href: "/about" },
  { label: "Custom Software", href: "/about" },
  { label: "Systems Integration", href: "/about" },
  { label: "DevOps & Cloud", href: "/about" },
];

const RESOURCE_LINKS = [
  { label: "Project Intake", href: "/project-intake" },
  { label: "FAQ", href: "/faq" },
  { label: "Case Studies", href: "/works" },
  { label: "Book a Call", action: "calendly" },
  { label: "Support", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

const FooterColumn = ({ title, children }) => (
  <div className="footer-content-right-column">
    <h2 className="description white footer-column-title">{title}</h2>
    <div className="footer-column-contents">{children}</div>
  </div>
);

const FooterNavLink = ({ href, children, onClick, external }) => {
  const className = "footer-link description grey hover-text-grey";

  if (onClick) {
    return (
      <button type="button" className={`${className} footer-link-button`} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

export const SectionFooter = () => {
  const { openCalendly } = useCalendly();
  const topRef1 = useRef();
  const topRef2 = useRef();
  const centerRef1 = useRef();
  const bottomRef1 = useRef();
  const bottomRef2 = useRef();

  useEffect(() => {
    gsap.fromTo(topRef1.current, { filter: "blur(8px)", opacity: 0 }, { delay: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "sine", scrollTrigger: { trigger: topRef1.current, start: "top 95%" } });
    gsap.fromTo(topRef2.current, { filter: "blur(8px)", opacity: 0 }, { delay: 0.2, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "sine", scrollTrigger: { trigger: topRef1.current, start: "top 95%" } });
    gsap.fromTo(centerRef1.current, { filter: "blur(8px)", opacity: 0 }, { delay: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "sine", scrollTrigger: { trigger: centerRef1.current, start: "top 95%" } });
    gsap.fromTo(bottomRef1.current, { filter: "blur(8px)", opacity: 0 }, { delay: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "sine", scrollTrigger: { trigger: bottomRef1.current, start: "top 95%" } });
    gsap.fromTo(bottomRef2.current, { filter: "blur(8px)", opacity: 0 }, { delay: 0.2, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "sine", scrollTrigger: { trigger: bottomRef2.current, start: "top 95%" } });
  }, []);

  return (
    <section className="footer">
      <div className="footer-content">
        <div className="footer-content-left" ref={topRef1}>
          <img src="/images/zarlabs-logo.webp" className="footer-logo" alt="Zar Labs" />
          <h1 className="subheadline white">Zar Labs</h1>
          <p className="description grey footer-tagline">
            Technology partner for custom software, AI automation, and digital transformation—built for measurable business outcomes.
          </p>
          <div className="footer-contact-info">
            <a href={`mailto:${ZAR_LABS_EMAIL}`} className="footer-contact-item">
              <Mail strokeWidth={1.5} className="footer-contact-icon" />
              <span className="description grey hover-text-grey">{ZAR_LABS_EMAIL}</span>
            </a>
            <a href={`tel:${ZAR_LABS_PHONE}`} className="footer-contact-item">
              <Phone strokeWidth={1.5} className="footer-contact-icon" />
              <span className="description grey hover-text-grey">{ZAR_LABS_PHONE_DISPLAY}</span>
            </a>
            <button type="button" className="footer-contact-item footer-contact-button" onClick={openCalendly}>
              <Calendar strokeWidth={1.5} className="footer-contact-icon" />
              <span className="description grey hover-text-grey">Book a discovery call</span>
            </button>
            <div className="footer-contact-item">
              <MapPin strokeWidth={1.5} className="footer-contact-icon" />
              <span className="description grey">
                Karachi, Pakistan
              </span>
            </div>
          </div>
          <div className="footer-socials footer-socials--brand">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                className="footer-socials-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon strokeWidth={1.25} className="footer-socials-icon" />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-content-right" ref={topRef2}>
          <FooterColumn title="Company">
            {COMPANY_LINKS.map((link) => (
              <div key={link.label} className="footer-column-contents-item">
                <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
              </div>
            ))}
          </FooterColumn>
          <FooterColumn title="Services">
            {SERVICE_LINKS.map((link) => (
              <div key={link.label} className="footer-column-contents-item">
                <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
              </div>
            ))}
          </FooterColumn>
          <FooterColumn title="Resources">
            {RESOURCE_LINKS.map((link) => (
              <div key={link.label} className="footer-column-contents-item">
                {link.action === "calendly" ? (
                  <FooterNavLink onClick={openCalendly}>{link.label}</FooterNavLink>
                ) : (
                  <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
                )}
              </div>
            ))}
          </FooterColumn>
          <FooterColumn title="Legal">
            {LEGAL_LINKS.map((link) => (
              <div key={link.label} className="footer-column-contents-item">
                <FooterNavLink href={link.href}>{link.label}</FooterNavLink>
              </div>
            ))}
          </FooterColumn>
        </div>
      </div>
      <div className="footer-divider" ref={centerRef1} />
      <div className="footer-content-bottom">
        <p className="small-description grey" ref={bottomRef1}>
          © {new Date().getFullYear()} Zar Labs. All rights reserved.
        </p>
        <div className="footer-content-bottom-links" ref={bottomRef2}>
          <FooterNavLink href="/faq">FAQ</FooterNavLink>
          <span className="footer-bottom-dot" />
          <FooterNavLink href="/contact">Support</FooterNavLink>
          <span className="footer-bottom-dot" />
          <FooterNavLink href="/terms">Terms</FooterNavLink>
          <span className="footer-bottom-dot" />
          <FooterNavLink href="/privacy">Privacy</FooterNavLink>
        </div>
      </div>
    </section>
  );
};
