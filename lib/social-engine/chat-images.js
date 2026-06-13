import { buildImagePrompt } from "./fal";

const IMAGE_BRIEF_RE = /IMAGE_BRIEF:\s*(\{[\s\S]*?\})\s*$/im;

const CONFIRM_PATTERNS = [
  /\b(generate|create|render|make|produce)\b.*\b(the\s+)?(image|visual|graphic|template|version|mockup)\b/i,
  /\b(yes|yep|sure|ok|okay|go ahead|do it|confirm|approved?)\b.*\b(image|visual|generate|render)\b/i,
  /^(generate|create|render)\s*(it|the image|image)?[!.?\s]*$/i,
  /^(yes|yep|sure|ok|okay|go ahead|do it|confirm)[!.?\s]*$/i,
];

export function extractImageBrief(text) {
  const raw = String(text || "");
  const match = raw.match(IMAGE_BRIEF_RE);
  if (!match) return { content: raw.trim(), brief: null };

  try {
    const brief = JSON.parse(match[1]);
    const content = raw.replace(IMAGE_BRIEF_RE, "").trim();
    return { content, brief: normalizeBrief(brief) };
  } catch {
    return { content: raw.trim(), brief: null };
  }
}

export function normalizeBrief(brief) {
  if (!brief || typeof brief !== "object") return null;
  return {
    headline: brief.headline || brief.title || "Zar Labs",
    subline: brief.subline || "",
    layout: brief.layout || "quote-card",
    colors: Array.isArray(brief.colors)
      ? brief.colors
      : typeof brief.colors === "string"
        ? brief.colors.split(/\s+/).filter(Boolean)
        : ["#010101", "#22c55e", "#d4af37"],
  };
}

export function isImageConfirmMessage(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return false;
  return CONFIRM_PATTERNS.some((p) => p.test(trimmed));
}

export function findPendingBrief(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m.role === "assistant" && m.imageBrief && !m.imageUrl) {
      return { index: i, brief: m.imageBrief };
    }
  }
  return null;
}

export function buildPromptFromBrief(brief) {
  return buildImagePrompt(normalizeBrief(brief));
}

export function getChatImageSystemAddon(settings) {
  if (settings.strategyChatImages === "disabled" || !settings.chatImageBriefsEnabled) {
    return `

IMAGES: Do not propose image generation or IMAGE_BRIEF blocks. Direct users to Strategy Chat settings or Image Studio for visuals.`;
  }

  return `

IMAGES (strict):
- Never claim you generated or rendered an image. Images are created only after the user confirms.
- When a marketing visual would help, finish with a single line:
IMAGE_BRIEF:{"headline":"...","subline":"...","layout":"quote-card|carousel-cover|cta-card","colors":["#010101","#22c55e","#d4af37"]}
- Give strategy and copy first; the brief is a preview only until the user confirms generation.
- If the user says "generate the image" or confirms, acknowledge that they can confirm with the button (uses 1 monthly image).`;
}
