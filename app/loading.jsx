"use client";

import { ZarLabsLoader } from "./Main/ZarLabsLoader";

export default function Loading() {
  return <ZarLabsLoader simulate className="loading-screen" minDuration={1200} />;
}
