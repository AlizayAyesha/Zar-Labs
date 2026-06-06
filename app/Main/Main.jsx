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
import { useEffect, useState } from 'react';

const Main = ({ videos = {} }) => {

  const [fadeOut, setFadeOut] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.start();
    const timer = setTimeout(() => setFadeOut(true), 500);
    return () => clearTimeout(timer);
  }, [lenis]);

  return (
    <ReactLenis root>
      <ZarLabsLoader fadeOut={fadeOut} />
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
