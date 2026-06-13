#!/usr/bin/env node
/**
 * Apply Social Engine SQL to Supabase Postgres.
 * Requires SUPABASE_DB_PASSWORD in .env.local (Database password from Supabase Dashboard → Settings → Database).
 *
 * Usage: node scripts/apply-supabase-sql.mjs
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

async function loadEnvLocal() {
  try {
    const raw = await fs.readFile(path.join(root, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* optional */
  }
}

const SQL_FILES = [
  "supabase/migrations/20260613100000_social_engine_members.sql",
  "supabase/migrations/20260613110000_social_engine_profiles_schedules.sql",
  "supabase/migrations/20260614100000_social_engine_usage_calendars.sql",
  "supabase/migrations/20260614120000_style_catalog.sql",
];

async function main() {
  await loadEnvLocal();
  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectRef = process.env.SUPABASE_PROJECT_REF || "aaptopqqtxhbujbxgtzy";

  if (!password) {
    console.error(
      "Missing SUPABASE_DB_PASSWORD.\n" +
        "Add your database password to .env.local:\n" +
        "  SUPABASE_DB_PASSWORD=your-db-password\n" +
        "Find it: Supabase Dashboard → Project Settings → Database → Database password\n\n" +
        "Or paste supabase/scripts/APPLY_SOCIAL_ENGINE_SAAS.sql into SQL Editor manually."
    );
    process.exit(1);
  }

  const connectionString =
    process.env.SUPABASE_DB_URL ||
    `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to Supabase Postgres");

  for (const rel of SQL_FILES) {
    const filePath = path.join(root, rel);
    const sql = await fs.readFile(filePath, "utf8");
    console.log(`Applying ${rel}…`);
    await client.query(sql);
    console.log(`  ✓ ${rel}`);
  }

  await client.end();
  console.log("\nAll Social Engine migrations applied.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  console.error("\nFallback: run supabase/scripts/APPLY_SOCIAL_ENGINE_SAAS.sql in Supabase SQL Editor.");
  process.exit(1);
});
