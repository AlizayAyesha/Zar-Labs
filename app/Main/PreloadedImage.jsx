"use client";

import { useEffect, useState } from "react";

/**
 * Renders an img only after the URL is confirmed loadable (or after retry).
 * Keeps layout stable with width/height when provided.
 */
export function PreloadedImage({
  src,
  alt = "",
  className,
  width,
  height,
  priority = false,
  ...rest
}) {
  const [readySrc, setReadySrc] = useState(null);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;
    const img = new Image();
    img.decoding = "async";
    if (priority) img.fetchPriority = "high";

    const finish = (url) => {
      if (!cancelled) setReadySrc(url);
    };

    img.onload = () => finish(src);
    img.onerror = () => {
      // Retry once with cache-bust — handles transient CDN hiccups
      const retry = new Image();
      retry.decoding = "async";
      retry.onload = () => finish(`${src}${src.includes("?") ? "&" : "?"}r=1`);
      retry.onerror = () => finish(src); // show anyway so layout never breaks
      retry.src = `${src}${src.includes("?") ? "&" : "?"}r=1`;
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, priority]);

  if (!readySrc) {
    return (
      <div
        className={className}
        style={{ width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined }}
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={readySrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...rest}
    />
  );
}
