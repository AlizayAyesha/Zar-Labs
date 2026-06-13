/** Canonical dashboard paths for the Newsletter Control System (Admin Controls tab). */

export const WEBSITE_CMS_PATHS = {
  mediaLibrary: "/dashboard/site-system/media-library",
  newsletter: {
    list: "/dashboard/site-system/newsletter",
    new: "/dashboard/site-system/newsletter/new",
    edit: (id: string) => `/dashboard/site-system/newsletter/${id}`,
    subscribers: "/dashboard/site-system/newsletter/subscribers",
  },
} as const;

/** Legacy routes → canonical newsletter paths */
export const WEBSITE_CMS_LEGACY_REDIRECTS: Record<string, string> = {
  "/dashboard/site-system/posts": WEBSITE_CMS_PATHS.newsletter.list,
  "/dashboard/site-system/distribution": WEBSITE_CMS_PATHS.newsletter.list,
  "/dashboard/site-system/newsletter-topics": WEBSITE_CMS_PATHS.newsletter.list,
  "/dashboard/booking-crm/newsletter": WEBSITE_CMS_PATHS.newsletter.subscribers,
  "/dashboard/newsletter": WEBSITE_CMS_PATHS.newsletter.subscribers,
};

export const PUBLIC_NEWSLETTER_PATHS = {
  hub: "/newsletter",
  detail: (slug: string) => `/newsletter/${slug}`,
} as const;
