import { createClient } from "@supabase/supabase-js";
import { buildFallbackVideosMap, buildVideosMapFromRows } from "./media";

const REVALIDATE_SECONDS = 3600;

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** All published site videos keyed by video_key → CDN or local URL */
export async function getSiteVideosMap() {
  const supabase = createPublicClient();
  if (!supabase) return buildFallbackVideosMap();

  const { data, error } = await supabase
    .from("site_videos")
    .select(
      "video_key, storage_path, local_fallback, poster_path, autoplay, loop, muted, preload, page, section"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return buildFallbackVideosMap();

  return buildVideosMapFromRows(data);
}

/** Homepage videos only */
export async function getHomeVideosMap() {
  const supabase = createPublicClient();
  const fallback = buildFallbackVideosMap();

  if (!supabase) {
    return {
      "home.services": fallback["home.services"],
      "home.techstack.logos": fallback["home.techstack.logos"],
    };
  }

  const { data, error } = await supabase
    .from("site_videos")
    .select("video_key, storage_path, local_fallback")
    .eq("page", "home")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return {
      "home.services": fallback["home.services"],
      "home.techstack.logos": fallback["home.techstack.logos"],
    };
  }

  return buildVideosMapFromRows(data);
}

export { REVALIDATE_SECONDS };
