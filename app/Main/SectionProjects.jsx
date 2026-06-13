/* eslint-disable react/jsx-key */
"use client";
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Marquee from "react-fast-marquee";
import { Hand, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { PrevButton, NextButton, usePrevNextButtons} from "./Carousel/EmblaCarouselArrowButtons"
import { DotButton, useDotButton } from './Carousel/EmblaCarouselDotButton'
import Fade from 'embla-carousel-fade'
import { PreloadedImage } from "./PreloadedImage";
import { preloadImages } from "../../lib/preloadImages";

const PROJECT_MOCKUPS = [
  "/mockups/heave.webp",
  "/mockups/essentia.webp",
  "/mockups/kinimatic.webp",
  "/mockups/peak.webp",
  "/mockups/vitalenta.webp",
  "/mockups/rev.webp",
];

gsap.registerPlugin(ScrollTrigger);

export const SectionProjects = () => {

  const imageContainerRef = useRef();
  const contentRef = useRef();
  const cursor = useRef()
  const [showCursor, setShowCursor] = useState(false)

  // GSAP ANIMATIONS — parallax only

  useEffect(() => {
    preloadImages(PROJECT_MOCKUPS);
    gsap.fromTo(imageContainerRef.current, { yPercent: 7.5 }, { yPercent: -7.5, scrollTrigger: { trigger: ".projects", start: "top bottom", end: "bottom top", scrub: true} })
  }, [])

  // EMBLA CAROUSEL

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

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
  

  return (
    <section className="projects projects-desktop">
      <div className="textbox">
        <div className="subheadline-box opacity-blur">
          <Star className="subheadline-box-icon" />
          <h2 className="small-description grey" >Featured Works</h2>
        </div>
        <div className="titlebox">
          <div className="titlebox-big-gradient" />
          <h2 className="subheadline white">Pioneering Projects That Consistently <br className="hide-on-mobile" /> Redefine What’s Possible</h2>
        </div>
        <p className="description grey">Transforming startups, SMEs, and industry <br className="hide-on-desktop" /> giants into digital leaders.</p>
      </div>
      <div className="projects-content" ref={contentRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onNextButtonClick} >
        <div className="projects-gradient-top" />
        <div className="projects-gradient-bottom" />
          <div className="project-content-wrapper" ref={imageContainerRef} >
          <div className="projects-carousel" ref={emblaRef} >
            <div className="projects-carousel-row">
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/heave.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Heavecorp project" />
              </div>
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/essentia.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Essentia project" />
              </div>
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/kinimatic.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Kinimatic project" />
              </div>
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/peak.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Peak project" />
              </div>
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/vitalenta.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Vita Lenta project" />
              </div>
              <div className="projects-carousel-item">
                <PreloadedImage src="/mockups/rev.webp" width={1920} height={1080} className="projects-carousel-item-image" priority alt="Rev Productions project" />
              </div>
            </div>
          </div>
          </div>
          <div className="projects-carousel-controls">
            <div className="projects-carousel-controls-buttons">
              <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
              <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
            </div>
            <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
                )}
              />
            ))}
            </div>
          </div>
        </div>
        <div className="hover-cursor" ref={cursor}>
          <p className="small-description white" >See More</p>
        </div>
    </section>
  );
};