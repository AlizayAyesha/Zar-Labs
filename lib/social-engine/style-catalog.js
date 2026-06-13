import { createServerClient } from "../supabase/server";

export const DEFAULT_CATALOG_SEED = [
  {
    slug: "executive-dark-premium",
    title: "Executive — Dark Premium",
    description: "Professional LinkedIn headshot on #010101 with green accent rim light.",
    category: "headshot",
    tags: ["linkedin", "professional", "trending"],
    preview_url: "https://zar-labs.vercel.app/images/zarlabs-logo.webp",
    prompt:
      "Professional executive headshot portrait, dark studio background #010101, subtle green rim light #22c55e, premium B2B tech aesthetic, sharp focus, photorealistic, 1080x1080",
    trending_score: 100,
    status: "published",
  },
  {
    slug: "zar-quote-card-green",
    title: "Zar Labs Quote Card",
    description: "Marketing quote card — dark bg, gold and green accents.",
    category: "marketing",
    tags: ["quote", "carousel", "zar-labs"],
    preview_url: "https://zar-labs.vercel.app/images/zarlabs-logo.webp",
    prompt:
      "Minimal B2B social quote card, dark #010101 background, headline space, green #22c55e and gold #d4af37 accents, premium typography, 1080x1080, Zar Labs brand style",
    fal_model: "fal-ai/flux/schnell",
    fal_params: { num_inference_steps: 12 },
    requires_face: false,
    trending_score: 90,
    status: "published",
  },
  {
    slug: "founder-spotlight",
    title: "Founder Spotlight",
    description: "Warm founder portrait for Instagram and LinkedIn.",
    category: "trending",
    tags: ["founder", "instagram", "portrait"],
    preview_url: "https://zar-labs.vercel.app/images/zarlabs-logo.webp",
    prompt:
      "Founder portrait for social media, confident approachable expression, soft professional lighting, blurred modern office background, photorealistic portrait photography",
    trending_score: 85,
    status: "published",
  },
];

export async function listCatalogItems({ status, limit = 100, offset = 0, allStatuses = false } = {}) {
  const db = createServerClient();
  let query = db
    .from("social_engine_style_catalog")
    .select(
      "id, slug, title, description, category, tags, preview_url, requires_face, trending_score, usage_count, status, prompt, fal_model, fal_params"
    )
    .order("trending_score", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!allStatuses) query = query.eq("status", status || "published");

  const { data, error } = await query;
  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }
  return data || [];
}

export async function getCatalogItem(idOrSlug) {
  const db = createServerClient();
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);
  const { data, error } = await db
    .from("social_engine_style_catalog")
    .select("*")
    .eq(isUuid ? "id" : "slug", idOrSlug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertCatalogItem(item) {
  const db = createServerClient();
  const payload = {
    ...item,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await db
    .from("social_engine_style_catalog")
    .upsert(payload, { onConflict: "slug" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCatalogItem(id) {
  const db = createServerClient();
  const { error } = await db.from("social_engine_style_catalog").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementCatalogUsage(id) {
  const db = createServerClient();
  const item = await getCatalogItem(id);
  if (!item) return;
  await db
    .from("social_engine_style_catalog")
    .update({ usage_count: (item.usage_count || 0) + 1, updated_at: new Date().toISOString() })
    .eq("id", item.id);
}

export async function seedCatalogIfEmpty() {
  const db = createServerClient();
  const { count } = await db.from("social_engine_style_catalog").select("id", { count: "exact", head: true });
  if (count > 0) return;
  for (const item of DEFAULT_CATALOG_SEED) {
    await db.from("social_engine_style_catalog").insert(item);
  }
}

export async function recordCatalogGeneration({ memberId, ownerEmail, catalogId, uploadUrl, resultUrl, plan }) {
  const db = createServerClient();
  await db.from("social_engine_catalog_generations").insert({
    member_id: memberId,
    owner_email: ownerEmail.toLowerCase(),
    catalog_id: catalogId,
    upload_url: uploadUrl,
    result_url: resultUrl,
    plan,
  });
  if (catalogId) await incrementCatalogUsage(catalogId);
}
