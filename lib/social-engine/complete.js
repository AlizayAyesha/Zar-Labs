import { filterChainForPlan } from "./plans";
import {
  JOB_CHAINS,
  PROVIDER_BASE_URL,
  getProviderKey,
  USER_BUSY_MESSAGE,
} from "./providers";
import {
  hydrateExhaustionCache,
  isQuotaOrLimitError,
  isStepExhausted,
  markStepExhausted,
} from "./exhaustion";
import { recordUsage, assertWithinBudget } from "./usage";

let hydrationPromise = null;
function ensureHydrated() {
  if (!hydrationPromise) hydrationPromise = hydrateExhaustionCache();
  return hydrationPromise;
}

function extractJson(text) {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : trimmed;
  return JSON.parse(raw);
}

function resolveKey(provider, userByokKeys = {}) {
  return userByokKeys[provider] || getProviderKey(provider);
}

async function openAiCompatibleChat({ baseUrl, apiKey, model, messages, jsonMode, provider }) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (provider === "openrouter") {
    headers["HTTP-Referer"] = "https://zar-labs.vercel.app";
    headers["X-Title"] = "Zar Labs Social Engine";
  }

  const body = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: jsonMode ? 4096 : 2048,
  };
  if (jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || json.message || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const content = json.choices?.[0]?.message?.content || "";
  const usage = json.usage || {};
  return {
    content,
    usage: {
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
    },
  };
}

async function geminiChat({ apiKey, model, messages, jsonMode }) {
  const system = messages.find((m) => m.role === "system")?.content || "";
  const userParts = messages.filter((m) => m.role !== "system").map((m) => `${m.role}: ${m.content}`);
  const prompt = system ? `${system}\n\n${userParts.join("\n\n")}` : userParts.join("\n\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: jsonMode ? 4096 : 2048,
      ...(jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || `Gemini HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const content = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const meta = json.usageMetadata || {};
  return {
    content,
    usage: {
      promptTokens: meta.promptTokenCount || 0,
      completionTokens: meta.candidatesTokenCount || 0,
    },
  };
}

async function cohereChat({ apiKey, messages }) {
  const system = messages.find((m) => m.role === "system")?.content;
  const chatMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  const res = await fetch("https://api.cohere.com/v2/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "command-r-plus-08-2024",
      messages: system ? [{ role: "system", content: system }, ...chatMessages] : chatMessages,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || `Cohere HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  const content = json.message?.content?.[0]?.text || json.text || "";
  return { content, usage: { promptTokens: 0, completionTokens: 0 } };
}

async function runProviderWithKey(provider, model, messages, jsonMode, key) {
  if (!key) {
    const err = new Error(`Provider ${provider} not configured`);
    err.status = 503;
    throw err;
  }
  if (provider === "cohere") return cohereChat({ apiKey: key, messages });
  if (provider === "gemini") return geminiChat({ apiKey: key, model, messages, jsonMode });
  const baseUrl = PROVIDER_BASE_URL[provider];
  if (!baseUrl) {
    const err = new Error(`Unknown provider ${provider}`);
    err.status = 500;
    throw err;
  }
  return openAiCompatibleChat({ baseUrl, apiKey: key, model, messages, jsonMode, provider });
}

/**
 * Silent failover: walk the chain; on quota/limit errors mark step and try next.
 * User never sees which model ran — provider/model only in server logs.
 */
async function runChain({ chain, messages, jsonMode, userByokKeys, userEmail, metric }) {
  await ensureHydrated();

  for (const step of chain) {
    const { provider, model } = step;
    if (isStepExhausted(provider, model)) continue;

    const key = resolveKey(provider, userByokKeys);
    if (!key) continue;

    try {
      const result = await runProviderWithKey(provider, model, messages, jsonMode, key);
      await recordUsage({
        provider,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        userEmail,
        metric,
      });
      return { ...result, provider, model };
    } catch (err) {
      if (isQuotaOrLimitError(err)) {
        await markStepExhausted(provider, model);
      }
      /* try next step silently */
    }
  }

  const error = new Error(USER_BUSY_MESSAGE);
  error.status = 503;
  throw error;
}

function toPublicResult(result, jsonMode) {
  if (jsonMode) {
    return { data: extractJson(result.content), raw: result.content };
  }
  return { data: result.content, raw: result.content };
}

export async function completeText({
  job = "copy",
  system,
  user,
  messages: inputMessages,
  jsonMode = true,
  plan = "enterprise",
  userEmail,
  userBudgetOverride,
  userByokKeys = {},
  metric,
}) {
  await assertWithinBudget(userEmail, userBudgetOverride);

  const baseChain = JOB_CHAINS[job] || JOB_CHAINS.copy;
  const chain = filterChainForPlan(baseChain, plan);
  const messages =
    inputMessages ||
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

  const result = await runChain({
    chain,
    messages,
    jsonMode,
    userByokKeys,
    userEmail,
    metric: metric || (job === "strategy" ? "weekPlans" : job === "brief" ? "imageBriefs" : "chatMessages"),
  });

  return {
    ...toPublicResult(result, jsonMode),
    _internal: { provider: result.provider, model: result.model },
  };
}

/** Strip internal routing metadata before sending to browser */
export function stripInternalMeta(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const { _internal, ...rest } = payload;
  return rest;
}

export async function completeChat({
  messages,
  plan = "free",
  userEmail,
  userBudgetOverride,
  userByokKeys = {},
}) {
  const result = await completeText({
    job: "copy",
    messages,
    jsonMode: false,
    plan,
    userEmail,
    userBudgetOverride,
    userByokKeys,
    metric: "chatMessages",
  });
  return stripInternalMeta(result);
}
