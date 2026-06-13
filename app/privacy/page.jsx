import { LegalPageLayout } from "../legal/LegalPageLayout";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "How Zar Labs collects, uses, and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>Last updated: June 2026</p>
      <p>
        Zar Labs respects your privacy. This policy explains what information we collect and how we use it
        when you visit our website or contact us.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you submit (name, email, phone, project details).</li>
        <li>Newsletter email if you subscribe at /newsletter.</li>
        <li>Basic usage analytics such as pages visited, device type, and referral source.</li>
      </ul>
      <h2>How we use information</h2>
      <p>
        We use your information to respond to inquiries, deliver services, send newsletter briefs you opt into,
        and improve our website. We do not sell personal data.
      </p>
      <h2>Third parties</h2>
      <p>
        We may use hosting, form processing (Formspree), scheduling (Calendly), database (Supabase), and
        analytics providers solely to operate our business.
      </p>
      <h2>Contact</h2>
      <p>Privacy questions: zarlabsteam@gmail.com</p>
    </LegalPageLayout>
  );
}
