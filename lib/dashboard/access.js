import { createServerAuthClient } from "../supabase/server-ssr";
import { isSocialEngineMemberInDb } from "../social-engine/members";
import { isAdminEmail, getAdminEmails } from "./auth";

function parseEmailList(raw) {
  return (raw || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function getSocialEngineAllowedEmails() {
  return parseEmailList(process.env.SOCIAL_ENGINE_ALLOWED_EMAILS);
}

export function isSocialEngineMemberEmail(email) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  if (isAdminEmail(normalized)) return true;
  const allowed = getSocialEngineAllowedEmails();
  if (allowed.includes(normalized)) return true;
  return false;
}

export function isSocialEngineRoute(pathname) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/dashboard/social-media-management") ||
    pathname.startsWith("/dashboard/control-tower") ||
    pathname.startsWith("/dashboard/site-system/social-engine") ||
    pathname.startsWith("/api/social-engine") ||
    pathname.startsWith("/api/publishing-calendar-data")
  );
}

export async function getAuthenticatedUser() {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Full dashboard — admins only */
export async function getDashboardAdminUser() {
  const user = await getAuthenticatedUser();
  if (!user?.email || !isAdminEmail(user.email)) return null;
  return { ...user, role: "admin" };
}

/** Social Engine + full dashboard for admins */
export async function getDashboardAccessUser() {
  const user = await getAuthenticatedUser();
  if (!user?.email) return null;
  const allowed = await isSocialEngineMemberInDb(user.email);
  if (!allowed) return null;
  return {
    ...user,
    role: isAdminEmail(user.email) ? "admin" : "social",
    isAdmin: isAdminEmail(user.email),
  };
}

/** Middleware — env list + Supabase members table */
export async function isSocialEngineMemberAsync(email) {
  if (!email) return false;
  if (isSocialEngineMemberEmail(email)) return true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const res = await fetch(
      `${url}/rest/v1/social_engine_members?email=eq.${encodeURIComponent(email.toLowerCase())}&status=eq.active&select=id`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return false;
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

export async function requireSocialEngineAccess() {
  const user = await getDashboardAccessUser();
  if (!user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return user;
}

export async function requireDashboardAdmin() {
  const user = await getDashboardAdminUser();
  if (!user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return user;
}

export { getAdminEmails, isAdminEmail };
