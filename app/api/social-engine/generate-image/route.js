import { requireSocialEngineAccess, requireDashboardAdmin } from "../../../../lib/dashboard/access";
import { resolveEngineContext } from "../../../../lib/social-engine/context";
import { assertUserLimit, recordUsage } from "../../../../lib/social-engine/usage";
import { generateMarketingImage } from "../../../../lib/social-engine/generate-image";
import { buildImagePrompt } from "../../../../lib/social-engine/fal";
import { createServerClient } from "../../../../lib/supabase/server";

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    assertUserLimit(engine.usage, engine.limits, "images");

    const body = await request.json();
    const brief = body.brief || {
      headline: body.headline || "Zar Labs",
      subline: body.subline || "",
      layout: body.layout || "quote-card",
      colors: body.colors || ["#010101", "#22c55e", "#d4af37"],
    };

    const prompt = body.prompt || buildImagePrompt(brief);
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
        /* table may not exist until migration */
      }
    }

    const watermark = engine.plan === "free" && !user.isAdmin && engine.limits.watermark;

    return Response.json({
      success: true,
      imageUrl,
      watermark,
      provider: provider || "fal",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}

export async function GET() {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    if (!engine.member) return Response.json({ images: [] });

    const db = createServerClient();
    const { data } = await db
      .from("social_engine_generated_images")
      .select("id, image_url, prompt, created_at")
      .eq("member_id", engine.member.id)
      .order("created_at", { ascending: false })
      .limit(24);
    return Response.json({ images: data || [] });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
