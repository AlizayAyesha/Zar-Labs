"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Keeps GSAP ScrollTrigger in sync with Lenis smooth scroll (scrub/parallax). */
export function LenisScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const root = document.documentElement;

    ScrollTrigger.scrollerProxy(root, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: root.style.transform ? "transform" : "fixed",
    });

    const onScroll = () => ScrollTrigger.update();
    const onRefresh = () => lenis.resize();

    lenis.on("scroll", onScroll);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      ScrollTrigger.scrollerProxy(root);
    };
  }, [lenis]);

  return null;
}
