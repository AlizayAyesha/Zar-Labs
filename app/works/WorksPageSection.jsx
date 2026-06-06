"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactLenis } from 'lenis/react'
import "./works.css";
import { LenisScrollTriggerSync } from "../Main/LenisScrollTriggerSync";
import { PrevButton, NextButton, usePrevNextButtons} from "../Main/Carousel/EmblaCarouselArrowButtons"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowUpRight, Zap } from "lucide-react";
import { SectionFooter } from "../Main/SectionFooter";
import { usePathname, useRouter } from 'next/navigation';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { CASE_STUDIES } from "./case-studies-data";
import { useCalendly } from "../Main/CalendlyProvider";
import { PreloadedImage } from "../Main/PreloadedImage";
import { preloadImages } from "../../lib/preloadImages";

const WORKS_MOCKUP_IMAGES = [
  "/mockups/heave.webp",
  "/mockups/essentia.webp",
  "/mockups/kinimatic.webp",
  "/mockups/peak.webp",
  "/mockups/vitalenta.webp",
  "/mockups/rev.webp",
];

const WORKS_INDUSTRY_IMAGES = [
  "/images/test14.webp",
  "/images/test17.webp",
  "/images/test18.webp",
  "/images/test19.webp",
];

gsap.registerPlugin(ScrollTrigger);

const WORKS_LENIS_OPTIONS = {
  prevent: (node) =>
    Boolean(
      node.closest?.(".works-carousel-wrapper, .works-carousel, .casestudies-carousel")
    ),
};

const WORKS_EMBLA_OPTIONS = { dragFree: true, align: "start" };

