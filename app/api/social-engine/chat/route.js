import { requireSocialEngineAccess } from "../../../../lib/dashboard/access";
import {
  validateUserMessage,
  getGuardrailedChatSystemPrompt,
  completeChat,
} from "../../../../lib/social-engine";
import { resolveEngineContext } from "../../../../lib/social-engine/context";
import { assertUserLimit, recordUsage } from "../../../../lib/social-engine/usage";
import { getEngineSettings } from "../../../../lib/social-engine/engine-settings";
import {
  extractImageBrief,
  isImageConfirmMessage,
  findPendingBrief,
  buildPromptFromBrief,
} from "../../../../lib/social-engine/chat-images";
import { generateMarketingImage } from "../../../../lib/social-engine/generate-image";
import {
  listChatSessions,
  getChatSession,
  createChatSession,
  appendChatMessages,
} from "../../../../lib/social-engine/chat";
import { getOrCreateMemberProfile } from "../../../../lib/social-engine/profile";
import { createServerClient } from "../../../../lib/supabase/server";

export async function GET(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engineSettings = await getEngineSettings();
    const ctx = await getOrCreateMemberProfile({ email: user.email, isAdmin: user.isAdmin });
    if (!ctx?.member && !user.isAdmin) return Response.json({ error: "Forbidden" }, { status: 403 });

    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (sessionId && ctx?.member) {
      const session = await getChatSession(sessionId, ctx.member.id);
      return Response.json({ session, engineSettings });
    }
    if (ctx?.member) {
      const sessions = await listChatSessions(ctx.member.id);
      return Response.json({ sessions, engineSettings });
    }
    return Response.json({ sessions: [], engineSettings });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

async function generateConfirmedImage({ user, engine, sessionId, brief, history }) {
  assertUserLimit(engine.usage, engine.limits, "images");
  const prompt = buildPromptFromBrief(brief);
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
      /* optional */
    }
  }

  const userMsg = {
    role: "user",
    content: history[history.length - 1]?.content || "Generate the image",
    at: new Date().toISOString(),
  };
  const imageMessage = {
    role: "assistant",
    content: "Generated your marketing image below. Want a variation? Tell me what to tweak in the brief.",
    at: new Date().toISOString(),
    imageBrief: brief,
    imageUrl,
    imagePrompt: prompt,
    watermark,
    model: model || null,
  };

  await appendChatMessages(sessionId, engine.member.id, [userMsg, imageMessage]);

  return { imageUrl, watermark, prompt, model, provider: provider || "fal", reply: imageMessage.content, imageMessage };
}

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    const engineSettings = await getEngineSettings();
    assertUserLimit(engine.usage, engine.limits, "chatMessages");

    const body = await request.json();
    const message = body.message?.trim();
    if (!message) return Response.json({ error: "message required" }, { status: 400 });

    const check = validateUserMessage(message);
    if (!check.allowed) {
      return Response.json({ error: check.reason }, { status: 400 });
    }

    if (!engine.member && !user.isAdmin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    let sessionId = body.sessionId;
    if (!sessionId && engine.member) {
      const session = await createChatSession(engine.member.id, message.slice(0, 48));
      sessionId = session.id;
    }

    const session = engine.member ? await getChatSession(sessionId, engine.member.id) : null;
    const history = session?.messages || [];

    const wantsImage =
      engineSettings.strategyChatImages !== "disabled" &&
      (engineSettings.strategyChatImages === "command_only"
        ? isImageConfirmMessage(message)
        : isImageConfirmMessage(message));

    if (wantsImage && engine.member && sessionId) {
      const pending = findPendingBrief(history);
      if (pending) {
        const generated = await generateConfirmedImage({
          user,
          engine,
          sessionId,
          brief: pending.brief,
          history: [...history, { role: "user", content: message }],
        });
        return Response.json({
          success: true,
          sessionId,
          reply: generated.reply,
          imageUrl: generated.imageUrl,
          watermark: generated.watermark,
          imageBrief: pending.brief,
          generatedImage: true,
          engineSettings,
        });
      }
    }

    const system = getGuardrailedChatSystemPrompt(engine.profile || {}, engineSettings);
    const taskContext = body.taskContext?.trim();
    const userContent = taskContext ? `${taskContext}\n\nUser: ${message}` : message;

    const messages = [
      { role: "system", content: system },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ];

    const result = await completeChat({
      messages,
      plan: engine.plan,
      userEmail: user.email,
      userBudgetOverride: engine.tokenBudgetOverride,
      userByokKeys: engine.byok,
    });

    let assistantContent = typeof result.data === "string" ? result.data : String(result.data);
    let imageBrief = null;

    if (engineSettings.chatImageBriefsEnabled && engineSettings.strategyChatImages !== "disabled") {
      const parsed = extractImageBrief(assistantContent);
      assistantContent = parsed.content;
      imageBrief = parsed.brief;
    }

    const assistantMessage = {
      role: "assistant",
      content: assistantContent,
      at: new Date().toISOString(),
      ...(imageBrief ? { imageBrief } : {}),
    };

    const newMessages = [
      { role: "user", content: message, at: new Date().toISOString() },
      assistantMessage,
    ];

    if (engine.member && sessionId) {
      await appendChatMessages(sessionId, engine.member.id, newMessages);
    }

    return Response.json({
      success: true,
      sessionId,
      reply: assistantContent,
      imageBrief,
      engineSettings,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
