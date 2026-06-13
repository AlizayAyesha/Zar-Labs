import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import { completeText, getZarLabsSystemPrompt } from "../../../../lib/social-engine";

export async function POST() {
  try {
    await requireSocialEngineAccess();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await completeText({
      job: "brief",
      system: getZarLabsSystemPrompt(),
      user: 'Reply JSON: {"ok":true,"message":"Zar Labs Social Engine connected"}',
      jsonMode: true,
    });
    return Response.json({
      success: true,
      message: "Provider chain connected",
      routing: result._internal,
      data: result.data,
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: err.status || 500 });
  }
}
