import "./globals.css";
import { Navigation } from "./Navigation";
import { Providers } from "./Providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zarlabs.com";

const siteTitle = "Zar Labs | Cutting-Edge Website Design & Custom Digital Solutions";
const siteDescription =
  "Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "website design",
    "UX/UI design",
    "web development",
    "full-stack development",
    "custom websites",
    "digital solutions",
    "social media management",
    "motion graphics",
    "3D motion graphics",
    "3D video production",
    "3D modeling",
    "interactive design",
    "creative digital agency",
    "multimedia design",
    "3D rendering services",
    "website redesign",
    "branding and design",
    "responsive web design",
    "animation services",
    "digital marketing solutions",
    "advanced video production",
    "digital media strategy",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/favicon-96.webp", sizes: "96x96", type: "image/webp" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Zar Labs",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zar Labs logo",
        type: "image/jpeg",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}

