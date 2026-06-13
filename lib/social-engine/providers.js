export const JOB_CHAINS = {
  strategy: [
    { provider: "gemini", model: "gemini-2.0-flash" },
    { provider: "gemini", model: "gemini-1.5-flash" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
    { provider: "groq", model: "llama-3.1-8b-instant" },
    { provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free" },
    { provider: "openrouter", model: "deepseek/deepseek-r1:free" },
    { provider: "openrouter", model: "google/gemma-2-9b-it:free" },
    { provider: "deepseek", model: "deepseek-chat" },
    { provider: "mistral", model: "mistral-small-latest" },
    { provider: "openrouter", model: "openrouter/free" },
    { provider: "openrouter", model: "mistralai/mistral-small-3.1-24b-instruct:free" },
    { provider: "openai", model: "gpt-4o-mini" },
    { provider: "cohere", model: "command-r-plus-08-2024" },
  ],
  copy: [
    { provider: "gemini", model: "gemini-2.0-flash" },
    { provider: "gemini", model: "gemini-1.5-flash" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
    { provider: "groq", model: "llama-3.1-8b-instant" },
    { provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free" },
    { provider: "openrouter", model: "mistralai/mistral-small-3.1-24b-instruct:free" },
    { provider: "openrouter", model: "google/gemma-2-9b-it:free" },
    { provider: "deepseek", model: "deepseek-chat" },
    { provider: "mistral", model: "mistral-small-latest" },
    { provider: "openrouter", model: "openrouter/free" },
    { provider: "openai", model: "gpt-4o-mini" },
    { provider: "cohere", model: "command-r-plus-08-2024" },
  ],
  brief: [
    { provider: "groq", model: "llama-3.1-8b-instant" },
    { provider: "groq", model: "llama-3.3-70b-versatile" },
    { provider: "gemini", model: "gemini-2.0-flash" },
    { provider: "gemini", model: "gemini-1.5-flash" },
    { provider: "openrouter", model: "meta-llama/llama-3.2-3b-instruct:free" },
    { provider: "openrouter", model: "google/gemma-2-9b-it:free" },
    { provider: "deepseek", model: "deepseek-chat" },
    { provider: "mistral", model: "mistral-small-latest" },
  ],
};

export const PROVIDER_ENV = {
  openrouter: "OPENROUTER_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  deepseek: "DEEPSEEK_API_KEY",
  mistral: "MISTRAL_API_KEY",
  cohere: "COHERE_API_KEY",
  ai21: "AI21_API_KEY",
  openai: "OPENAI_API_KEY",
};

export const PROVIDER_BASE_URL = {
  openrouter: "https://openrouter.ai/api/v1",
  groq: "https://api.groq.com/openai/v1",
  deepseek: "https://api.deepseek.com",
  mistral: "https://api.mistral.ai/v1",
  openai: "https://api.openai.com/v1",
};

export function getProviderKey(provider) {
  const envName = PROVIDER_ENV[provider];
  return envName ? process.env[envName]?.trim() : "";
}

export function listConfiguredProviders() {
  return Object.keys(PROVIDER_ENV).map((id) => ({
    id,
    configured: Boolean(getProviderKey(id)),
    envName: PROVIDER_ENV[id],
  }));
}

/** User-safe error when every model in the chain fails */
export const USER_BUSY_MESSAGE =
  "Social Engine is briefly at capacity. Please try again in a moment — we're routing your request automatically.";
