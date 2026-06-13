"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardDock } from "./DashboardDock";
import { getDashboardMode, getNavForMode } from "../../constants/dashboardRoutes";
import { logAuthClient } from "../../lib/dashboard/log-auth-client";

export function DashboardNav({ userEmail, userRole = "admin" }) {
  const pathname = usePathname();
  const activeMode = getDashboardMode(pathname);
  const navSections = getNavForMode(activeMode, userRole);

  async function handleLogout() {
    logAuthClient("logout", userEmail);
    await fetch("/api/dashboard/auth/logout", { method: "POST" });
    window.location.href = "/dashboard/login";
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand">
        Zar Labs
        <span>Dashboard</span>
      </div>

      <DashboardDock userRole={userRole} />

      {navSections.map((group) => (
        <nav key={group.section} className="dashboard-nav-section">
          <div className="dashboard-nav-label">{group.section}</div>
          {group.items.map((item) => {
            const isActive = item.matchExact
              ? pathname === item.path
              : pathname === item.path ||
                (item.path !== "/dashboard/control-tower" && pathname.startsWith(`${item.path}/`));
            return (
              <div key={item.path}>
                <Link
                  href={item.path}
                  className={`dashboard-nav-link${isActive ? " is-active" : ""}`}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => {
                  const childActive =
                    pathname === child.path || pathname.startsWith(`${child.path}/`);
                  return (
                    <Link
                      key={child.path}
                      href={child.path}
                      className={`dashboard-nav-link dashboard-nav-sublink${childActive ? " is-active" : ""}`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      ))}

      <div className="dashboard-logout">
        <p style={{ fontSize: "0.75rem", color: "#666", margin: "0 0 0.5rem", padding: "0 0.5rem" }}>
          {userEmail}
        </p>
        <button type="button" className="dashboard-btn" onClick={handleLogout} style={{ width: "100%" }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
