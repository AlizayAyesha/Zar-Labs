import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const source = String(body.source || "website").slice(0, 64);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Newsletter service is not configured. Contact us at zarlabsteam@gmail.com." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      status: "active",
      metadata: { source, subscribed_at: new Date().toISOString() },
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, message: "You are already subscribed." });
      }
      console.error("[newsletter]", error);
      return NextResponse.json({ error: "Could not subscribe. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
