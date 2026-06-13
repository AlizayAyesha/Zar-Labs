import { generateMarketingImage } from "./generate-image";

async function falImageToImage({ imageUrl, prompt, falKey, model, params = {} }) {
  const key = falKey || process.env.FAL_KEY?.trim();
  if (!key) throw new Error("FAL_KEY not configured");

  const endpoint = model || "fal-ai/flux/dev/image-to-image";
  const res = await fetch(`https://fal.run/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_url: imageUrl,
      strength: params.strength ?? 0.65,
      num_inference_steps: params.num_inference_steps ?? 28,
      image_size: "square_hd",
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.detail || json.message || `FAL img2img HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const url = json.images?.[0]?.url || json.image?.url;
  if (!url) throw new Error("No image returned");
  return { imageUrl: url, model: endpoint };
}

/**
 * Catalog generation: user photo + locked admin template prompt.
 * Falls back to text-to-image if img2img unavailable.
 */
export async function generateFromCatalogTemplate({
  catalogItem,
  userImageUrl,
  planId,
  falKey,
  geminiKey,
}) {
  const prompt = [
    catalogItem.prompt,
    catalogItem.negative_prompt ? `Avoid: ${catalogItem.negative_prompt}` : "",
    "Zar Labs premium B2B aesthetic, high quality, photorealistic where applicable.",
  ]
    .filter(Boolean)
    .join(" ");

  const highQuality = planId === "pro" || planId === "included" || planId === "enterprise";

  if (userImageUrl && catalogItem.fal_model?.includes("image-to-image")) {
    try {
      return await falImageToImage({
        imageUrl: userImageUrl,
        prompt,
        falKey,
        model: catalogItem.fal_model,
        params: catalogItem.fal_params || {},
      });
    } catch {
      /* fall through to text pipeline */
    }
  }

  return generateMarketingImage({
    brief: { headline: catalogItem.title, layout: catalogItem.category },
    prompt,
    planId,
    falKey,
    geminiKey,
    highQuality,
  });
}
