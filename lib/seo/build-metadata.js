import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./site";

/**
 * Full page metadata: title, description, canonical OG + Twitter.
 */
export function buildPageMetadata({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}) {
  const url = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL;
  const fullTitle = title.includes(SITE_NAME) ? title : `${SITE_NAME} | ${title}`;
  const imageUrl = ogImage.startsWith("http") ? ogImage : ogImage;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${title.replace(`${SITE_NAME} | `, "")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      site: "@zarlabs",
    },
  };
}
