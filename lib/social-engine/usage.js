import fs from "fs/promises";
import path from "path";
import {
  emptyBucket,
  getGlobalUsageFromDb,
  getUserUsageFromDb,
  recordUsageInDb,
  LIMIT_METRIC_USAGE_KEY,
} from "./usage-db";

const USAGE_FILE = path.join(process.cwd(), "data", "social-engine-usage.json");

function monthKeyLocal() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function readUsageFile() {
  try {
    const raw = await fs.readFile(USAGE_FILE, "utf8");
    const data = JSON.parse(raw);
    for (const month of Object.values(data.months || {})) {
      if (month.totalTokens !== undefined && !month.global) {
        month.global = {
          totalTokens: month.totalTokens,
          requests: month.requests,
          byProvider: month.byProvider || {},
          chatMessages: month.chatMessages || 0,
          imagesGenerated: month.imagesGenerated || 0,
          remindersSent: month.remindersSent || 0,
          weekPlans: month.weekPlans || 0,
          imageBriefs: month.imageBriefs || 0,
        };
        delete month.totalTokens;
        delete month.requests;
        delete month.byProvider;
      }
      if (!month.users) month.users = {};
      if (!month.global) month.global = emptyBucket();
    }
    return data;
  } catch {
    return { months: {} };
  }
}

async function writeUsageFile(data) {
  await fs.mkdir(path.dirname(USAGE_FILE), { recursive: true });
  await fs.writeFile(USAGE_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function getMonthBucket(data) {
  const key = monthKeyLocal();
  if (!data.months[key]) {
    data.months[key] = { global: emptyBucket(), users: {} };
  }
  const month = data.months[key];
  if (!month.global) month.global = emptyBucket();
  if (!month.users) month.users = {};
  return { month };
}

function addToBucket(bucket, { provider, promptTokens = 0, completionTokens = 0, metric }) {
  const tokens = promptTokens + completionTokens;
  bucket.totalTokens += tokens;
  bucket.requests += 1;
  if (metric && bucket[metric] !== undefined) bucket[metric] += 1;
  if (provider) {
    if (!bucket.byProvider[provider]) bucket.byProvider[provider] = { tokens: 0, requests: 0 };
    bucket.byProvider[provider].tokens += tokens;
    bucket.byProvider[provider].requests += 1;
  }
}

async function getUserUsageFromFile(userEmail) {
  const data = await readUsageFile();
  const { month } = getMonthBucket(data);
  return month.users[userEmail.toLowerCase()] || emptyBucket();
}

async function getMonthlyUsageFromFile() {
  const data = await readUsageFile();
  const { month } = getMonthBucket(data);
  return month.global;
}

async function recordUsageInFile({ provider, promptTokens = 0, completionTokens = 0, userEmail, metric }) {
  const data = await readUsageFile();
  const { month } = getMonthBucket(data);
  addToBucket(month.global, { provider, promptTokens, completionTokens, metric });
  if (userEmail) {
    const normalized = userEmail.toLowerCase();
    if (!month.users[normalized]) month.users[normalized] = emptyBucket();
    addToBucket(month.users[normalized], { provider, promptTokens, completionTokens, metric });
  }
  await writeUsageFile(data);
  return userEmail ? month.users[userEmail.toLowerCase()] : month.global;
}

export async function getMonthlyUsage() {
  const fromDb = await getGlobalUsageFromDb();
  if (fromDb) return fromDb;
  return getMonthlyUsageFromFile();
}

export async function getUserUsage(userEmail) {
  if (!userEmail) return emptyBucket();
  const fromDb = await getUserUsageFromDb(userEmail);
  if (fromDb) return fromDb;
  return getUserUsageFromFile(userEmail);
}

export async function recordUsage(args) {
  const fromDb = await recordUsageInDb(args);
  if (fromDb) return fromDb;
  return recordUsageInFile(args);
}

export function assertUserLimit(usage, limits, metric) {
  const cap = limits[metric];
  if (cap == null) return;
  const usageKey = LIMIT_METRIC_USAGE_KEY[metric] || metric;
  const used = usage[usageKey] || 0;
  if (used >= cap) {
    const label = metric === "images" ? "images" : metric;
    const err = new Error(
      `${limits.label || "Plan"} limit reached for ${label} (${used}/${cap}). Upgrade to Pro for more.`
    );
    err.status = 429;
    throw err;
  }
}

export async function assertWithinBudget(userEmail, userBudgetOverride) {
  const globalBudget = Number(process.env.SOCIAL_ENGINE_MONTHLY_TOKEN_BUDGET || 100000);
  const globalUsage = await getMonthlyUsage();
  if (globalUsage.totalTokens >= globalBudget) {
    const err = new Error(`Platform monthly token budget exceeded`);
    err.status = 429;
    throw err;
  }
  if (userEmail && userBudgetOverride) {
    const userUsage = await getUserUsage(userEmail);
    if (userUsage.totalTokens >= userBudgetOverride) {
      const err = new Error(`Your monthly token budget exceeded`);
      err.status = 429;
      throw err;
    }
  }
}

export function getTokenBudget() {
  return Number(process.env.SOCIAL_ENGINE_MONTHLY_TOKEN_BUDGET || 100000);
}

export { emptyBucket, LIMIT_METRIC_USAGE_KEY } from "./usage-db";
