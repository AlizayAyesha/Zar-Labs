import { logDashboardAuthEvent } from "../../../../../lib/dashboard/auth-audit";
import { getDashboardUser } from "../../../../../lib/dashboard/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventType, email, metadata } = body;

    const allowed = [
      "login_success",
      "login_failed",
      "logout",
      "password_reset_requested",
      "password_reset_completed",
    ];

    if (!allowed.includes(eventType)) {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent") || null;

    const user = await getDashboardUser().catch(() => null);

    await logDashboardAuthEvent({
      eventType,
      email: email || user?.email || null,
      userId: user?.id ?? null,
      ipAddress: ip,
      userAgent,
      metadata: metadata || {},
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Audit log failed" }, { status: 500 });
  }
}
