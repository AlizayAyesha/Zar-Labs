import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import {
  buildWeekUserPrompt,
  completeText,
  getZarLabsSystemPrompt,
  stripInternalMeta,
} from "../../../../lib/social-engine";
import { resolveEngineContext } from "../../../../lib/social-engine/context";
import { assertUserLimit } from "../../../../lib/social-engine/usage";

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    assertUserLimit(engine.usage, engine.limits, "weekPlans");
  } catch (err) {
    return Response.json({ error: err.message || "Unauthorized" }, { status: err.status || 401 });
  }

  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    const body = await request.json();
    const { brandId = "build", weekStart, theme } = body;

    const result = await completeText({
      job: "strategy",
      system: getZarLabsSystemPrompt(),
      user: buildWeekUserPrompt({ brandId, weekStart: weekStart || new Date().toISOString().slice(0, 10), theme }),
      jsonMode: true,
      plan: engine.plan,
      userEmail: user.email,
      userBudgetOverride: engine.tokenBudgetOverride,
      userByokKeys: engine.byok,
      metric: "weekPlans",
    });

    return Response.json({
      success: true,
      ...stripInternalMeta(result),
      topicPlannerMarkdown: result.data?.topicPlannerMarkdown || "",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
