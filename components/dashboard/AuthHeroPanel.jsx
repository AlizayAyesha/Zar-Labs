"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TILE_LABELS = ["BUILD", "AI", "GROW", "PROOF", "Style", "Schedule", "Chat", "Images"];

export function AuthHeroPanel({ variant = "user" }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".auth-hero-grid-line",
        { opacity: 0 },
        { opacity: 0.15, duration: 1.2, stagger: 0.05, ease: "power2.out" }
      );
      gsap.fromTo(
        ".auth-hero-tile",
        { opacity: 0, y: 24, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".auth-hero-copy",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  const isAdmin = variant === "admin";

  return (
    <div className="auth-hero-panel tech-pattern-bg" ref={gridRef}>
      <div className="auth-hero-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`line-${i}`} className="auth-hero-grid-line" />
        ))}
      </div>
      <div className="auth-hero-tiles">
        {TILE_LABELS.map((label) => (
          <div key={label} className="auth-hero-tile">
            {label}
          </div>
        ))}
      </div>
      <div className="auth-hero-copy">
        <p className="auth-hero-eyebrow">Zar Labs Social Engine</p>
        <h2>{isAdmin ? "Command Center" : "Your look. One upload. Done."}</h2>
        <p>
          {isAdmin
            ? "Manage subscribers, style catalog, AI keys, and platform health."
            : "5 free AI images · strategy chat · weekly schedule · trending looks — no prompts needed."}
        </p>
      </div>
    </div>
  );
}
