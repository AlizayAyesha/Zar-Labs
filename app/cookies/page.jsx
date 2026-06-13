import { LegalPageLayout } from "../legal/LegalPageLayout";
import { buildPageMetadata } from "../../lib/seo/build-metadata";

export const metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: "Cookie and tracking information for the Zar Labs website.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <p>Last updated: June 2026</p>
      <p>
        This site uses cookies and similar technologies to keep the website functional, understand usage,
        and improve performance.
      </p>
      <h2>Types of cookies</h2>
      <ul>
        <li>Essential cookies for navigation and security.</li>
        <li>Preference cookies (e.g. cookie consent choice).</li>
        <li>Analytics cookies when you accept and analytics is enabled.</li>
      </ul>
      <h2>Managing cookies</h2>
      <p>You can control cookies through your browser settings. Blocking essential cookies may affect site functionality.</p>
    </LegalPageLayout>
  );
}
