"use client";

import { useCallback, useState } from "react";
import { ReactLenis } from "lenis/react";
import { SectionFooter } from "../Main/SectionFooter";
import { useCalendly } from "../Main/CalendlyProvider";
import { getFormspreeEndpoint } from "../config/formspree";
import {
  ANIMATION_OPTIONS,
  BRAND_ASSET_OPTIONS,
  buildFormspreePayload,
  DATABASE_OPTIONS,
  DESIGN_STYLE_OPTIONS,
  INITIAL_FORM,
  PLATFORM_FEATURES,
  SERVICE_OPTIONS,
  toggleArrayValue,
  WEBSITE_SCOPE_OPTIONS,
} from "./intake-form-data";
import "./project-intake.css";

const FormBlock = ({ num, title, description, children }) => (
  <div className="project-intake-block">
    <div className="project-intake-block-header">
      <span className="project-intake-block-num">{num}</span>
      <h2 className="project-intake-block-title">{title}</h2>
    </div>
    {description && <p className="project-intake-block-desc">{description}</p>}
    <div className="project-intake-fields">{children}</div>
  </div>
);

const Field = ({ label, htmlFor, full, children }) => (
  <div className={`project-intake-field${full ? " project-intake-field--full" : ""}`}>
    {htmlFor ? (
      <label className="project-intake-label" htmlFor={htmlFor}>
        {label}
      </label>
    ) : (
      <span className="project-intake-label">{label}</span>
    )}
    {children}
  </div>
);

