import { createServerAuthClient } from "../../../../../lib/supabase/server-ssr";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createServerAuthClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
