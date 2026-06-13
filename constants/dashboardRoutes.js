/** Newsletter Control System — Admin Controls dock tab */

import { WEBSITE_CMS_PATHS } from "./websiteCmsPaths";

export { WEBSITE_CMS_PATHS, WEBSITE_CMS_LEGACY_REDIRECTS, PUBLIC_NEWSLETTER_PATHS } from "./websiteCmsPaths";

export const DASHBOARD_MODES = [
  {
    id: "social",
    label: "Social Media Management",
    defaultPath: "/dashboard/social-media-management/schedule-calendar",
    pathPrefixes: [
      "/dashboard/control-tower",
      "/dashboard/social-media-management",
      "/dashboard/site-system/social-engine",
      "/dashboard/channels",
    ],
  },
  {
    id: "booking",
    label: "Booking CRM",
    defaultPath: "/dashboard/channels/direct",
    pathPrefixes: ["/dashboard/booking-crm"],
  },
  {
    id: "website",
    label: "Newsletter Control System",
    defaultPath: WEBSITE_CMS_PATHS.newsletter.list,
    pathPrefixes: ["/dashboard/site-system/media-library", "/dashboard/site-system/newsletter"],
  },
];

export const SOCIAL_ENGINE_NAV = [
  { path: "/dashboard/social-media-management/schedule-calendar", label: "Schedule" },
  { path: "/dashboard/site-system/social-engine/strategy-chat", label: "Strategy Chat" },
  { path: "/dashboard/site-system/social-engine/image-studio", label: "Image Studio" },
  { path: "/dashboard/site-system/social-engine/trending-looks", label: "Trending Looks" },
  { path: "/dashboard/site-system/social-engine/my-account", label: "My Account" },
];

export const SOCIAL_NAV_SECTIONS = [
  {
    section: "Control Tower",
    items: [{ path: "/dashboard/control-tower", label: "Overview" }],
  },
  {
    section: "Publishing",
    items: [
      { path: "/dashboard/social-media-management/schedule-calendar", label: "Schedule" },
      { path: "/dashboard/social-media-management/link-ups", label: "Link Ups" },
      { path: "/dashboard/channels/social", label: "Channels" },
    ],
  },
  {
    section: "Social Engine",
    items: [
      ...SOCIAL_ENGINE_NAV,
      { path: "/dashboard/site-system/social-engine/configuration", label: "AI Configuration", adminOnly: true },
    ],
  },
];

export const BOOKING_CRM_NAV = [
  { path: "/dashboard/channels/direct", label: "Channels" },
  { path: "/dashboard/booking-crm/sheets-records", label: "Sheets Records" },
];

/** Tab 3 nav: Media Library + Newsletter (+ Subscribers sub-item only) */
export const NEWSLETTER_CONTROL_NAV = [
  {
    section: "Newsletter Control System",
    items: [
      { path: WEBSITE_CMS_PATHS.mediaLibrary, label: "Media Library" },
      {
        path: WEBSITE_CMS_PATHS.newsletter.list,
        label: "Newsletter",
        children: [{ path: WEBSITE_CMS_PATHS.newsletter.subscribers, label: "Subscribers" }],
      },
    ],
  },
];

export function getDashboardMode(pathname) {
  for (const mode of DASHBOARD_MODES) {
    if (mode.pathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return mode.id;
    }
  }
  if (pathname === "/dashboard" || pathname === "/dashboard/login") {
    return "social";
  }
  return "social";
}

export function getNavForMode(modeId, userRole = "admin") {
  if (modeId === "social") {
    if (userRole === "social") {
      return [
        {
          section: "Publishing",
          items: [{ path: "/dashboard/social-media-management/schedule-calendar", label: "Schedule" }],
        },
        {
          section: "Social Engine",
          items: SOCIAL_ENGINE_NAV.filter(
            (item) => item.path !== "/dashboard/social-media-management/schedule-calendar"
          ),
        },
      ];
    }
    return SOCIAL_NAV_SECTIONS.map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || userRole === "admin"),
    }));
  }
  if (modeId === "booking") return [{ section: "Booking CRM", items: BOOKING_CRM_NAV }];
  return NEWSLETTER_CONTROL_NAV;
}
