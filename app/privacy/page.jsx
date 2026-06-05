import { LegalPageLayout } from "../legal/LegalPageLayout";

export const metadata = {
  title: "Zar Labs | Privacy Policy",
  description: "How Zar Labs collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>Last updated: June 2026</p>
      <p>
        Zar Labs respects your privacy. This policy explains what information we collect and how we use it
        when you visit our website or contact us.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Contact details you submit (name, email, company, message).</li>
        <li>Scheduling data when you book a call through Calendly.</li>
        <li>Basic usage analytics such as pages visited, device type, and referral source.</li>
      </ul>
      <h2>How We Use Information</h2>
      <ul>
        <li>Respond to inquiries and provide requested services.</li>
        <li>Improve website performance, security, and user experience.</li>
        <li>Send service-related communications you request or reasonably expect.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell personal information. We may share data with trusted providers (e.g., hosting,
        analytics, scheduling) solely to operate our business.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal information by emailing
        zarlabsteam@gmail.com.
      </p>
      <h2>Contact</h2>
      <p>Zar Labs — Karachi, Pakistan — zarlabsteam@gmail.com</p>
    </LegalPageLayout>
  );
}
