/** Form / lead sources shown in Sheets Records and dashboard labels */

export const INTERACTION_SOURCES = [
  "contact",
  "subscription",
  "project_intake",
  "meeting_booking",
  "documentation_request",
  "newsletter_footer",
  "portal",
] as const;

export type InteractionSource = (typeof INTERACTION_SOURCES)[number];

export const SOURCE_LABEL: Record<string, string> = {
  contact: "Contact page",
  subscription: "Newsletter signup",
  project_intake: "Project intake (Formspree)",
  meeting_booking: "Calendly / meeting booking",
  documentation_request: "Documentation request",
  newsletter_footer: "Footer newsletter",
  portal: "Channel portal (/go/*)",
};

/** Google Sheets export — configure when Sheets sync is enabled */
export const GOOGLE_SHEETS_RANGE = "Leads!A:H";

export const GOOGLE_SHEETS_HEADERS = [
  "Created",
  "Source",
  "Name",
  "Email",
  "Subject",
  "Channel",
  "Portal slug",
  "Payload summary",
];
