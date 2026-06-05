const SITE_MEDIA_BUCKET = "site-media";

export const FALLBACK_VIDEOS = {
  "home.services": "/videos/serviceshighquality.mp4",
  "home.techstack.logos": "/videos/logos.mp4",
  "works.casestudy.demo": "/casestudy/casestudytestvideo.mov",
};

const STORAGE_PATHS = {
  "home.services": "videos/serviceshighquality.mp4",
  "home.techstack.logos": "videos/logos.mp4",
  "works.casestudy.demo": "videos/casestudytestvideo.mov",
};

/** Public CDN URL for a file in the site-media bucket */
export function getStoragePublicUrl(storagePath) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base || !storagePath) return null;

  const path = storagePath.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${SITE_MEDIA_BUCKET}/${path}`;
}

/** Prefer Supabase Storage CDN; fall back to local /public path */
export function resolveVideoSrc(video) {
  if (!video) return "";

  const storageUrl = getStoragePublicUrl(video.storage_path);
  if (storageUrl && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return storageUrl;
  }

  return video.local_fallback || FALLBACK_VIDEOS[video.video_key] || "";
}

export function resolveVideoSrcByKey(videoKey, videosMap) {
  if (videosMap?.[videoKey]) return videosMap[videoKey];
  return buildFallbackVideosMap()[videoKey] || "";
}

/** CDN URLs when Supabase env is set; otherwise local /public paths */
export function buildFallbackVideosMap() {
  const map = {};
  for (const [key, localPath] of Object.entries(FALLBACK_VIDEOS)) {
    const cdn = getStoragePublicUrl(STORAGE_PATHS[key]);
    map[key] = cdn || localPath;
  }
  return map;
}

export function buildVideosMapFromRows(rows) {
  const map = buildFallbackVideosMap();

  for (const row of rows || []) {
    if (row?.video_key) {
      map[row.video_key] = resolveVideoSrc(row);
    }
  }

  return map;
}
