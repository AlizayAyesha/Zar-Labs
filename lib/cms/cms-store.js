import fs from "fs/promises";
import path from "path";
import { createServerClient } from "../supabase/server";

const DATA_DIR = path.join(process.cwd(), "data");

function draftKey(collection) {
  return `${collection}.draft`;
}

function publishedKey(collection) {
  return `${collection}.published`;
}

async function readJsonFile(filename) {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeJsonFile(filename, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, filename), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function getCmsCollection(collection, view = "published") {
  const fieldKey = view === "draft" ? draftKey(collection) : publishedKey(collection);
  let db = null;

  try {
    db = createServerClient();
  } catch {
    db = null;
  }

  if (db) {
    const { data } = await db.from("site_content").select("content").eq("field_key", fieldKey).maybeSingle();

    if (data?.content && Object.keys(data.content).length) {
      return data.content;
    }

    if (view === "draft") {
      const { data: published } = await db
        .from("site_content")
        .select("content")
        .eq("field_key", publishedKey(collection))
        .maybeSingle();
      if (published?.content) return published.content;
    }
  }

  const filename = `${collection}.json`;
  const fileData = await readJsonFile(filename);
  return fileData || {};
}

export async function saveCmsCollection(collection, view, content, { page = collection, section = "cms" } = {}) {
  const fieldKey = view === "draft" ? draftKey(collection) : publishedKey(collection);
  const db = createServerClient();

  const { error } = await db.from("site_content").upsert(
    {
      field_key: fieldKey,
      page,
      section,
      content,
      is_published: view === "published",
    },
    { onConflict: "field_key" }
  );

  if (error) throw new Error(error.message);

  if (view === "published") {
    await writeJsonFile(`${collection}.json`, content);
  }

  return content;
}

export async function handleCmsMutation(collection, request, { revalidatePaths = [] } = {}) {
  const body = await request.json();
  const intent = body.intent === "publish" ? "publish" : "saveDraft";
  const view = intent === "publish" ? "published" : "draft";
  const { intent: _intent, ...payload } = body;

  await saveCmsCollection(collection, view, payload);

  if (intent === "publish" && revalidatePaths.length) {
    const { revalidatePublicPaths } = await import("./draft-publish");
    revalidatePublicPaths(revalidatePaths);
  }

  return { ok: true, view, data: payload };
}
