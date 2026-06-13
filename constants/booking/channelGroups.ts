/** Which booking / CTA channels Zar Labs exposes */

export type ChannelKey =
  | "linkedin"
  | "instagram"
  | "snapchat"
  | "facebook"
  | "whatsapp"
  | "website"
  | "email"
  | "referral";

export const CHANNEL_GROUPS = [
  {
    id: "social",
    label: "Social",
    channels: ["linkedin", "instagram", "snapchat", "facebook", "whatsapp"] as ChannelKey[],
  },
  {
    id: "direct",
    label: "Direct",
    channels: ["website", "email", "referral"] as ChannelKey[],
  },
] as const;

export const CHANNEL_META: Record<
  ChannelKey,
  { label: string; icon: string; defaultSlug: string; description: string }
> = {
  linkedin: {
    label: "LinkedIn",
    icon: "LinkedIn",
    defaultSlug: "linkedin",
    description: "Consultation portal for LinkedIn profile and post links",
  },
  instagram: {
    label: "Instagram",
    icon: "Instagram",
    defaultSlug: "instagram",
    description: "Bio link and story CTA landing page",
  },
  snapchat: {
    label: "Snapchat",
    icon: "Snapchat",
    defaultSlug: "snapchat",
    description: "Snap, story, and Spotlight CTAs with booking link",
  },
  facebook: {
    label: "Facebook",
    icon: "Facebook",
    defaultSlug: "facebook",
    description: "Page posts, stories, and Messenger-adjacent funnels",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "WhatsApp",
    defaultSlug: "whatsapp",
    description: "Status, broadcast lists, and Business click-to-chat CTAs",
  },
  website: {
    label: "Website",
    icon: "Web",
    defaultSlug: "website",
    description: "Default site-wide booking funnel",
  },
  email: {
    label: "Email",
    icon: "Email",
    defaultSlug: "email",
    description: "Email signature and outreach links",
  },
  referral: {
    label: "Referral / Partner",
    icon: "Partner",
    defaultSlug: "referral",
    description: "Partner and referral tracked bookings",
  },
};

export const ALL_CHANNEL_KEYS = Object.keys(CHANNEL_META) as ChannelKey[];
