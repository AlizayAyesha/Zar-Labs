"use client";

import Link from "next/link";
import { CHANNEL_META } from "../../../constants/booking/channelGroups";
import { getChannelTabPath, SOCIAL_HUB_CHANNELS } from "../../../constants/social/distributionChannelTabs";

export function ChannelHubDashboard({ variant }) {
  const keys = variant === "social" ? SOCIAL_HUB_CHANNELS : ["website", "email", "referral"];
  const title = variant === "social" ? "Social channels" : "Direct channels";
  const description =
    variant === "social"
      ? "LinkedIn, Instagram, Snapchat, Facebook, and WhatsApp — booking portals (/go/*), link-up templates, and post production."
      : "Website, email, and partner referral — booking funnels and tracked CTAs.";

  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      <p className="admin-cms-placeholder">{description}</p>
      <div className="channel-hub-grid">
        {keys.map((key) => {
          const meta = CHANNEL_META[key];
          return (
            <Link key={key} href={getChannelTabPath(key)} className="channel-hub-card dashboard-card">
              <h3>{meta.label}</h3>
              <p>{meta.description}</p>
              <span className="channel-hub-cta">Open channel →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
