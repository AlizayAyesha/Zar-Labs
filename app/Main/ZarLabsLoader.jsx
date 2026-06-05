"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const ZarLabsLoader = ({
  progress = 0,
  fadeOut = false,
  simulate = false,
  minDuration = 1200,
  className = "initial-loading-screen",
}) => {
  const logoRef = useRef(null);
  const glowRef = useRef(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [timeProgress, setTimeProgress] = useState(0);

  const displayProgress = simulate
    ? simulatedProgress
    : Math.min(100, Math.max(timeProgress, progress));

  useEffect(() => {
    if (!logoRef.current) return;

    const logoTween = gsap.to(logoRef.current, {
      scale: 1.06,
      duration: 1.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    const glowTween = glowRef.current
      ? gsap.to(glowRef.current, {
          opacity: 0.55,
          scale: 1.15,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      : null;

    return () => {
      logoTween.kill();
      glowTween?.kill();
    };
  }, []);

  useEffect(() => {
    const obj = { val: 0 };
    const target = simulate ? 100 : 90;
    const tween = gsap.to(obj, {
      val: target,
      duration: minDuration / 1000,
      ease: "power1.inOut",
      onUpdate: () => {
        if (simulate) {
          setSimulatedProgress(obj.val);
        } else {
          setTimeProgress(obj.val);
        }
      },
    });

    return () => tween.kill();
  }, [simulate, minDuration]);

  return (
    <div className={`${className} zar-labs-loader ${fadeOut ? "fade-out" : ""}`}>
      <div className="zar-labs-loader__inner">
        <div className="zar-labs-loader__logo-wrap">
          <div className="zar-labs-loader__glow" ref={glowRef} />
          <img
            ref={logoRef}
            src="/images/zarlabs-logo.webp"
            alt="Zar Labs"
            className="zar-labs-loader__logo"
          />
        </div>
        <div className="zar-labs-loader__progress-track">
          <div
            className="zar-labs-loader__progress-bar"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
