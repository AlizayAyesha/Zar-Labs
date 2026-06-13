import { buildImagePrompt, generateFalImage } from "./fal";
import { generateGeminiImage } from "./gemini-image";

/**
 * Image pipeline: FAL (primary) → Gemini Nano Banana (fallback).
 * planId: free uses schnell; pro/admin prefer dev + more steps.
 */
export async function generateMarketingImage({ brief, prompt, planId, falKey, geminiKey, highQuality: highQualityOverride }) {
  const text = prompt || buildImagePrompt(brief);
  const highQuality =
    highQualityOverride ??
    (planId === "pro" || planId === "included" || planId === "enterprise");

  try {
    return await generateFalImage({ prompt: text, falKey, highQuality });
  } catch (falErr) {
    try {
      const gemini = await generateGeminiImage({ prompt: text, geminiKey });
      return { ...gemini, provider: "gemini" };
    } catch {
      throw falErr;
    }
  }
}
