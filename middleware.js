import { NextResponse } from "next/server";
import { isAdminEmail } from "./lib/dashboard/auth";
import { isSocialEngineRoute, isSocialEngineMemberAsync } from "./lib/dashboard/access";
import { createMiddlewareSupabase } from "./lib/supabase/server-ssr";

const SOCIAL_DEFAULT = "/dashboard/social-media-management/schedule-calendar";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const { supabase, getResponse } = createMiddlewareSupabase(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginRoute = pathname.startsWith("/dashboard/login");

  if (isLoginRoute) {
    if (user?.email) {
      const isAdmin = isAdminEmail(user.email);
      const isSocial = isAdmin || (await isSocialEngineMemberAsync(user.email));
      if (isSocial) {
        const next = request.nextUrl.searchParams.get("next");
        const target = next && (isAdmin || isSocialEngineRoute(next)) ? next : SOCIAL_DEFAULT;
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
    return getResponse();
  }

  if (!user?.email) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminEmail(user.email)) {
    return getResponse();
  }

  const isSocialMember = await isSocialEngineMemberAsync(user.email);
  if (!isSocialMember) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isSocialEngineRoute(pathname) || pathname === "/dashboard") {
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(SOCIAL_DEFAULT, request.url));
    }
    return getResponse();
  }

  return NextResponse.redirect(new URL(SOCIAL_DEFAULT, request.url));
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
