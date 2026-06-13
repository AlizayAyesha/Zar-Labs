import { NextResponse } from "next/server";
import { createServerAuthClient } from "../../../lib/supabase/server-ssr";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") || "/dashboard";

  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = createServerAuthClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL("/dashboard/login", origin);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(loginUrl);
}
