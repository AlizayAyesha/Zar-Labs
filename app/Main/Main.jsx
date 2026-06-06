"use client";
import { ReactLenis, useLenis } from "lenis/react";
import { SectionHero } from "./SectionHero";
import { SectionFooter } from "./SectionFooter";
import { SectionTestimonials } from "./SectionTestimonials";
import { SectionTechstack } from "./SectionTechstack";
import { SectionFlower } from "./SectionFlower";
import { SectionServices } from "./SectionServices";
import { SectionProjects } from "./SectionProjects";
import { SectionProjectsMobile } from "./SectionProjectsMobile";
import { SectionKPI } from "./SectionKPI";
import { SectionDiscover } from "./SectionDiscover";
import { ZarLabsLoader } from "./ZarLabsLoader";
import { LenisScrollTriggerSync } from "./LenisScrollTriggerSync";
import "./main.css";
import { useEffect, useState } from "react";

function HomePageContent({ videos, fadeOut }) {
  const lenis = useLenis();

  useEffect(() => {
    lenis?.start();
  }, [lenis]);

  return (
    <>
      <LenisScrollTriggerSync />
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
      <SectionDiscover />
      <div className="normal-padding" />
      <SectionTechstack videoSrc={videos["home.techstack.logos"]} />
      <div className="normal-padding" />
      <SectionTestimonials />
      <SectionKPI />
      <div className="normal-padding" />
      <SectionFlower />
      <div className="normal-padding normal-padding--footer-fade" />
      <SectionFooter />
    </>
  );
}

const Main = ({ videos = {} }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root>
      <HomePageContent videos={videos} fadeOut={fadeOut} />
    </ReactLenis>
  );
};

export default Main;
