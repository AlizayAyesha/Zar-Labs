import { BRAND_BY_ID, DEFAULT_TIMEZONE } from "../../constants/social/publishingBrands";
import { getChannelTypes } from "../../constants/social/socialChannelCatalog";

function defaultPanelState() {
  return {
    cta_status: "Missing",
    checklist: {},
    panel_fields: {},
    verification_status: "pending",
    workflow_step: "Scheduled",
    last_updated_at: new Date().toISOString(),
  };
}

function addDays(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function channelIdFromName(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("linkedin")) return "linkedin";
  if (n.includes("instagram")) return "instagram";
  if (n.includes("snapchat") || n.includes("snap")) return "snapchat";
  if (n.includes("facebook") || n.includes("meta")) return "facebook";
  if (n.includes("whatsapp") || n.includes("whats app")) return "whatsapp";
  if (n.includes("twitter") || n === "x") return "x";
  if (n.includes("newsletter")) return "newsletter";
  if (n.includes("youtube")) return "youtube";
  if (n.includes("reddit")) return "reddit";
  if (n.includes("quora")) return "quora";
  if (n.includes("medium")) return "medium";
  return "website";
}

function resolvePanelId(channelId, channelType) {
  const types = getChannelTypes(channelId);
  const match = types.find(
    (t) => t.label.toLowerCase() === (channelType || "").toLowerCase() || t.id === channelType
  );
  return match?.panelId || types[0]?.panelId || "text-micro";
}

export function createTaskFromPlanRow(row, { brandId, generationStartDate, publishingStartDate, meta = {} }) {
  const brand = BRAND_BY_ID[brandId] || BRAND_BY_ID.build;
  const channelId = channelIdFromName(row.channel);
  const panelId = resolvePanelId(channelId, row.channel_type);
  const dayOffset = Math.max(0, (row.day_number || 1) - 1);
  const publishing_date = addDays(publishingStartDate, dayOffset);
  const leadTime = 2;
  const production_date = addDays(generationStartDate, dayOffset);
  const generation_slot_date = addDays(generationStartDate, Math.max(0, dayOffset - leadTime));

  const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return {
    id,
    brand: brand.label,
    brand_shortcut: brand.shortcut,
    brand_id: brand.id,
    campaign_topic: meta.topic || row.what_to_post?.slice(0, 80) || "Campaign",
    topic_type: meta.topic_type || "",
    systems_relevance: "",
    primary_audience: meta.primary_audience || "Founders, product leaders, ops teams",
    primary_asset: meta.primary_asset || "/works",
    campaign_intensity: meta.campaign_intensity || "Standard",
    default_cta: meta.default_cta || "Book a discovery call",
    research_needed: meta.research_needed || "",
    evidence_uncertainty_note: "",
    day_number: row.day_number,
    phase: row.phase || "",
    channel: row.channel || channelId,
    channel_type: row.channel_type || "",
    format_family: row.format_family || row.channel_type || "Post",
    content_medium: row.format_family || "text",
    objective: row.objective || "",
    slot: row.slot || "",
    production_date,
    publishing_date,
    generation_slot_date,
    lead_time_days: leadTime,
    scheduled_time: row.dubai_time || "09:00",
    timezone: DEFAULT_TIMEZONE,
    what_to_post: row.what_to_post || "",
    seo_ai_search_terms: row.seo_ai_search_terms || "",
    cta_link: row.cta_link || "https://zar-labs.vercel.app/go/linkedin",
    cta: row.cta || meta.default_cta || "Book a call",
    follow_up_comment_action: row.follow_up_comment_action || "",
    compliance_note: meta.compliance_note || "",
    source_control_reminder: "",
    task_title: row.what_to_post?.slice(0, 80) || `${row.channel || "Post"} — Day ${row.day_number}`,
    production_panel_id: panelId,
    panel_state: defaultPanelState(),
    production_status: "Not Started",
    publishing_status: "Scheduled",
    task_status: "active",
    created_at: new Date().toISOString(),
  };
}

export function createPreviewTask(channel, channelTypeEntry) {
  const brand = BRAND_BY_ID.build;
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `preview-${channel.id}-${channelTypeEntry.id}`,
    brand: brand.label,
    brand_shortcut: brand.shortcut,
    brand_id: brand.id,
    campaign_topic: "Preview — Zar Labs social template",
    topic_type: "Preview",
    systems_relevance: "",
    primary_audience: "",
    primary_asset: "",
    campaign_intensity: "",
    default_cta: "",
    research_needed: "",
    evidence_uncertainty_note: "",
    day_number: 1,
    phase: "Preview",
    channel: channel.label,
    channel_type: channelTypeEntry.label,
    format_family: channelTypeEntry.label,
    content_medium: "text",
    objective: "Template preview",
    slot: "",
    production_date: today,
    publishing_date: today,
    generation_slot_date: today,
    scheduled_time: "09:00",
    timezone: DEFAULT_TIMEZONE,
    what_to_post: "Custom software, AI automation, and digital products for measurable outcomes.",
    seo_ai_search_terms: "",
    cta_link: channel.defaultUrl,
    cta: "Learn more",
    follow_up_comment_action: "",
    compliance_note: "",
    source_control_reminder: "",
    task_title: `${channel.label} — ${channelTypeEntry.label}`,
    production_panel_id: channelTypeEntry.panelId,
    panel_state: defaultPanelState(),
    production_status: "Preview",
    publishing_status: "Preview",
    task_status: "preview",
    created_at: new Date().toISOString(),
  };
}
