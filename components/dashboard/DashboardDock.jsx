"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_MODES, getDashboardMode } from "../../constants/dashboardRoutes";

export function DashboardDock({ userRole = "admin" }) {
  const pathname = usePathname();
  const activeMode = getDashboardMode(pathname);
  const modes =
    userRole === "social" ? DASHBOARD_MODES.filter((mode) => mode.id === "social") : DASHBOARD_MODES;

  return (
    <nav className="dashboard-dock" aria-label="Dashboard modes">
      {modes.map((mode) => (
        <Link
          key={mode.id}
          href={mode.defaultPath}
          className={`dashboard-dock-tab${activeMode === mode.id ? " is-active" : ""}`}
        >
          {mode.label}
        </Link>
      ))}
    </nav>
  );
}
