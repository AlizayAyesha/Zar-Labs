/* eslint-disable react/jsx-key */
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const TOTAL_FRAMES = 300;

function buildFrameUrls(isMobile) {
  const step = isMobile ? 6 : 2;
  const urls = [];
  for (let i = 1; i <= TOTAL_FRAMES; i += step) {
    urls.push(`/imageSequence/image${i}.webp`);
  }
  return urls;
}

function imageSequence({ canvas, urls, scrollTrigger, isMobile }) {
  const playhead = { frame: 0 };
  const ctx = canvas.getContext("2d");
  let curFrame = -1;
  const images = new Array(urls.length);

  const drawCover = (img) => {
    if (!img?.complete || !img.naturalWidth) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const nw = img.naturalWidth * scale;
    const nh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, (w - nw) / 2, (h - nh) / 2, nw, nh);
  };

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const frame = Math.round(playhead.frame);
    if (images[frame]) drawCover(images[frame]);
  };

  const updateImage = () => {
    const frame = Math.round(playhead.frame);
    if (frame === curFrame) return;
    const img = images[frame];
    if (img?.complete) {
      drawCover(img);
      curFrame = frame;
    }
  };

  urls.forEach((url, i) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = i === 0 ? "eager" : "lazy";
    img.src = url;
    img.onload = () => {
      images[i] = img;
      if (i === 0 || i === Math.round(playhead.frame)) updateImage();
    };
    images[i] = img;
  });

  resize();
  window.addEventListener("resize", resize);

  const tween = gsap.to(playhead, {
    frame: urls.length - 1,
    ease: "none",
    onUpdate: updateImage,
    scrollTrigger,
  });

  return () => {
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

    return imageSequence({
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
  }, []);

  const textRef1 = useRef();
  const textRef2 = useRef();
  const textRef3 = useRef();
  const textRef4 = useRef();
  const textRef5 = useRef();
  const textRef6 = useRef();
  const textRef7 = useRef();
  const textRef8 = useRef();

  useEffect(() => {
    const refs = [textRef1, textRef2, textRef3, textRef4, textRef5, textRef6, textRef7, textRef8];
    const splits = refs.map((ref) => new SplitText(ref.current, { type: "chars" }));

    splits.forEach((split, index) => {
      gsap.fromTo(
        split.chars,
        { opacity: 0.4 },
        {
          opacity: 1,
          duration: 0.35,
          stagger: 0.04,
          scrollTrigger: { trigger: refs[index].current, start: "top 92%", toggleActions: "play none none none" },
        }
      );
    });
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
              <h1 className="subheadline white" ref={textRef1}>Grow</h1>
            </span>
            <span>
              <h1 className="subheadline white" ref={textRef2}>Your</h1>
            </span>
            <span>
              <h1 className="subheadline white" ref={textRef3}>Digital</h1>
            </span>
          </div>
          <div className="flower-content-textbox-item">
            <span>
              <h1 className="subheadline white" ref={textRef4}>Presence,</h1>
            </span>
            <span>
              <h1 className="subheadline white" ref={textRef5}>Let</h1>
            </span>
            <span>
              <h1 className="subheadline white" ref={textRef6}>Your</h1>
            </span>
          </div>
          <div className="flower-content-textbox-item">
            <span>
              <h1 className="subheadline white" ref={textRef7}>Vision</h1>
            </span>
            <span>
              <h1 className="subheadline white" ref={textRef8}>Bloom</h1>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
