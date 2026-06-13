"use client";

import Link from "next/link";
import { PUBLISHING_HUB_CARDS } from "../../../constants/social/publishingHubCards";

export function PublishingHubCards({ title = "Publishing", description, compact = false }) {
  return (
    <div className={compact ? undefined : "dashboard-card"}>
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="admin-cms-placeholder">{description}</p> : null}
      <div className="channel-hub-grid">
        {PUBLISHING_HUB_CARDS.map((card) => (
          <Link key={card.id} href={card.href} className="channel-hub-card dashboard-card">
            <h3>{card.label}</h3>
            <p>{card.description}</p>
            <span className="channel-hub-cta">{card.cta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
