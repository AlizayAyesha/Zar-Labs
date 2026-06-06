/**
 * Preload image URLs in parallel. Uses allSettled so one failure does not block the rest.
 * @returns {{ loaded: string[], failed: string[] }}
 */
export async function preloadImages(urls) {
  const unique = [...new Set(urls.filter(Boolean))];

  const results = await Promise.allSettled(
    unique.map(
      (url) =>
        new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => resolve(url);
          img.onerror = () => reject(new Error(url));
          img.src = url;
        })
    )
  );

  const loaded = [];
  const failed = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") loaded.push(result.value);
    else failed.push(unique[i]);
  });

  if (failed.length) {
    console.warn("[preloadImages] failed:", failed);
  }

  return { loaded, failed };
}
