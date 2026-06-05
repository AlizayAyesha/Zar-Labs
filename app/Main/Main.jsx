"use client";
import { ReactLenis, useLenis } from 'lenis/react'
import { SectionHero } from "./SectionHero";
import { SectionFooter } from "./SectionFooter";
import { SectionTestimonials } from "./SectionTestimonials";
import { SectionTechstack } from "./SectionTechstack";
import { SectionFlower } from "./SectionFlower";
import { SectionServices } from "./SectionServices";
import { SectionProjects } from "./SectionProjects";
import { SectionProjectsMobile } from "./SectionProjectsMobile";
import { SectionKPI } from "./SectionKPI";
import { ZarLabsLoader } from "./ZarLabsLoader";
import "./main.css";
import { useEffect, useLayoutEffect, useState } from 'react';
import { useProgress } from "@react-three/drei";

const Main = ({ videos = {} }) => {

  const { progress } = useProgress();
  const [fadeOut, setFadeOut] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (minTimeElapsed && progress >= 100) {
      setFadeOut(true);
      lenis?.start();
    }
  }, [progress, minTimeElapsed, lenis]);

  useEffect(() => {
    const fallback = setTimeout(() => {
      setFadeOut(true);
      lenis?.start();
    }, 2000);
    return () => clearTimeout(fallback);
  }, [lenis]);

  return (
    <ReactLenis root>
      <ZarLabsLoader progress={progress} fadeOut={fadeOut} />
      <SectionHero />
      <div className="border-padding">
        <div className="section-border"></div>
      </div>
      <SectionServices videoSrc={videos["home.services"]} />
      <div className="normal-padding" />
      <SectionProjects />
      <SectionProjectsMobile />
      <div className="normal-padding" />
      <SectionTechstack videoSrc={videos["home.techstack.logos"]} />
      <div className="normal-padding" />
      <SectionTestimonials />
      <SectionKPI />
      <div className="normal-padding" />
      <SectionFlower />
      <div className="normal-padding normal-padding--footer-fade" />
      <SectionFooter />
    </ReactLenis>
  );
};

export default Main;