export const WorksPageSection = () => {
  const { openCalendly } = useCalendly();
  const router = useRouter();
  const pathname = usePathname();
  const isAnimatingRef = useRef(false);

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

  // ANIMATIONS
  const titleRef = useRef()
  const subtitleRef1 = useRef()
  const subtitleRef2 = useRef()
  const descriptionRef = useRef()
  const subdescriptionRef1 = useRef()
  const subdescriptionRef2 = useRef()
  const lineRef = useRef()
  const carouselWrapperRef = useRef()
  const worksItemRef1 = useRef()
  const worksItemRef2 = useRef()
  const worksItemRef3 = useRef()
  const industryImageRef1 = useRef()
  const industryImageRef2 = useRef()
  const industryImageRef3 = useRef()
  const industryImageRef4 = useRef()
  const subheadlineBoxRef1 = useRef()
  const subheadlineBoxRef2 = useRef()
  const cursor = useRef()
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    let cancelled = false;

    const revealCarousel = () => {
      if (cancelled || !worksItemRef1.current) return;
      gsap.to(worksItemRef1.current, { opacity: 0, duration: 0.75, ease: "power1" });
    };

    preloadImages([
      ...WORKS_MOCKUP_IMAGES,
      ...WORKS_INDUSTRY_IMAGES,
      ...CASE_STUDIES.map((s) => s.carouselImage),
    ]).finally(revealCarousel);

    gsap.fromTo(industryImageRef1.current, { width: 0 }, { width: "100%", scrollTrigger: { trigger: industryImageRef1.current, start: "top bottom", end: "center center", scrub: true } });
    gsap.fromTo(industryImageRef2.current, { width: 0 }, { width: "100%", scrollTrigger: { trigger: industryImageRef2.current, start: "top bottom", end: "center center", scrub: true } });
    gsap.fromTo(industryImageRef3.current, { width: 0 }, { width: "100%", scrollTrigger: { trigger: industryImageRef3.current, start: "top bottom", end: "center center", scrub: true } });
    gsap.fromTo(industryImageRef4.current, { width: 0 }, { width: "100%", scrollTrigger: { trigger: industryImageRef4.current, start: "top bottom", end: "center center", scrub: true } });

    return () => {
      cancelled = true;
    };
  }, [])

  // FOLLOWING CURSOR
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.05;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = () => {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;

      cursorX += distX * speed;
      cursorY += distY * speed;

      if (cursor.current) {
        cursor.current.style.left = `${cursorX}px`;
        cursor.current.style.top = `${cursorY}px`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (showCursor) {
      gsap.to(cursor.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    } else {
      gsap.to(cursor.current, {
        autoAlpha: 0,
        scale: 0,
        duration: 0.3,
        ease: 'power3.in',
      });
    }
  }, [showCursor]);

  const handleMouseEnter = () => {
    setShowCursor(true);
  };

  const handleMouseLeave = () => {
    setShowCursor(false);
  };

  // EMBLA CAROUSEL
  const [emblaRef, emblaApi] = useEmblaCarousel(WORKS_EMBLA_OPTIONS);
  const [emblaRef2, emblaApi2] = useEmblaCarousel(WORKS_EMBLA_OPTIONS);
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollProgress2, setScrollProgress2] = useState(0);
  
  const {
    prevBtnDisabled: prevBtnDisabled1,
    nextBtnDisabled: nextBtnDisabled1,
    onPrevButtonClick: onPrevButtonClick1,
    onNextButtonClick: onNextButtonClick1,
  } = usePrevNextButtons(emblaApi);
  
  const {
    prevBtnDisabled: prevBtnDisabled2,
    nextBtnDisabled: nextBtnDisabled2,
    onPrevButtonClick: onPrevButtonClick2,
    onNextButtonClick: onNextButtonClick2,
  } = usePrevNextButtons(emblaApi2);
  
  const onScroll = useCallback((emblaApi, setProgress) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setProgress(progress * 100);
  }, []);
  
  useEffect(() => {
    if (!emblaApi) return;
  
    const handleScroll = () => onScroll(emblaApi, setScrollProgress);
    handleScroll();
    emblaApi.on("reInit", handleScroll).on("scroll", handleScroll).on("slideFocus", handleScroll);
  
    return () => emblaApi.off("reInit", handleScroll).off("scroll", handleScroll).off("slideFocus", handleScroll);
  }, [emblaApi, onScroll]);
  
  useEffect(() => {
    if (!emblaApi2) return;
  
    const handleScroll = () => onScroll(emblaApi2, setScrollProgress2);
    handleScroll();
    emblaApi2.on("reInit", handleScroll).on("scroll", handleScroll).on("slideFocus", handleScroll);
  
    return () => emblaApi2.off("reInit", handleScroll).off("scroll", handleScroll).off("slideFocus", handleScroll);
  }, [emblaApi2, onScroll]);

  useEffect(() => {
    if (!emblaApi && !emblaApi2) return;

    const reInitCarousels = () => {
      emblaApi?.reInit();
      emblaApi2?.reInit();
    };

    reInitCarousels();
    window.addEventListener("resize", reInitCarousels);
    return () => window.removeEventListener("resize", reInitCarousels);
  }, [emblaApi, emblaApi2]);

  return (
    <ReactLenis root options={WORKS_LENIS_OPTIONS}>
      <LenisScrollTriggerSync />
      <section className="works" >
        <div className="works-content" >
          <div className="works-content-top">
            <div className="works-content-top-text">
              <div className="works-content-textbox">
                <div className="titlebox">
                  <div className="subpage-titlebox-gradient" />
                  <h1 className="headline white" ref={titleRef} >Collection of Our Works</h1>
                </div>
                <p className="description grey opacity-blur" ref={descriptionRef} >Case studies offer a unique opportunity to explore real-world examples of challenges, solutions, and results.</p>
              </div>
              <div className="works-content-top-divider" ref={lineRef} />
            </div>
            <div
              className="works-carousel-wrapper"
              data-lenis-prevent-touch
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="works-carousel" ref={emblaRef2} data-lenis-prevent-touch>
                <div className="works-carousel-wrapper-overlay" ref={worksItemRef1} />
                <div className="works-carousel-row">
                  <div className="works-item-padding" />
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Kinimatic</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/heave.webp" className="works-item-content-image" width={750} height={750} priority alt="Heavecorp project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Vita Lenta</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/essentia.webp" className="works-item-content-image" width={750} height={750} priority alt="Essentia project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Peak Creations</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/kinimatic.webp" className="works-item-content-image" width={750} height={750} priority alt="Kinimatic project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Vita Lenta</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/peak.webp" className="works-item-content-image" width={750} height={750} priority alt="Peak Creations project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Vita Lenta</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/vitalenta.webp" className="works-item-content-image" width={750} height={750} priority alt="Vita Lenta project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-content" >
                      <div className="works-item-content-textbox">
                        <h2 className="subheadline white" >Rev Productions</h2>
                        <div className="works-item-content-textbox-row">
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Web Design & Development</p>
                          </div>
                          <div className="works-item-content-textbox-button">
                            <p className="small-description white" >Branding</p>
                          </div>
                        </div>
                      </div>
                      <PreloadedImage src="/mockups/rev.webp" className="works-item-content-image" width={750} height={750} priority alt="Rev Productions project" />
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item" >
                    <div className="works-item-last-content" >
                      <p className="description white" >Be our next client in this section!</p>
                      <h2 className="subheadline white" >Let&apos;s connect and build something great.</h2>
                      <div className="contact-button-wrapper" onClick={openCalendly}>
                        <button className="contact-button-white" type="button">
                          <span>
                            <span className="contact-button-container-white">
                              <span className="contact-button-primary-white"></span>
                              <span className="contact-button-complimentary-white"></span>
                            </span>
                          </span>
                          <span className="description black" >Book a call</span>
                        </button>
                      </div>
                    </div>
                    <div className="works-item-border" />
                  </div>
                  <div className="works-item-padding" />
                </div>
              </div>
              <div className="casestudies-carousel-bottom">
                <div className="casestudies-carousel-bottom-buttons">
                  <PrevButton onClick={onPrevButtonClick2} disabled={prevBtnDisabled2} />
                  <NextButton onClick={onNextButtonClick2} disabled={nextBtnDisabled2} />
                </div>
                <div className="embla__progress">
                  <div className="embla__progress__bar" style={{ transform: `translate3d(${scrollProgress2}%,0px,0px)` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="works-industries">
            <div className="works-subtextbox">
              <div className="subheadline-box opacity-blur" ref={subheadlineBoxRef1} >
                <Zap className="subheadline-box-icon" />
                <h2 className="small-description grey" >Industries we serve</h2>
              </div>
              <div className="titlebox">
                <div className="titlebox-medium-gradient" />
                <h1 className="subheadline white" ref={subtitleRef1} >We have extensive experience <br /> across multiple industries</h1>
              </div>
              <p className="description grey" ref={subdescriptionRef1} >Our product designers have completed projects in different niches. They know how to add business value and provide.</p>
            </div>
            <div className="works-industries-container">
              <div className="works-industries-divider" />
              <div className="works-industries-item" >
                <div className="works-industries-item-left">
                  <h2 className="small-subheadline white" >Supply Chain & Logistics</h2>
                </div>
                <div className="works-industries-item-right">
                  <div className="works-industries-item-right-imagebox" ref={industryImageRef1} >
                    <PreloadedImage src="/images/test14.webp" className="works-industries-item-right-image" alt="Supply chain and logistics" />
                  </div>
                </div>
              </div>
              <div className="works-industries-divider" />
              <div className="works-industries-item">
                <div className="works-industries-item-left">
                  <h2 className="small-subheadline white" >Luxury Travel & Hospitality</h2>
                </div>
                <div className="works-industries-item-right">
                  <div className="works-industries-item-right-imagebox" ref={industryImageRef2} >
                    <PreloadedImage src="/images/test17.webp" className="works-industries-item-right-image" alt="Luxury travel and hospitality" />
                  </div>
                </div>
              </div>
              <div className="works-industries-divider" />
              <div className="works-industries-item">
                <div className="works-industries-item-left">
                  <h2 className="small-subheadline white" >Real Estate & Development</h2>
                </div>
                <div className="works-industries-item-right">
                  <div className="works-industries-item-right-imagebox" ref={industryImageRef3} >
                    <PreloadedImage src="/images/test18.webp" className="works-industries-item-right-image" alt="Real estate and development" />
                  </div>
                </div>
              </div>
              <div className="works-industries-divider" />
              <div className="works-industries-item">
                <div className="works-industries-item-left">
                  <h2 className="small-subheadline white" >Technology & AI</h2>
                </div>
                <div className="works-industries-item-right">
                  <div className="works-industries-item-right-imagebox" ref={industryImageRef4} >
                    <PreloadedImage src="/images/test19.webp" className="works-industries-item-right-image" alt="Technology and AI" />
                  </div>
                </div>
              </div>
              <div className="works-industries-divider" />
            </div>
          </div>
          <div className="works-casestudies">
            <div className="works-subtextbox">
              <div className="subheadline-box opacity-blur" ref={subheadlineBoxRef2} >
                <Zap className="subheadline-box-icon" />
                <h2 className="small-description grey" >Case Studies</h2>
              </div>
              <div className="titlebox">
                <div className="titlebox-medium-gradient" />
                <h1 className="subheadline white" ref={subtitleRef2} >We have a diverse portfolio of <br /> successful case studies</h1>
              </div>
              <p className="description grey" ref={subdescriptionRef2} >Real projects across AI, SaaS, integrations, cloud, analytics, and growth — see how we deliver measurable results.</p>
            </div>
            <div className="casestudies-carousel-wrapper opacity-blur" ref={carouselWrapperRef} data-lenis-prevent-touch onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
              <div className="casestudies-carousel" ref={emblaRef} data-lenis-prevent-touch>
                <div className="casestudies-carousel-row">
                  <div className="casestudies-item-padding" />
                  {CASE_STUDIES.map((study) => (
                    <div
                      key={study.slug}
                      className="casestudies-item casestudies-item--clickable"
                      role="link"
                      tabIndex={0}
                      onClick={() => handleNavigate(`/works/${study.slug}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleNavigate(`/works/${study.slug}`);
                        }
                      }}
                    >
                      <div className="casestudies-item-content">
                        <div className="casestudies-item-content-textbox">
                          <div className="subheadline-box">
                            <Zap className="subheadline-box-icon" />
                            <h2 className="small-description grey">{study.category}</h2>
                          </div>
                          <h3 className="small-subheadline white">{study.title}</h3>
                          <p className="description grey">{study.excerpt}</p>
                        </div>
                        <div className="casestudies-item-content-imagebox">
                          <div className="button casestudies-item-content-imagebox-button">
                            <div className="button-content">
                              <span className="small-description white">Read More</span>
                              <span className="small-description white">Read More</span>
                            </div>
                            <ArrowUpRight className="casestudies-item-content-imagebox-button-icon" />
                          </div>
                          <PreloadedImage
                            src={study.carouselImage}
                            className="casestudies-item-content-image"
                            alt={study.title}
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="casestudies-item-padding" />
                </div>
              </div>
              <div className="casestudies-carousel-bottom">
                <div className="casestudies-carousel-bottom-buttons">
                  <PrevButton onClick={onPrevButtonClick1} disabled={prevBtnDisabled1} />
                  <NextButton onClick={onNextButtonClick1} disabled={nextBtnDisabled1} />
                </div>
                <div className="embla__progress">
                  <div className="embla__progress__bar" style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hover-cursor" ref={cursor}>
          <p className="small-description white" >Drag</p>
        </div>

      </section>
      <SectionFooter />
    </ReactLenis>
  );
};