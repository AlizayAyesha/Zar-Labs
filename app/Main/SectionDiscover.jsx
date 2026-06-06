"use client";

import { ArrowUpRight, Briefcase, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export const SectionDiscover = () => {
  const router = useRouter();

  return (
    <section className="discover tech-pattern-bg">
      <div className="discover-content">
        <div className="textbox">
          <div className="subheadline-box opacity-blur">
            <Briefcase className="subheadline-box-icon accent-green" />
            <h2 className="small-description grey">Explore Zar Labs</h2>
          </div>
          <div className="titlebox">
            <div className="titlebox-gradient" />
            <h1 className="subheadline white">Discover Who We Are & What We Build</h1>
          </div>
          <p className="description grey">
            Learn about our team, process, and the digital solutions we&apos;ve built for clients across industries.
          </p>
        </div>
        <div className="discover-grid">
          <button type="button" className="discover-card" onClick={() => router.push("/about")}>
            <div className="discover-card-imagebox">
              <img src="/images/brandlogo.jpeg" className="discover-card-image" alt="" />
              <div className="discover-card-image-overlay" />
            </div>
            <div className="discover-card-body">
              <div className="discover-card-icon-row">
                <Users className="discover-card-icon accent-green" />
                <span className="small-description grey">About Us</span>
              </div>
              <h2 className="small-subheadline white">Our story, team &amp; why clients choose us</h2>
              <p className="description grey">Meet the people behind Zar Labs and how we turn ideas into digital products.</p>
              <span className="discover-card-link small-description white">
                View About
                <ArrowUpRight className="discover-card-link-icon" />
              </span>
            </div>
          </button>
          <button type="button" className="discover-card" onClick={() => router.push("/works")}>
            <div className="discover-card-imagebox">
              <img src="/mockups/kinimatic.webp" className="discover-card-image" alt="" />
              <div className="discover-card-image-overlay" />
            </div>
            <div className="discover-card-body">
              <div className="discover-card-icon-row">
                <Briefcase className="discover-card-icon accent-green" />
                <span className="small-description grey">Our Works</span>
              </div>
              <h2 className="small-subheadline white">Case studies, mockups &amp; projects we&apos;ve built</h2>
              <p className="description grey">Browse real client work across web design, branding, and custom software.</p>
              <span className="discover-card-link small-description white">
                View Works
                <ArrowUpRight className="discover-card-link-icon" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
