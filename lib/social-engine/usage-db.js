import { createServerClient } from "../supabase/server";

export function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function emptyBucket() {
  return {
    totalTokens: 0,
    requests: 0,
    chatMessages: 0,
    imagesGenerated: 0,
    remindersSent: 0,
    weekPlans: 0,
    imageBriefs: 0,
    byProvider: {},
  };
}

const METRIC_TO_COLUMN = {
  chatMessages: "chat_messages",
  imagesGenerated: "images_generated",
  weekPlans: "week_plans",
  imageBriefs: "image_briefs",
  remindersSent: "reminders_sent",
};

export const LIMIT_METRIC_USAGE_KEY = {
  chatMessages: "chatMessages",
  images: "imagesGenerated",
  weekPlans: "weekPlans",
  imageBriefs: "imageBriefs",
  remindersPerWeek: "remindersSent",
};

function rowToBucket(row) {
  if (!row) return emptyBucket();
  return {
    totalTokens: Number(row.total_tokens) || 0,
    requests: row.requests || 0,
    chatMessages: row.chat_messages || 0,
    imagesGenerated: row.images_generated || 0,
    remindersSent: row.reminders_sent || 0,
    weekPlans: row.week_plans || 0,
    imageBriefs: row.image_briefs || 0,
    byProvider: row.by_provider || {},
  };
}

export async function getUserUsageFromDb(userEmail) {
  if (!userEmail) return emptyBucket();
  try {
    const db = createServerClient();
    const { data } = await db
      .from("social_engine_usage_monthly")
      .select("*")
      .eq("owner_email", userEmail.toLowerCase())
      .eq("month_key", monthKey())
      .maybeSingle();
    return rowToBucket(data);
  } catch {
    return null;
  }
}

export async function getGlobalUsageFromDb() {
  try {
    const db = createServerClient();
    const { data } = await db.from("social_engine_usage_monthly").select("*").eq("month_key", monthKey());
    const bucket = emptyBucket();
    for (const row of data || []) {
      const b = rowToBucket(row);
      bucket.totalTokens += b.totalTokens;
      bucket.requests += b.requests;
      bucket.chatMessages += b.chatMessages;
      bucket.imagesGenerated += b.imagesGenerated;
      bucket.remindersSent += b.remindersSent;
      bucket.weekPlans += b.weekPlans;
      bucket.imageBriefs += b.imageBriefs;
    }
    return bucket;
  } catch {
    return null;
  }
}

export async function recordUsageInDb({ userEmail, provider, promptTokens = 0, completionTokens = 0, metric }) {
  if (!userEmail) return null;
  const email = userEmail.toLowerCase();
  const key = monthKey();
  const tokens = promptTokens + completionTokens;

  try {
    const db = createServerClient();
    const existing = await getUserUsageFromDb(email);
    const base = existing || emptyBucket();

    const next = { ...base };
    next.totalTokens += tokens;
    next.requests += 1;
    if (metric && next[metric] !== undefined) next[metric] += 1;
    if (provider) {
      if (!next.byProvider[provider]) next.byProvider[provider] = { tokens: 0, requests: 0 };
      next.byProvider[provider].tokens += tokens;
      next.byProvider[provider].requests += 1;
    }

    const column = metric ? METRIC_TO_COLUMN[metric] : null;
    const patch = {
      owner_email: email,
      month_key: key,
      total_tokens: next.totalTokens,
      requests: next.requests,
      chat_messages: next.chatMessages,
      week_plans: next.weekPlans,
      image_briefs: next.imageBriefs,
      images_generated: next.imagesGenerated,
      reminders_sent: next.remindersSent,
      by_provider: next.byProvider,
      updated_at: new Date().toISOString(),
    };

    const { error } = await db.from("social_engine_usage_monthly").upsert(patch, {
      onConflict: "owner_email,month_key",
    });
    if (error) throw error;
    return next;
  } catch {
    return null;
  }
}
