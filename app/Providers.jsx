"use client";

import { CalendlyProvider } from "./Main/CalendlyProvider";
import { CookieConsent } from "./Main/CookieConsent";

export const Providers = ({ children }) => {
  return (
    <CalendlyProvider>
      {children}
      <CookieConsent />
    </CalendlyProvider>
  );
};
