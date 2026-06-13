import { createServerAuthClient } from "../supabase/server-ssr";

export function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email) {
  if (!email) return false;
  const admins = getAdminEmails();
  if (!admins.length) return false;
  return admins.includes(email.toLowerCase());
}

export async function getDashboardUser() {
  const supabase = createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();
  if (!user) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return user;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
