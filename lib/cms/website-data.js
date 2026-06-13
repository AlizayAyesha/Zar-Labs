import { getCmsCollection, saveCmsCollection } from "./cms-store";
import { normalizeWebsiteData } from "../newsletter/registry";

const COLLECTION = "website-data";

export async function getWebsiteData(view = "published") {
  const raw = await getCmsCollection(COLLECTION, view);
  return normalizeWebsiteData(raw);
}

export async function saveWebsiteData(view, data) {
  const normalized = normalizeWebsiteData(data);
  return saveCmsCollection(COLLECTION, view, normalized, { page: "newsletter", section: "cms" });
}

export async function handleWebsiteDataMutation(request, { revalidatePaths = [] } = {}) {
  const body = await request.json();
  const intent = body.intent === "publish" ? "publish" : "saveDraft";
  const view = intent === "publish" ? "published" : "draft";
  const { intent: _intent, ...payload } = body;
  const normalized = normalizeWebsiteData(payload);

  await saveWebsiteData(view, normalized);

  if (intent === "publish" && revalidatePaths.length) {
    const { revalidatePublicPaths } = await import("./draft-publish");
    revalidatePublicPaths(revalidatePaths);
  }

  return { ok: true, view, data: normalized };
}
