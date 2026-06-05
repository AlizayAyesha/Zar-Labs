/* eslint-disable react/jsx-key */
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalendly } from "./CalendlyProvider";

gsap.registerPlugin(SplitText, ScrollTrigger, CustomEase);

export const SectionServices = () => {
  const { openCalendly } = useCalendly();
  const router = useRouter();
  const subheadlineBoxRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    gsap.to(subheadlineBoxRef.current, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.5,
      ease: "power1",
      scrollTrigger: {
        trigger: subheadlineBoxRef.current,
        start: "top 95%",
      },
    });

    const titleSplit = new SplitText(titleRef.current, { type: "words" });
    gsap.fromTo(
      titleSplit.words,
      {
        "will-change": "opacity, transform",
        filter: "blur(8px)",
        opacity: 0,
        yPercent: 100,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        yPercent: 0,
        stagger: 0.085,
        duration: 1,
        ease: "power2",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 95%",
        },
      }
    );

    const descriptionSplit = new SplitText(descriptionRef.current, {
      type: "words",
    });
    gsap.fromTo(
      descriptionSplit.words,
      {
        filter: "blur(8px)",
        opacity: 0,
        skewX: 0,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        skewX: 0,
        stagger: 0.025,
        ease: "sine",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top 95%",
        },
      }
    );

    gsap.to(buttonRef.current, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.5,
      ease: "power1",
      scrollTrigger: {
        trigger: buttonRef.current,
        start: "top 95%",
      },
    });
  }, []);

  return (
    <section className="services tech-pattern-bg">
      <div className="services-content">
        <div className="textbox">
          <div className="subheadline-box opacity-blur" ref={subheadlineBoxRef}>
            <Zap className="subheadline-box-icon accent-green" />
            <h2 className="small-description grey">Our Services</h2>
          </div>

          <div className="titlebox">
            <div className="titlebox-gradient accent-gold" />
            <h1 className="subheadline white" ref={titleRef}>
              Your Digital Powerhouse
            </h1>
          </div>

          <p className="description grey" ref={descriptionRef}>
            Where innovation fuels transformation. We empower brands to redefine possibilities and thrive <br /> in
            the ever-evolving digital landscape.
          </p>

          <div className="contact-button-wrapper opacity-blur" ref={buttonRef} onClick={openCalendly}>
            <button className="contact-button-white" type="button">
              <span>
                <span className="contact-button-container-white">
                  <span className="contact-button-primary-white"></span>
                  <span className="contact-button-complimentary-white"></span>
                </span>
              </span>
              <span className="description black">Book a call</span>
            </button>
          </div>
        </div>

        <div className="services-content-container">
          <div className="services-content-container-left" />
          <div className="services-content-container-right" />
          <div className="services-content-container-bottom" />
          <div className="services-content-container-top" />
          <button
            type="button"
            className="services-content-video-trigger"
            onClick={() => router.push("/project-intake")}
            aria-label="Go to project intake form"
          >
            <video
              src="/videos/serviceshighquality.mp4"
              className="services-content-video"
              autoPlay="autoplay"
              muted
              playsInline={true}
              data-wf-ignore="true"
              preload="auto"
              loop
            />
          </button>
        </div>
      </div>
    </section>
  );
};
