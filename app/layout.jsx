import "./globals.css";
import { Navigation } from "./Navigation";
import { Providers } from "./Providers";
import { JsonLd } from "../components/seo/JsonLd";
import { buildPageMetadata } from "../lib/seo/build-metadata";
import { SAME_AS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/seo/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildPageMetadata({
    title: "Cutting-Edge Website Design & Custom Digital Solutions",
    description:
      "Harnessing cutting-edge visualization technology to transform vision into tailored digital reality. Custom software, AI automation, and web design by Zar Labs.",
    path: "/",
  }),
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.jpg`,
      description: SITE_DESCRIPTION,
      email: "zarlabsteam@gmail.com",
      telephone: "+923307063298",
      sameAs: SAME_AS,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationSchema} />
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
