"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "./works.css";
import { SectionFooter } from "../Main/SectionFooter";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/all";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

gsap.registerPlugin(SplitText, ScrollTrigger);

export const CaseStudyDetail = ({ study }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAnimatingRef = useRef(false);

  const titleRef = useRef();
  const summaryRef = useRef();
  const backButtonRef = useRef();
  const gridRef = useRef();
  const heroImageRef = useRef();
  const galleryRefs = useRef([]);

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
    const titleSplit = new SplitText(titleRef.current, { type: "chars" });
    gsap.to(titleRef.current, { opacity: 1 });
    gsap.fromTo(
      titleSplit.chars,
      { filter: "blur(8px)", yPercent: 75, opacity: 0, rotateX: -90 },
      {
        delay: 0.4,
        rotateX: 0,
        opacity: 1,
        filter: "blur(0px)",
        yPercent: 0,
        stagger: 0.025,
        ease: "sine",
      }
    );

    const summarySplit = new SplitText(summaryRef.current, { type: "words" });
    gsap.fromTo(
      summarySplit.words,
      { opacity: 0, skewX: -20, willChange: "filter, transform", filter: "blur(8px)" },
      {
        ease: "sine",
        opacity: 1,
        skewX: 0,
        filter: "blur(0px)",
        stagger: 0.01,
        scrollTrigger: { trigger: summaryRef.current, start: "top 95%" },
      }
    );

    gsap.fromTo(
      backButtonRef.current,
      { opacity: 0, willChange: "filter, transform", filter: "blur(8px)" },
      { delay: 0.6, ease: "sine", opacity: 1, filter: "blur(0px)", duration: 0.5 }
    );

    gsap.fromTo(
      heroImageRef.current,
      { yPercent: -12.5 },
      {
        yPercent: 12.5,
        scrollTrigger: { trigger: ".casestudy-top", start: "top bottom", end: "bottom top", scrub: true },
      }
    );

    const gridItems = gridRef.current?.querySelectorAll(".casestudy-center-item");
    gridItems?.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, willChange: "filter, transform", filter: "blur(8px)", y: 24 },
        {
          ease: "sine",
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.5,
          scrollTrigger: { trigger: el, start: "top 95%" },
        }
      );
    });

    galleryRefs.current.forEach((el, index) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, willChange: "filter, transform", filter: "blur(8px)" },
        {
          delay: index % 2 === 1 ? 0.25 : 0,
          ease: "power1",
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: { trigger: el, start: "top 95%" },
        }
      );
    });
  }, [study.slug]);

  return (
    <ReactLenis root>
      <section className="casestudy">
        <div className="casestudy-content">
          <div className="casestudy-top">
            <div className="casestudy-top-section">
              <div className="casestudy-navigation" ref={backButtonRef}>
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
                <h1 className="subheadline white" ref={titleRef}>
                  {study.title}
                </h1>
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
            <h2 className="small-subheadline white casestudy-summary" ref={summaryRef}>
              {study.summary}
            </h2>
            <div className="casestudy-center-content" ref={gridRef}>
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
                <div
                  key={image}
                  className={boxClass}
                  ref={(el) => {
                    galleryRefs.current[index] = el;
                  }}
                >
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
