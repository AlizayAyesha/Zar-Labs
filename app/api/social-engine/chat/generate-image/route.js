import { requireSocialEngineAccess } from "../../../../../lib/dashboard/access";
import { resolveEngineContext } from "../../../../../lib/social-engine/context";
import { assertUserLimit, recordUsage } from "../../../../../lib/social-engine/usage";
import { getEngineSettings } from "../../../../../lib/social-engine/engine-settings";
import { generateMarketingImage } from "../../../../../lib/social-engine/generate-image";
import {
  normalizeBrief,
  buildPromptFromBrief,
  findPendingBrief,
} from "../../../../../lib/social-engine/chat-images";
import { getChatSession, appendChatMessages } from "../../../../../lib/social-engine/chat";
import { createServerClient } from "../../../../../lib/supabase/server";

export async function POST(request) {
  let failPrompt = null;
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    const settings = await getEngineSettings();

    if (settings.strategyChatImages === "disabled") {
      return Response.json({ error: "Image generation in Strategy Chat is disabled by admin." }, { status: 403 });
    }

    assertUserLimit(engine.usage, engine.limits, "images");

    const body = await request.json();
    const sessionId = body.sessionId;
    let brief = normalizeBrief(body.brief || body.imageBrief);

    if (!engine.member) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!sessionId) {
      return Response.json({ error: "sessionId required" }, { status: 400 });
    }

    const session = await getChatSession(sessionId, engine.member.id);
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const history = session.messages || [];
    if (!brief) {
      const pending = findPendingBrief(history);
      if (!pending) {
        return Response.json({ error: "No image brief to generate. Ask for a visual first." }, { status: 400 });
      }
      brief = pending.brief;
    }

    const prompt = buildPromptFromBrief(brief);
    failPrompt = prompt;
    const { imageUrl, model, provider } = await generateMarketingImage({
      brief,
      prompt,
      planId: engine.plan,
      falKey: engine.byok?.fal,
      geminiKey: engine.byok?.gemini,
    });

    await recordUsage({
      provider: provider || "fal",
      userEmail: user.email,
      metric: "imagesGenerated",
    });

    const watermark = engine.plan === "free" && !user.isAdmin && engine.limits.watermark;

    if (engine.member) {
      try {
        const db = createServerClient();
        await db.from("social_engine_generated_images").insert({
          member_id: engine.member.id,
          prompt,
          brief,
          image_url: imageUrl,
          model: model || "unknown",
          plan: engine.plan,
        });
      } catch {
        /* optional table */
      }
    }

    const imageMessage = {
      role: "assistant",
      content: "Here's your generated image — confirm the brief looked right or ask me to adjust headline/layout for another version.",
      at: new Date().toISOString(),
      imageBrief: brief,
      imageUrl,
      imagePrompt: prompt,
      watermark,
      model: model || null,
    };

    await appendChatMessages(sessionId, engine.member.id, [imageMessage]);

    return Response.json({
      success: true,
      imageUrl,
      watermark,
      prompt,
      model,
      provider: provider || "fal",
      message: imageMessage,
    });
  } catch (err) {
    const settings = await getEngineSettings();
    const payload = { error: err.message };
    if (settings.showCopyPromptOnFail && failPrompt) {
      payload.prompt = failPrompt;
    }
    return Response.json(payload, { status: err.status || 500 });
  }
}
