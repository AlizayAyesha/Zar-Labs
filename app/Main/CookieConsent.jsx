"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./cookie-consent.css";

const CONSENT_KEY = "zarlabs-cookie-consent";

export const CookieConsent = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (pathname?.startsWith("/dashboard") || !visible) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p className="cookie-consent-text">
        We use cookies to keep the site working and improve your experience.{" "}
        <Link href="/cookies" className="cookie-consent-link">
          Learn more
        </Link>
      </p>
      <button type="button" className="cookie-consent-btn" onClick={handleAccept}>
        Accept
      </button>
    </div>
  );
};
