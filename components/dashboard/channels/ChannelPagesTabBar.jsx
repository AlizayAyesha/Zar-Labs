"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHANNEL_PAGE_TABS, getChannelTabPath } from "../../../constants/social/distributionChannelTabs";

export function ChannelPagesTabBar() {
  const pathname = usePathname();

  return (
    <nav className="channel-pages-tab-bar" aria-label="Distribution channels">
      {CHANNEL_PAGE_TABS.map((tab) => {
        const href = getChannelTabPath(tab.id);
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={tab.id}
            href={href}
            className={`channel-pages-tab${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
