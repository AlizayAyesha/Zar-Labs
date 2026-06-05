/* eslint-disable react/jsx-key */
import React, { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Marquee from "react-fast-marquee";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { Item3 } from "./HeroModel/Coins";

gsap.registerPlugin(SplitText, ScrollTrigger);

const HERO_SERVICE_TAGS = [
  "AI",
  "SaaS",
  "Cloud",
  "Integration",
  "Automation",
  "DevOps",
  "Analytics",
];

export const SectionHero = () => {
  const router = useRouter();

  const titleRef = useRef();
  const descriptionRef = useRef();
  const buttonRef = useRef();
  const tagsRef = useRef();
  const cursor = useRef();
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    gsap.set(titleRef.current, { opacity: 1 });

    const titleSplit = new SplitText(titleRef.current, { type: "chars" });
    gsap.fromTo(
      titleSplit.chars,
      { "will-change": "opacity, transform", filter: "blur(8px)", opacity: 0, yPercent: 50 },
      { delay: 0.4, opacity: 1, filter: "blur(0px)", yPercent: 0, stagger: 0.02, duration: 0.75, ease: "power1" }
    );

    gsap.to(descriptionRef.current, { opacity: 1, filter: "blur(0px)", duration: 1, delay: 0.9 });
    gsap.to(buttonRef.current, { delay: 1.1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power1" });
    gsap.to(tagsRef.current, { opacity: 1, filter: "blur(0px)", duration: 1, delay: 0.9 });
  }, []);

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

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (showCursor) {
      gsap.to(cursor.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(cursor.current, {
        autoAlpha: 0,
        scale: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [showCursor]);

  const handleMouseEnter = () => setShowCursor(true);
  const handleMouseLeave = () => setShowCursor(false);

  return (
    <section className="hero tech-pattern-bg">
      <div className="hero-background-element-small" />
      <div className="hero-background-element-grid-small" />
      <div className="hero-gradient-bottom-right" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-content-row">
          <div className="hero-content-left">
            <div className="hero-textbox">
              <div className="hero-titlebox">
                <div className="hero-titlebox-gradient" />
                <h1 className="headline hero-headline white" ref={titleRef}>
                  Crafting Digital <br /> Masterpieces
                </h1>
              </div>
              <p className="big-description grey opacity-blur" ref={descriptionRef}>
                Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality
              </p>
            </div>
            <div className="hero-buttons-row">
              <button
                type="button"
                className="button button-transparent-border opacity-blur"
                ref={buttonRef}
                onClick={() => router.push("/contact")}
              >
                <div className="button-content">
                  <span className="small-description">Get In Touch</span>
                  <span className="small-description">Get In Touch</span>
                </div>
                <div className="button-circle">
                  <ArrowUpRight className="button-icon" />
                </div>
              </button>
            </div>
          </div>
          <div className="hero-content-right" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Canvas
              style={{ pointerEvents: "auto", width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }}
              camera={{ position: [2, 0, 10], fov: 35 }}
            >
              <Suspense fallback>
                <Float rotationIntensity={0.5} floatIntensity={2} speed={2}>
                  <Item3 />
                </Float>
                <Environment preset="sunset" />
                <OrbitControls maxPolarAngle={Math.PI / 2} enableZoom={false} enableRotate={true} enablePan={false} />
              </Suspense>
            </Canvas>
          </div>
        </div>
        <div className="hero-content-bottom hero-service-marquee opacity-blur" ref={tagsRef}>
          <Marquee
            className="hero-service-marquee-row"
            gradient={true}
            gradientColor="#010101"
            gradientWidth={120}
            speed={35}
          >
            {[...HERO_SERVICE_TAGS, ...HERO_SERVICE_TAGS].map((tag, i) => (
              <div className="hero-service-marquee-item" key={`${tag}-${i}`}>
                <span className="hero-service-tag">{tag}</span>
                <span className="hero-service-tag-sep" aria-hidden="true">
                  ·
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
      <div className="hover-cursor" ref={cursor}>
        <p className="small-description white">Drag</p>
      </div>
    </section>
  );
};
