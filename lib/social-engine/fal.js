import { isQuotaOrLimitError, markStepExhausted, isStepExhausted, hydrateExhaustionCache } from "./exhaustion";

const FAL_MODELS_FAST = ["fal-ai/flux/schnell"];
const FAL_MODELS_QUALITY = ["fal-ai/flux/dev", "fal-ai/flux/schnell"];

async function callFalModel(model, key, prompt, { highQuality = false } = {}) {
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "square_hd",
      num_inference_steps: highQuality ? 28 : 8,
      num_images: 1,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.detail || json.message || `FAL HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const imageUrl = json.images?.[0]?.url || json.image?.url;
  if (!imageUrl) throw new Error("FAL returned no image URL");
  return { imageUrl, model };
}

export function buildImagePrompt(brief) {
  const headline = brief?.headline || brief?.title || "Zar Labs";
  const subline = brief?.subline || "";
  const layout = brief?.layout || "marketing template";
  const colors = Array.isArray(brief?.colors) ? brief.colors.join(", ") : brief?.colors || "#010101 #22c55e #d4af37";

  return `Professional B2B social media marketing template for Zar Labs (zar-labs.vercel.app), ${layout}. Headline text: "${headline}". ${subline ? `Subline: "${subline}".` : ""} Brand colors: ${colors}. Dark #010101 background, premium minimal tech aesthetic, high contrast, website-consistent typography, no watermark, 1080x1080, suitable for LinkedIn, Instagram, Snapchat, Facebook.`;
}

/** Silent failover across FAL models when credits/limits hit */
export async function generateFalImage({ prompt, falKey, highQuality = false }) {
  const key = falKey || process.env.FAL_KEY?.trim();
  if (!key) {
    const err = new Error("Image generation is temporarily unavailable. Please try again shortly.");
    err.status = 503;
    throw err;
  }

  await hydrateExhaustionCache();

  const models = highQuality ? FAL_MODELS_QUALITY : FAL_MODELS_FAST;

  for (const model of models) {
    if (isStepExhausted("fal", model)) continue;
    try {
      return await callFalModel(model, key, prompt, { highQuality });
    } catch (err) {
      if (isQuotaOrLimitError(err)) {
        await markStepExhausted("fal", model);
      }
    }
  }

  const error = new Error("Image generation is briefly at capacity. Please try again in a moment.");
  error.status = 503;
  throw error;
}
