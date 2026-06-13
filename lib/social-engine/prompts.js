import { PUBLISHING_BRANDS } from "../../constants/social/publishingBrands";
import { getBrandVisualNotes } from "../../constants/social/zarBrandVisuals";
import { FAQ_CORE } from "../seo/faq-data";
import { SITE_TAGLINE } from "../seo/site";

function knowledgeSnippet() {
  return FAQ_CORE.slice(0, 4)
    .map((f) => `${f.q}: ${f.a}`)
    .join("\n");
}

export function getZarLabsSystemPrompt() {
  const brands = PUBLISHING_BRANDS.map((b) => `${b.shortcut}: ${b.label}`).join(", ");
  return `You are Zar Labs Social Engine — a senior B2B digital marketer and growth coach (0 to hero).

BRAND: Zar Labs | Site: https://zar-labs.vercel.app
Tagline: ${SITE_TAGLINE}
ICP: Startups and companies investing $20k–$100k+ in web, SaaS, AI, integrations (US, UK, UAE).
Streams: ${brands}
GROW focus: SEO, GEO, AEO — cite /answers pages and newsletter when relevant.
KNOWLEDGE:
${knowledgeSnippet()}
CTAs (prefer in order): /go/linkedin, /go/instagram, /go/snapchat, /go/facebook, /go/whatsapp, /project-intake, /newsletter, Calendly discovery call.
LinkedIn: native posts; put external links in first comment; carousels for proof; no fake metrics.
Voice: confident, clear, outcome-focused. No hype.
Output valid JSON when asked. Be concise to save tokens.`;
}

export function buildWeekUserPrompt({ brandId, weekStart, theme }) {
  const brand = PUBLISHING_BRANDS.find((b) => b.id === brandId);
  return `Generate a 7-day social plan for brand stream ${brand?.shortcut || brandId} (${brand?.label}).
Week publishing start: ${weekStart}.
Theme: ${theme || "pipeline and authority"}.
Timezone: Asia/Karachi. Include LinkedIn (2x), Instagram (1x), Snapchat (1x), Facebook (1x), WhatsApp (1x) minimum.

Return JSON:
{
  "weekTheme": "string",
  "topicPlannerMarkdown": "full markdown with Topic: line and | Day | Phase | Channel | Format | Time | What to post | SEO terms | CTA | table with 7 rows",
  "linkedinTips": ["string"],
  "imageBriefs": [{"title":"string","layout":"string","colors":"#010101 #22c55e #d4af37"}]
}`;
}

export function buildPostUserPrompt(task) {
  return `Write for channel: ${task.channel}. Format: ${task.format_family || task.channel_type}.
Brief: ${task.what_to_post}
Topic: ${task.campaign_topic}
CTA base: ${task.cta_link || "/go/linkedin"}

Return JSON:
{
  "hook": "string",
  "body": "string max 1300 chars",
  "firstCommentLink": "string",
  "hashtags": ["max 5"],
  "imageBrief": {"headline":"","subline":"","layout":"carousel|quote|cta","colors":"#010101 #22c55e #d4af37"}
}`;
}

export function buildImageBriefUserPrompt(task) {
  const visualNotes = getBrandVisualNotes(task.brand_id || "build");
  return `Marketing template brief for Zar Labs. Channel: ${task.channel}. Post: ${task.what_to_post?.slice(0, 200)}
Visual style: ${visualNotes}
Return JSON only: {"headline":"","subline":"","layout":"carousel-cover|quote-card|cta-card","width":1080,"height":1080,"colors":["#010101","#22c55e","#d4af37"],"fontNotes":"SF Pro style, match zar-labs.vercel.app dark premium B2B aesthetic"}`;
}
