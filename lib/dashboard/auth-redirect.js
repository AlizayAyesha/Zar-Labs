/** Build Supabase auth callback URL (password reset, magic links). */
export function buildAuthCallbackUrl(nextPath = "/dashboard") {
  if (typeof window !== "undefined") {
    const next = encodeURIComponent(nextPath);
    return `${window.location.origin}/auth/callback?next=${next}`;
  }

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://zar-labs.vercel.app";
  const next = encodeURIComponent(nextPath);
  return `${site}/auth/callback?next=${next}`;
}

export const RESET_PASSWORD_NEXT = "/dashboard/login/reset-password";
