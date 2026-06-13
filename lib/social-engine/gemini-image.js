import { isQuotaOrLimitError, markStepExhausted, isStepExhausted, hydrateExhaustionCache } from "./exhaustion";
import { buildImagePrompt } from "./fal";

/** Nano Banana family — Gemini native image generation (fallback when FAL credits low) */
const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-2.0-flash-exp-image-generation",
  "gemini-2.0-flash-preview-image-generation",
];

async function callGeminiImageModel(model, apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || `Gemini image HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const parts = json.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    const inline = part.inlineData || part.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType || inline.mime_type || "image/png";
      return {
        imageUrl: `data:${mime};base64,${inline.data}`,
        model: `gemini:${model}`,
      };
    }
  }

  throw new Error("Gemini returned no image data");
}

/** Try Gemini Nano Banana models — may require billing on some accounts */
export async function generateGeminiImage({ prompt, geminiKey }) {
  const key = geminiKey || process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    const err = new Error("Gemini image fallback unavailable");
    err.status = 503;
    throw err;
  }

  await hydrateExhaustionCache();

  for (const model of GEMINI_IMAGE_MODELS) {
    if (isStepExhausted("gemini-image", model)) continue;
    try {
      return await callGeminiImageModel(model, key, prompt);
    } catch (err) {
      if (isQuotaOrLimitError(err)) {
        await markStepExhausted("gemini-image", model);
      }
    }
  }

  const error = new Error("Gemini image generation unavailable on this API key (billing may be required).");
  error.status = 503;
  throw error;
}

export { buildImagePrompt };
