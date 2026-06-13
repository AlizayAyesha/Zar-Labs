import { getChatImageSystemAddon } from "./chat-images";

const BLOCKED_PATTERNS = [
  /\b(write|generate|debug|fix)\s+(code|script|program|sql|python|javascript)\b/i,
  /\b(hack|exploit|malware|phishing|bypass)\b/i,
  /\b(medical|legal|financial)\s+advice\b/i,
  /\b(homework|essay|thesis)\s+(for me|write)\b/i,
  /\bignore (previous|all) instructions\b/i,
  /\bjailbreak\b/i,
  /\bpretend you are\b/i,
  /\bnsfw\b/i,
];

const ALLOWED_HINTS = [
  /\b(linkedin|instagram|snapchat|facebook|whatsapp|meta|twitter|x\.com|tiktok|youtube|social|post|hashtag|carousel|reel|thread|story|spotlight)\b/i,
  /\b(strategy|content|marketing|brand|audience|cta|engagement|growth|funnel)\b/i,
  /\b(image|template|brief|design|headline|visual|graphic)\b/i,
  /\b(week|daily|calendar|schedule|plan)\b/i,
];

export function validateUserMessage(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { allowed: false, reason: "Please enter a message." };
  }
  if (trimmed.length > 4000) {
    return { allowed: false, reason: "Message too long (max 4000 characters)." };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        allowed: false,
        reason:
          "I can only help with social media strategy, content plans, post copy, and marketing image briefs. Try asking about your LinkedIn or Instagram content.",
      };
    }
  }

  const looksSocial = ALLOWED_HINTS.some((p) => p.test(trimmed));
  const isShortGreeting = /^(hi|hello|hey|thanks|thank you|ok|yes|no|help)[!.?\s]*$/i.test(trimmed);

  if (!looksSocial && !isShortGreeting && trimmed.length > 80) {
    return {
      allowed: false,
      reason:
        "Let's keep this focused on social media growth — channels, content ideas, weekly plans, or marketing templates.",
    };
  }

  return { allowed: true };
}

export function getGuardrailedChatSystemPrompt(userContext = {}, engineSettings = {}) {
  const niche = userContext.business_niche || "your business";
  const channels = (userContext.primary_channels || []).join(", ") || "LinkedIn, Instagram";
  const goal = userContext.growth_goal || "authority and leads";

  const imageAddon = getChatImageSystemAddon(engineSettings);

  return `You are Zar Labs Social Engine — a friendly, focused social media growth assistant.

SCOPE (strict):
- ONLY help with: social media strategy, content calendars, post hooks/copy, hashtags, channel mix, CTAs, and marketing image template briefs (headline, layout, colors).
- REFUSE everything else: code, legal/medical/financial advice, politics, homework, general chat, hacking, unrelated tasks.

When refusing, be humble and redirect: "I'm built for social growth — want help planning LinkedIn content for ${niche}?"

USER CONTEXT:
- Niche: ${niche}
- Channels: ${channels}
- Goal: ${goal}

STYLE: Clear, actionable, concise. Use bullet points for plans. Offer weekly table format when asked.
Never invent fake metrics. Prefer CTAs: /go/linkedin, /project-intake, discovery call.${imageAddon}`;
}
