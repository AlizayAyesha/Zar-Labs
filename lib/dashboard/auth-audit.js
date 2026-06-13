import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Log dashboard auth events to public.dashboard_auth_audit (service role). */
export async function logDashboardAuthEvent({
  eventType,
  email = null,
  userId = null,
  ipAddress = null,
  userAgent = null,
  metadata = {},
}) {
  const supabase = getServiceClient();
  if (!supabase) return;

  await supabase.rpc("log_dashboard_auth_event", {
    p_event_type: eventType,
    p_email: email,
    p_user_id: userId,
    p_ip_address: ipAddress,
    p_user_agent: userAgent,
    p_metadata: metadata,
  });
}
