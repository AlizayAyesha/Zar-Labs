/* eslint-disable react/jsx-key */
import React from "react";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalendly } from "./CalendlyProvider";

export const SectionServices = ({ videoSrc = "/videos/serviceshighquality.mp4" }) => {
  const { openCalendly } = useCalendly();
  const router = useRouter();

  return (
    <section className="services tech-pattern-bg">
      <div className="services-content">
        <div className="textbox">
          <div className="subheadline-box opacity-blur">
            <Zap className="subheadline-box-icon accent-green" />
            <h2 className="small-description grey">Our Services</h2>
          </div>

          <div className="titlebox">
            <div className="titlebox-gradient accent-gold" />
            <h1 className="subheadline white">Your Digital Powerhouse</h1>
          </div>

          <p className="description grey">
            Where innovation fuels transformation. We empower brands to redefine possibilities and thrive <br /> in
            the ever-evolving digital landscape.
          </p>

          <div className="contact-button-wrapper opacity-blur" onClick={openCalendly}>
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
              src={videoSrc}
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
