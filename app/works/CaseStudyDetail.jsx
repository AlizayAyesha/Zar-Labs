"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "./works.css";
import { SectionFooter } from "../Main/SectionFooter";
import { LenisScrollTriggerSync } from "../Main/LenisScrollTriggerSync";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export const CaseStudyDetail = ({ study }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAnimatingRef = useRef(false);
  const heroImageRef = useRef();

  const handleNavigate = (path) => {
    if (pathname === path || isAnimatingRef.current) return;
    router.prefetch(path);
    isAnimatingRef.current = true;
    window.dispatchEvent(new CustomEvent("startAnimation"));
    setTimeout(() => {
      router.push(path);
      isAnimatingRef.current = false;
    }, 750);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      heroImageRef.current,
      { yPercent: -12.5 },
      {
        yPercent: 12.5,
        scrollTrigger: { trigger: ".casestudy-top", start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  }, [study.slug]);

  return (
    <ReactLenis root>
      <LenisScrollTriggerSync />
      <section className="casestudy">
        <div className="casestudy-content">
          <div className="casestudy-top">
            <div className="casestudy-top-section">
              <div className="casestudy-navigation">
                <button
                  type="button"
                  className="casestudy-navigation-button"
                  onClick={() => handleNavigate("/works")}
                >
                  <ArrowLeft className="casestudy-navigation-button-icon" />
                  <p className="small-description white">Case Studies</p>
                </button>
              </div>
              <div className="casestudy-top-heading">
                <p className="description accent-green casestudy-category">{study.category}</p>
                <h1 className="subheadline white">{study.title}</h1>
              </div>
            </div>
            <div className="casestudy-top-section">
              <div className="casestudy-hero-placeholder" aria-hidden="true" />
            </div>
            <div className="casestudy-top-gradient" />
            <img
              src={study.heroImage}
              ref={heroImageRef}
              className="casestudy-top-image"
              alt={study.title}
            />
          </div>

          <div className="casestudy-center">
            <h2 className="small-subheadline white casestudy-summary">{study.summary}</h2>
            <div className="casestudy-center-content">
              <div className="casestudy-center-item">
                <p className="casestudy-center-item-label">Challenge</p>
                <p className="small-description grey casestudy-center-item-text">{study.challenge}</p>
              </div>
              <div className="casestudy-center-item">
                <p className="casestudy-center-item-label">Solution</p>
                <p className="small-description grey casestudy-center-item-text">{study.solution}</p>
              </div>
              <div className="casestudy-center-item">
                <p className="casestudy-center-item-label">Scope</p>
                <ul className="casestudy-scope-tags">
                  {study.scope.map((tag) => (
                    <li key={tag} className="casestudy-scope-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="casestudy-center-item">
                <p className="casestudy-center-item-label">Results</p>
                <ul className="casestudy-results-list">
                  {study.results.map((result) => (
                    <li key={result} className="small-description grey">
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="casestudy-bottom">
            {study.gallery.map((image, index) => {
              const isFull = index === 2 || index === study.gallery.length - 1;
              const boxClass = isFull
                ? "casestudy-bottom-full-imagebox"
                : "casestudy-bottom-half-imagebox";
              return (
                <div key={image} className={boxClass}>
                  <img src={image} className="casestudy-bottom-image" alt="" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <SectionFooter />
    </ReactLenis>
  );
};
