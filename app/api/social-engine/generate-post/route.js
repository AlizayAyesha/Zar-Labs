import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import { buildPostUserPrompt, completeText, getZarLabsSystemPrompt, stripInternalMeta } from "../../../../lib/social-engine";
import { resolveEngineContext } from "../../../../lib/social-engine/context";
import { assertUserLimit } from "../../../../lib/social-engine/usage";

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    assertUserLimit(engine.usage, engine.limits, "chatMessages");
    const body = await request.json();
    const task = body.task;
    if (!task) return Response.json({ error: "task required" }, { status: 400 });

    const result = await completeText({
      job: "copy",
      system: getZarLabsSystemPrompt(),
      user: buildPostUserPrompt(task),
      jsonMode: true,
      plan: engine.plan,
      userEmail: user.email,
      userBudgetOverride: engine.tokenBudgetOverride,
      userByokKeys: engine.byok,
      metric: "chatMessages",
    });

    return Response.json({ success: true, ...stripInternalMeta(result) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 401 });
  }
}
