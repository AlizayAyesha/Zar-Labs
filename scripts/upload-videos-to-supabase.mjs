/**
 * Upload local videos to Supabase Storage (site-media bucket).
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: npm run upload:videos
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const UPLOADS = [
  {
    storagePath: "videos/serviceshighquality.mp4",
    localPath: "public/videos/serviceshighquality.mp4",
    contentType: "video/mp4",
  },
  {
    storagePath: "videos/logos.mp4",
    localPath: "public/videos/logos.mp4",
    contentType: "video/mp4",
  },
  {
    storagePath: "videos/casestudytestvideo.mov",
    localPath: "public/casestudy/casestudytestvideo.mov",
    contentType: "video/quicktime",
  },
];

async function main() {
  console.log("Uploading videos to Supabase Storage (site-media)...\n");

  for (const item of UPLOADS) {
    const fullPath = resolve(root, item.localPath);
    if (!existsSync(fullPath)) {
      console.warn(`Skip (missing): ${item.localPath}`);
      continue;
    }

    const body = readFileSync(fullPath);
    const { error } = await supabase.storage
      .from("site-media")
      .upload(item.storagePath, body, {
        contentType: item.contentType,
        upsert: true,
        cacheControl: "31536000",
      });

    if (error) {
      console.error(`Failed: ${item.storagePath}`, error.message);
      continue;
    }

    const publicUrl = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/site-media/${item.storagePath}`;
    console.log(`OK: ${item.storagePath}`);
    console.log(`    ${publicUrl}\n`);

    await supabase
      .from("media_assets")
      .upsert(
        {
          bucket: "site-media",
          path: item.storagePath,
          public_url: publicUrl,
          file_type: "video",
          alt_text: item.storagePath.split("/").pop(),
        },
        { onConflict: "bucket,path" }
      );
  }

  console.log("Done. Videos are served from Supabase CDN.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
