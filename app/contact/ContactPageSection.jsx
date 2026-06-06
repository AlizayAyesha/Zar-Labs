"use client";
import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import "./contact.css";
import { SectionFooter } from "../Main/SectionFooter";
import { LenisScrollTriggerSync } from "../Main/LenisScrollTriggerSync";
import { Instagram, Mail, Phone } from "lucide-react";
import { ZAR_LABS_EMAIL, ZAR_LABS_PHONE, ZAR_LABS_PHONE_DISPLAY } from "../config/contact";

export const ContactPageSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let box1X = 0;
    let box1Y = 0;
    const speed = 0.025;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 100 - 50;
      mouseY = (event.clientY / window.innerHeight) * 100 - 50;
    };

    const animate = () => {
      const distX1 = mouseX * -1 - box1X;
      const distY1 = mouseY * -1 - box1Y;
      box1X += distX1 * speed;
      box1Y += distY1 * speed;

      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${box1X}px, ${box1Y}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ReactLenis root>
      <LenisScrollTriggerSync />
      <section className="contact">
        <div className="contact-content">
          <div className="contact-content-top">
            <div className="titlebox">
              <div className="titlebox-gradient" />
              <h1 className="headline white">Get in Touch</h1>
            </div>
            <div className="contact-divider" />
          </div>
          <div className="contact-content-row">
            <div className="contact-content-left">
              <div className="contact-content-column">
                <div className="contact-content-top-item opacity-blur">
                  <div className="contact-content-top-item-profile">
                    <img src="/images/mockup4.webp" className="contact-content-top-item-image" alt="" />
                  </div>
                  <div className="contact-content-top-item-text">
                    <p className="description white">Let&apos;s bring your idea to life. Reach out and get in touch with management directly.</p>
                  </div>
                </div>
                <div className="contact-content-column-row">
                  <a
                    href={`tel:${ZAR_LABS_PHONE}`}
                    className="contact-content-small-item opacity-blur"
                    aria-label={`Call ${ZAR_LABS_PHONE_DISPLAY}`}
                  >
                    <Phone strokeWidth={2.5} className="contact-content-small-item-icon" />
                    <p className="small-description grey">Call</p>
                  </a>
                  <div className="contact-content-small-item opacity-blur">
                    <Mail strokeWidth={2.5} className="contact-content-small-item-icon" />
                    <p className="small-description grey">Email</p>
                  </div>
                  <a
                    href="https://www.instagram.com/zar_labs/"
                    className="contact-content-small-item opacity-blur"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Zar Labs on Instagram"
                  >
                    <Instagram strokeWidth={2.5} className="contact-content-small-item-icon" />
                    <p className="small-description grey">Instagram</p>
                  </a>
                </div>
                <div className="contact-content-item">
                  <p className="small-description grey">Call</p>
                  <a href={`tel:${ZAR_LABS_PHONE}`} className="description white contact-content-link">
                    {ZAR_LABS_PHONE_DISPLAY}
                  </a>
                </div>
                <div className="contact-content-item">
                  <p className="small-description grey">Email</p>
                  <a href={`mailto:${ZAR_LABS_EMAIL}`} className="description white contact-content-link">
                    {ZAR_LABS_EMAIL}
                  </a>
                </div>
                <div className="contact-content-item">
                  <p className="small-description grey">Location</p>
                  <p className="description white">Karachi, Pakistan</p>
                </div>
              </div>
            </div>
            <div className="contact-content-right opacity-blur">
              <img src="/images/zarlabs-logo.webp" className="contact-content-right-image" ref={imageRef} alt="Zar Labs" />
            </div>
          </div>
        </div>
      </section>
      <SectionFooter />
    </ReactLenis>
  );
};
