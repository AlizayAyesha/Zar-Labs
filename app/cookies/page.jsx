import { LegalPageLayout } from "../legal/LegalPageLayout";

export const metadata = {
  title: "Zar Labs | Cookie Policy",
  description: "Cookie and tracking information for the Zar Labs website.",
};

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <p>Last updated: June 2026</p>
      <p>
        This site uses cookies and similar technologies to keep the website functional, understand usage,
        and improve performance.
      </p>
      <h2>Types of Cookies</h2>
      <ul>
        <li><strong>Essential:</strong> Required for core site functionality and security.</li>
        <li><strong>Analytics:</strong> Help us understand traffic patterns and page performance.</li>
        <li><strong>Third-party:</strong> Scheduling embeds (such as Calendly) may set their own cookies.</li>
      </ul>
      <h2>Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling essential cookies may affect
        site functionality.
      </p>
      <h2>Contact</h2>
      <p>Questions: zarlabsteam@gmail.com</p>
    </LegalPageLayout>
  );
}
