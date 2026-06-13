import fs from "fs/promises";
import path from "path";

const EXHAUSTION_FILE = path.join(process.cwd(), "data", "social-engine-exhaustion.json");
const DEFAULT_COOLDOWN_MS = 60 * 60 * 1000;

/** In-memory cache synced with disk */
const exhaustedUntil = new Map();

function stepKey(provider, model) {
  return `${provider}::${model}`;
}

async function readExhaustionFile() {
  try {
    const raw = await fs.readFile(EXHAUSTION_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { steps: {} };
  }
}

async function writeExhaustionFile(data) {
  await fs.mkdir(path.dirname(EXHAUSTION_FILE), { recursive: true });
  await fs.writeFile(EXHAUSTION_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function isPast(until) {
  return !until || Date.now() > until;
}

/** Quota / rate-limit signals — triggers silent switch to next model */
export function isQuotaOrLimitError(err) {
  if (!err) return false;
  const status = err.status;
  if (status === 429 || status === 402 || status === 403 || status === 503) return true;

  const msg = `${err.message || ""} ${err.code || ""}`.toLowerCase();
  const signals = [
    "rate limit",
    "rate_limit",
    "quota",
    "exceeded",
    "insufficient",
    "credit",
    "billing",
    "too many requests",
    "capacity",
    "overloaded",
    "resource exhausted",
    "limit reached",
    "spend limit",
    "free tier",
    "trial",
  ];
  return signals.some((s) => msg.includes(s));
}

export function isStepExhausted(provider, model) {
  const key = stepKey(provider, model);
  const until = exhaustedUntil.get(key);
  if (!until) return false;
  if (isPast(until)) {
    exhaustedUntil.delete(key);
    return false;
  }
  return true;
}

/** Also skip whole provider if every configured step is exhausted — optional helper */
export function isProviderExhausted(provider) {
  return false;
}

export async function markStepExhausted(provider, model, ms = DEFAULT_COOLDOWN_MS) {
  const key = stepKey(provider, model);
  const until = Date.now() + ms;
  exhaustedUntil.set(key, until);

  try {
    const data = await readExhaustionFile();
    data.steps[key] = until;
    await writeExhaustionFile(data);
  } catch {
    /* disk optional */
  }
}

export async function hydrateExhaustionCache() {
  try {
    const data = await readExhaustionFile();
    for (const [key, until] of Object.entries(data.steps || {})) {
      if (!isPast(until)) exhaustedUntil.set(key, until);
    }
  } catch {
    /* ignore */
  }
}

/** @deprecated use markStepExhausted */
export function markProviderExhausted(provider, ms) {
  markStepExhausted(provider, "*", ms);
}
