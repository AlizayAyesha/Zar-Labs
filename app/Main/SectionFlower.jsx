/* eslint-disable react/jsx-key */
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { preloadImages } from "../../lib/preloadImages";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 300;
const PRELOAD_COUNT = 12;

function buildFrameUrls(isMobile) {
  const step = isMobile ? 6 : 2;
  const urls = [];
  for (let i = 1; i <= TOTAL_FRAMES; i += step) {
    urls.push(`/imageSequence/image${i}.webp`);
  }
  return urls;
}

function loadFrame(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(url));
    img.src = url;
  });
}

function imageSequence({ canvas, urls, scrollTrigger, isMobile }) {
  const playhead = { frame: 0 };
  const ctx = canvas.getContext("2d");
  let curFrame = -1;
  const images = new Array(urls.length).fill(null);

  const drawCover = (img) => {
    if (!img?.complete || !img.naturalWidth) return false;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return false;

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const nw = img.naturalWidth * scale;
    const nh = img.naturalHeight * scale;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, (w - nw) / 2, (h - nh) / 2, nw, nh);
    return true;
  };

  const drawFrame = (index) => {
    const frame = Math.max(0, Math.min(urls.length - 1, Math.round(index)));
    if (frame === curFrame) return;
    const img = images[frame];
    if (img && drawCover(img)) {
      curFrame = frame;
    }
  };

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    curFrame = -1;
    drawFrame(playhead.frame);
  };

  const updateImage = () => drawFrame(playhead.frame);

  let cancelled = false;

  (async () => {
    try {
      images[0] = await loadFrame(urls[0]);
      if (!cancelled) {
        resize();
        drawFrame(0);
        ScrollTrigger.refresh();
      }
    } catch (err) {
      console.warn("[SectionFlower] first frame failed:", err.message);
    }

    preloadImages(urls.slice(1, PRELOAD_COUNT)).catch(() => {});

    urls.forEach((url, i) => {
      if (i === 0) return;
      loadFrame(url)
        .then((img) => {
          if (cancelled) return;
          images[i] = img;
          if (Math.round(playhead.frame) === i) drawFrame(i);
        })
        .catch((err) => console.warn("[SectionFlower] frame failed:", err.message));
    });
  })();

  resize();
  window.addEventListener("resize", resize);

  const tween = gsap.to(playhead, {
    frame: urls.length - 1,
    ease: "none",
    onUpdate: updateImage,
    scrollTrigger,
  });

  return () => {
    cancelled = true;
    window.removeEventListener("resize", resize);
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export const SectionFlower = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const urls = buildFrameUrls(isMobile);

    const cleanup = imageSequence({
      canvas,
      urls,
      isMobile,
      scrollTrigger: {
        trigger: ".flower",
        start: "top bottom",
        end: isMobile ? "+=120%" : "+=200%",
        scrub: 0.5,
      },
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(refreshTimer);
      cleanup?.();
    };
  }, []);

  return (
    <section className="flower">
      <div className="flower-content">
        <div className="projects-gradient-top" />
        <div className="projects-gradient-bottom" />
        <div className="flower-content-sequence">
          <canvas className="image-sequence-canvas" ref={canvasRef} id="image-sequence" />
        </div>
        <div className="flower-content-textbox">
          <div className="flower-content-textbox-item">
            <span>
              <h1 className="subheadline white">Grow</h1>
            </span>
            <span>
              <h1 className="subheadline white">Your</h1>
            </span>
            <span>
              <h1 className="subheadline white">Digital</h1>
            </span>
          </div>
          <div className="flower-content-textbox-item">
            <span>
              <h1 className="subheadline white">Presence,</h1>
            </span>
            <span>
              <h1 className="subheadline white">Let</h1>
            </span>
            <span>
              <h1 className="subheadline white">Your</h1>
            </span>
          </div>
          <div className="flower-content-textbox-item">
            <span>
              <h1 className="subheadline white">Vision</h1>
            </span>
            <span>
              <h1 className="subheadline white">Bloom</h1>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
