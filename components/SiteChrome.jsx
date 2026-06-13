"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "../app/Navigation";

const HIDE_SITE_NAV_PREFIXES = ["/join", "/dashboard"];

export function SiteChrome({ children }) {
  const pathname = usePathname() || "";
  const hideNav = HIDE_SITE_NAV_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  return (
    <>
      {!hideNav ? <Navigation /> : null}
      {children}
    </>
  );
}
