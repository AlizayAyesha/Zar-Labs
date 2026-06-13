"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCmsEditorShell } from "../AdminCmsEditorShell";
import { ZAR_IMAGE_COLORS } from "../../../constants/social/zarBrandVisuals";

export function ImageStudioDashboard() {
  const [headline, setHeadline] = useState("Custom software that ships outcomes");
  const [subline, setSubline] = useState("Zar Labs — BUILD · AI · GROW · PROOF");
  const [layout, setLayout] = useState("quote-card");
  const [colors, setColors] = useState(ZAR_IMAGE_COLORS);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [limits, setLimits] = useState(null);
  const [usage, setUsage] = useState(null);
  const [plan, setPlan] = useState("free");

  const loadAccount = useCallback(async () => {
    const [meRes, imgRes] = await Promise.all([
      fetch("/api/social-engine/me"),
      fetch("/api/social-engine/generate-image"),
    ]);
    if (meRes.ok) {
      const me = await meRes.json();
      setLimits(me.limits);
      setUsage(me.usage);
      setPlan(me.subscriptionPlan || "free");
    }
    if (imgRes.ok) {
      const img = await imgRes.json();
      setImages(img.images || []);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  async function handleGenerate() {
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/social-engine/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: { headline, subline, layout, colors },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setImages((prev) => [
        {
          id: `new-${Date.now()}`,
          image_url: json.imageUrl,
          prompt: headline,
          watermark: json.watermark,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      loadAccount();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const imagesUsed = usage?.imagesGenerated || 0;
  const imagesCap = limits?.images || 5;

  return (
    <AdminCmsEditorShell
      title="Image Studio"
      description="Standalone image generator — quick templates without strategy chat. For post planning + inline images, use Strategy Chat or Schedule."
    >
      <div className="se-studio-grid se-studio-layout--solo">
        <section className="dashboard-card se-studio-form">
          <h2>Template brief</h2>
          <p className="admin-cms-placeholder">
            Plan: <strong>{plan}</strong> — {imagesUsed}/{imagesCap} images this month
            {limits?.watermark ? " · Free tier images include a watermark" : ""}
          </p>
          <p className="admin-cms-placeholder se-studio-palette">
            Palette: {colors.join(" · ")} — matches zar-labs.vercel.app
          </p>
          <label className="dashboard-field">
            Headline
            <input value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </label>
          <label className="dashboard-field">
            Subline
            <input value={subline} onChange={(e) => setSubline(e.target.value)} />
          </label>
          <label className="dashboard-field">
            Layout
            <select value={layout} onChange={(e) => setLayout(e.target.value)}>
              <option value="quote-card">Quote card</option>
              <option value="carousel-cover">Carousel cover</option>
              <option value="cta-card">CTA card</option>
            </select>
          </label>
          {error ? <p className="dashboard-alert dashboard-alert-error">{error}</p> : null}
          <button
            type="button"
            className="dashboard-btn dashboard-btn-primary"
            disabled={generating}
            onClick={handleGenerate}
          >
            {generating ? "Generating…" : "Generate image"}
          </button>
        </section>

        <section className="dashboard-card se-studio-gallery">
          <h2>Your images</h2>
          {images.length ? (
            <div className="se-studio-images">
              {images.map((img) => (
                <figure key={img.id} className={`se-studio-image-card${img.watermark ? " is-watermarked" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt={img.prompt || "Generated"} loading="lazy" />
                  {img.watermark ? <span className="se-watermark-badge">Zar Labs Free</span> : null}
                  <figcaption>
                    <a href={img.image_url} target="_blank" rel="noopener noreferrer">
                      Open ↗
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="admin-cms-placeholder">Generated images appear here.</p>
          )}
        </section>
      </div>
    </AdminCmsEditorShell>
  );
}
