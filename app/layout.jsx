import "./globals.css";
import { Navigation } from "./Navigation";
import { Providers } from "./Providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zarlabs.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zar Labs | Cutting-Edge Website Design & Custom Digital Solutions",
  description:
    "Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality.",
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
      { url: "/favicon-48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/favicon-96.webp", sizes: "96x96", type: "image/webp" },
      { url: "/images/zarlabs-logo-192.webp", sizes: "192x192", type: "image/webp" },
    ],
    apple: [{ url: "/images/zarlabs-logo-192.webp", sizes: "180x180", type: "image/webp" }],
    shortcut: "/favicon-48.webp",
  },
  openGraph: {
    title: "Zar Labs | Cutting-Edge Website Design & Custom Digital Solutions",
    description:
      "Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality.",
    url: siteUrl,
    siteName: "Zar Labs",
    images: [
      {
        url: "/images/zarlabs-logo-192.webp",
        width: 192,
        height: 192,
        alt: "Zar Labs logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zar Labs | Cutting-Edge Website Design & Custom Digital Solutions",
    description:
      "Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality.",
    images: ["/images/zarlabs-logo-192.webp"],
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

