import { requireSocialEngineAccess } from "../../../../../lib/dashboard/access";
import { resolveEngineContext } from "../../../../../lib/social-engine/context";
import { assertUserLimit, recordUsage } from "../../../../../lib/social-engine/usage";
import { getCatalogItem, recordCatalogGeneration } from "../../../../../lib/social-engine/style-catalog";
import { generateFromCatalogTemplate } from "../../../../../lib/social-engine/catalog-generate";

export async function POST(request) {
  try {
    const user = await requireSocialEngineAccess();
    const engine = await resolveEngineContext(user);
    assertUserLimit(engine.usage, engine.limits, "images");

    const body = await request.json();
    const catalogId = body.catalogId || body.catalog_id;
    const userImageUrl = body.userImageUrl || body.user_image_url || body.uploadUrl;

    if (!catalogId) {
      return Response.json({ error: "catalogId required" }, { status: 400 });
    }

    const item = await getCatalogItem(catalogId);
    if (!item || item.status !== "published") {
      return Response.json({ error: "Style not found" }, { status: 404 });
    }

    const { imageUrl, model } = await generateFromCatalogTemplate({
      catalogItem: item,
      userImageUrl,
      planId: engine.plan,
      falKey: engine.byok?.fal,
      geminiKey: engine.byok?.gemini,
    });

    await recordUsage({
      provider: "fal",
      userEmail: user.email,
      metric: "imagesGenerated",
    });

    await recordCatalogGeneration({
      memberId: engine.member?.id,
      ownerEmail: user.email,
      catalogId: item.id,
      uploadUrl: userImageUrl,
      resultUrl: imageUrl,
      plan: engine.plan,
    });

    const watermark = engine.plan === "free" && !user.isAdmin && engine.limits.watermark;

    return Response.json({
      success: true,
      imageUrl,
      model,
      watermark,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: err.status || 500 });
  }
}
