import fs from "fs/promises";
import path from "path";

/** How strategy chat handles image rendering */
export const STRATEGY_IMAGE_MODES = {
  confirm: "confirm",
  command_only: "command_only",
  disabled: "disabled",
};

export const DEFAULT_ENGINE_SETTINGS = {
  /** confirm = show button + natural-language yes; command_only = user must ask explicitly; disabled = no chat images */
  strategyChatImages: STRATEGY_IMAGE_MODES.confirm,
  /** LLM may propose IMAGE_BRIEF blocks in strategy chat */
  chatImageBriefsEnabled: true,
  /** Show copy-prompt when image APIs fail */
  showCopyPromptOnFail: true,
};

const SETTINGS_PATH = path.join(process.cwd(), "data", "social-engine-settings.json");

async function readFileSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ENGINE_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_ENGINE_SETTINGS };
  }
}

export async function getEngineSettings() {
  const fromFile = await readFileSettings();
  const envMode = process.env.SOCIAL_ENGINE_STRATEGY_CHAT_IMAGES?.trim();
  if (envMode && STRATEGY_IMAGE_MODES[envMode]) {
    return { ...fromFile, strategyChatImages: envMode };
  }
  return fromFile;
}

export async function updateEngineSettings(partial) {
  const current = await readFileSettings();
  const next = {
    ...current,
    ...partial,
  };
  if (partial.strategyChatImages && !STRATEGY_IMAGE_MODES[partial.strategyChatImages]) {
    throw new Error("Invalid strategyChatImages mode");
  }
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}
