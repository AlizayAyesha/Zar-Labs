"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { X } from "lucide-react";
import { CALENDLY_EMBED_URL } from "../config/calendly";

gsap.registerPlugin(CustomEase);

const customEase = CustomEase.create("customEase", ".4,0,.1,1");

const CalendlyContext = createContext({ openCalendly: () => {} });

export const useCalendly = () => useContext(CalendlyContext);

export const CalendlyProvider = ({ children }) => {
  const overlayRef = useRef(null);
  const overlayWidgetRef = useRef(null);
  const overlayWidgetButtonRef = useRef(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com"]')) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const closeOverlay = useCallback(() => {
    gsap.to(overlayWidgetRef.current, {
      yPercent: 10,
      rotate: 5,
      opacity: 0,
      duration: 0.5,
      ease: customEase,
    });
    gsap.to(overlayWidgetButtonRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.5,
      ease: customEase,
    });
    gsap.to(overlayRef.current, {
      delay: 0.1,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
        }
        setIsOverlayVisible(false);
      },
    });
  }, []);

  const openCalendly = useCallback(() => {
    if (isOverlayVisible) {
      closeOverlay();
      return;
    }

    setIsOverlayVisible(true);
    gsap.to(overlayRef.current, { display: "flex", opacity: 1, duration: 0.3 });
    gsap.fromTo(
      overlayWidgetRef.current,
      { yPercent: 10, rotate: 5, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, duration: 0.5, ease: customEase }
    );
    gsap.fromTo(
      overlayWidgetButtonRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: customEase }
    );
  }, [isOverlayVisible, closeOverlay]);

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      closeOverlay();
    }
  };

  return (
    <CalendlyContext.Provider value={{ openCalendly }}>
      {children}
      <div
        className="calendly-overlay"
        ref={overlayRef}
        style={{ display: "none", opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <div className="calendly-overlay-widget" ref={overlayWidgetRef}>
          <div className="calendly-overlay-widget-border" />
          <div className="calendly-overlay-widget-scrollbar-hider" />
          <div
            className="calendly-inline-widget"
            data-url={CALENDLY_EMBED_URL}
          />
        </div>
        <div
          className="calendly-overlay-widget-button"
          ref={overlayWidgetButtonRef}
          onClick={closeOverlay}
        >
          <X className="calendly-overlay-widget-button-icon" />
        </div>
      </div>
    </CalendlyContext.Provider>
  );
};