export const ProjectIntakePage = () => {
  const { openCalendly } = useCalendly();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = getFormspreeEndpoint();
    if (!endpoint) {
      setError("Formspree is not configured yet. Add NEXT_PUBLIC_FORMSPREE_PROJECT_INTAKE_URL to .env.local and restart the dev server.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildFormspreePayload(form)),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not send your brief. Please try again.");
      }

      setSubmitted(true);
      openCalendly();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReactLenis root>
      <section className="project-intake">
        <div className="project-intake-content">
          <header className="project-intake-hero">
            <p className="project-intake-eyebrow">Zar Labs · Project Intake</p>
            <h1 className="project-intake-title">
              We know what&apos;s best for <span className="accent-green">your business</span>
            </h1>
            <p className="project-intake-lead">
              Tell us about your goals, brand, and technical needs. We&apos;ll review your brief and recommend
              the right scope—from a focused 5-page site to a full enterprise platform. Have a brand kit already?
              Even better. If not, we&apos;ll help you build one.
            </p>
          </header>

          {submitted && (
            <div className="project-intake-success">
              Thank you — your project brief was sent to Zar Labs. Pick a time in the calendar to book your consultation.
            </div>
          )}

          {error && (
            <div className="project-intake-error" role="alert">
              {error}
            </div>
          )}

          <form className="project-intake-form" onSubmit={handleSubmit}>
            <FormBlock num="01" title="Contact information">
              <Field label="Full name *" htmlFor="name">
                <input id="name" className="project-intake-input" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </Field>
              <Field label="Business email *" htmlFor="email">
                <input id="email" type="email" className="project-intake-input" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Company *" htmlFor="company">
                <input id="company" className="project-intake-input" required value={form.company} onChange={(e) => update("company", e.target.value)} />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <input id="phone" className="project-intake-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </Field>
            </FormBlock>

            <FormBlock
              num="02"
              title="Project scope"
              description="What are you building, and at what scale?"
            >
              <div className="project-intake-checklist">
                {SERVICE_OPTIONS.map((service) => (
                  <label key={service} className="project-intake-check-row">
                    <input
                      type="checkbox"
                      checked={form.services.includes(service)}
                      onChange={() => update("services", toggleArrayValue(form.services, service))}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
              <Field label="Website / platform scope *" htmlFor="scope" full>
                <select id="scope" className="project-intake-select" required value={form.websiteScope} onChange={(e) => update("websiteScope", e.target.value)}>
                  <option value="">Select project type…</option>
                  {WEBSITE_SCOPE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated number of pages" htmlFor="pages">
                <input id="pages" type="number" min="1" className="project-intake-input" placeholder="e.g. 12" value={form.pageCount} onChange={(e) => update("pageCount", e.target.value)} />
              </Field>
              <Field label="CTA banners needed" htmlFor="cta">
                <input id="cta" className="project-intake-input" placeholder="e.g. 3" value={form.ctaBannerCount} onChange={(e) => update("ctaBannerCount", e.target.value)} />
              </Field>
            </FormBlock>

            <FormBlock
              num="03"
              title="Brand & design"
              description="Visual direction, assets, and experience preferences."
            >
              <div className="project-intake-checklist">
                {BRAND_ASSET_OPTIONS.map(({ value, label }) => (
                  <label key={value} className="project-intake-check-row">
                    <input
                      type="checkbox"
                      checked={form.brandAssets.includes(value)}
                      onChange={() => update("brandAssets", toggleArrayValue(form.brandAssets, value))}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <Field label="Color palette" htmlFor="colors">
                <input id="colors" className="project-intake-input" placeholder="#22c55e, #010101, white" value={form.colorPalette} onChange={(e) => update("colorPalette", e.target.value)} />
              </Field>
              <Field label="Typography / fonts" htmlFor="fonts">
                <input id="fonts" className="project-intake-input" placeholder="Preferred fonts or style" value={form.typography} onChange={(e) => update("typography", e.target.value)} />
              </Field>
              <Field label="Design direction" htmlFor="design" full>
                <select id="design" className="project-intake-select" value={form.designStyle} onChange={(e) => update("designStyle", e.target.value)}>
                  <option value="">Select design direction…</option>
                  {DESIGN_STYLE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Animation level" htmlFor="animation" full>
                <select id="animation" className="project-intake-select" value={form.animationLevel} onChange={(e) => update("animationLevel", e.target.value)}>
                  <option value="">Select animation level…</option>
                  {ANIMATION_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Newsletter module" htmlFor="newsletter" full>
                <select id="newsletter" className="project-intake-select" value={form.newsletter} onChange={(e) => update("newsletter", e.target.value)}>
                  <option value="">Select…</option>
                  <option value="yes">Yes — include newsletter</option>
                  <option value="no">No — not needed</option>
                  <option value="later">Maybe later</option>
                </select>
              </Field>
            </FormBlock>

            <FormBlock
              num="04"
              title="Technology & platform"
              description="Infrastructure, integrations, and features your business requires."
            >
              <Field label="Database preference" full>
                <div className="project-intake-checklist">
                  {DATABASE_OPTIONS.map((db) => (
                    <label key={db} className="project-intake-check-row">
                      <input
                        type="checkbox"
                        checked={form.databases.includes(db)}
                        onChange={() => update("databases", toggleArrayValue(form.databases, db))}
                      />
                      <span>{db}</span>
                    </label>
                  ))}
                </div>
              </Field>
              <div className="project-intake-checklist project-intake-checklist--wide">
                {PLATFORM_FEATURES.map((feature) => (
                  <label key={feature} className="project-intake-check-row">
                    <input
                      type="checkbox"
                      checked={form.platformFeatures.includes(feature)}
                      onChange={() => update("platformFeatures", toggleArrayValue(form.platformFeatures, feature))}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
              <Field label="Integrations & data workflows" htmlFor="integrations" full>
                <textarea id="integrations" className="project-intake-textarea" placeholder="Google Sheets, help center, CRM sync, user records, third-party apps…" value={form.integrationsNotes} onChange={(e) => update("integrationsNotes", e.target.value)} />
              </Field>
              <Field label="Security requirements" htmlFor="security" full>
                <textarea id="security" className="project-intake-textarea" placeholder="IP/device tracking, access controls, compliance needs…" value={form.securityNotes} onChange={(e) => update("securityNotes", e.target.value)} />
              </Field>
            </FormBlock>

            <FormBlock
              num="05"
              title="Your content & notes"
              description="Share copy you already have, or anything else we should know before consultation."
            >
              <Field label="Website content / copy brief" htmlFor="content" full>
                <textarea id="content" className="project-intake-textarea project-intake-textarea--large" placeholder="Homepage messaging, service descriptions, about copy, product details…" value={form.clientContent} onChange={(e) => update("clientContent", e.target.value)} />
              </Field>
              <Field label="Additional notes" htmlFor="notes" full>
                <textarea id="notes" className="project-intake-textarea" placeholder="Timeline, budget range, competitors you admire, must-have features…" value={form.additionalNotes} onChange={(e) => update("additionalNotes", e.target.value)} />
              </Field>
            </FormBlock>

            <div className="project-intake-actions">
              <button
                type="submit"
                className="project-intake-btn project-intake-btn--primary"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Book a consultation with us"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <SectionFooter />
    </ReactLenis>
  );
};
