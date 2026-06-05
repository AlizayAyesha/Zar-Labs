import { LegalPageLayout } from "../legal/LegalPageLayout";

export const metadata = {
  title: "Zar Labs | Terms of Service",
  description: "Terms of Service for Zar Labs website and professional services.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <p>Last updated: June 2026</p>
      <p>
        By accessing zarlabs.com or engaging Zar Labs for services, you agree to these Terms of Service.
        If you do not agree, please do not use our website or services.
      </p>
      <h2>Services</h2>
      <p>
        Zar Labs provides software development, consulting, integration, and related technology services.
        Specific deliverables, timelines, and fees are defined in individual proposals or statements of work.
      </p>
      <h2>Use of Website</h2>
      <p>
        You may not misuse the site, attempt unauthorized access, scrape content at scale, or use our materials
        without permission. All site content remains the property of Zar Labs unless otherwise stated.
      </p>
      <h2>Intellectual Property</h2>
      <p>
        Unless agreed in writing, client-owned project assets transfer upon full payment. Zar Labs retains
        rights to pre-existing tools, frameworks, and general know-how used across engagements.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Zar Labs is not liable for indirect, incidental, or consequential
        damages arising from use of the website or services.
      </p>
      <h2>Contact</h2>
      <p>Questions about these terms: zarlabsteam@gmail.com</p>
    </LegalPageLayout>
  );
}
