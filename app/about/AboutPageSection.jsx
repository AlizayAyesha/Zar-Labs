"use client";
import React, { useEffect, useRef, useState } from "react";
import { ReactLenis } from 'lenis/react'
import { SectionFooter } from "../Main/SectionFooter";
import { LenisScrollTriggerSync } from "../Main/LenisScrollTriggerSync";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { ChevronDown } from "lucide-react";
import { useCalendly } from "../Main/CalendlyProvider";
import { AboutPartnersSection } from "./AboutPartnersSection";
import { AboutTeamSection } from "./AboutTeamSection";
import { preloadImages } from "../../lib/preloadImages";

gsap.registerPlugin(ScrollTrigger);

const STICKY_SERVICES = [
    {
        num: "01",
        title: <>AI Solutions &<br />Automation</>,
        description: "Deploy intelligent systems that automate workflows, streamline operations, and enhance customer experiences. From AI chatbots and voice agents to RAG knowledge bases and business process automation, we help organizations operate smarter and scale faster.",
        image: "/images/mockup12.webp",
    },
    {
        num: "02",
        title: <>Custom Software &<br />SaaS Development</>,
        description: "Build secure, scalable, and high-performance digital products tailored to your business. We develop web applications, SaaS platforms, enterprise portals, CRM systems, dashboards, and custom business software designed for long-term growth.",
        image: "/images/macbook.webp",
    },
    {
        num: "03",
        title: <>Systems Integration &<br />Digital Ecosystems</>,
        description: "Connect your technology stack into a unified ecosystem. We integrate CRMs, ERPs, payment gateways, third-party APIs, cloud services, analytics platforms, and business tools to eliminate silos and improve operational efficiency.",
        image: "/images/mockup7.webp",
    },
    {
        num: "04",
        title: <>DevOps, Cloud &<br />Infrastructure</>,
        description: "Establish a reliable technology foundation with modern cloud architecture, CI/CD pipelines, deployment automation, monitoring systems, security hardening, and infrastructure management designed for scalability and resilience.",
        image: "/images/abs.webp",
    },
    {
        num: "05",
        title: <>Data, Analytics &<br />Business Intelligence</>,
        description: "Transform data into actionable insights through analytics dashboards, KPI tracking, reporting systems, and business intelligence solutions that support informed decision-making.",
        image: "/images/test17.webp",
    },
    {
        num: "06",
        title: <>Search Visibility &<br />Growth Engineering</>,
        description: "Improve discoverability, performance, and digital presence through technical SEO, Core Web Vitals optimization, structured data implementation, search strategy, and conversion-focused digital experiences.",
        image: "/images/test19.webp",
    },
];

const PRINCIPLES = [
    {
        id: "innovation",
        title: "Innovation",
        description: "Leveraging modern technologies to create competitive advantages.",
    },
    {
        id: "reliability",
        title: "Reliability",
        description: "Building secure, scalable, and maintainable solutions that businesses can depend on.",
    },
    {
        id: "impact",
        title: "Impact",
        description: "Delivering technology that produces measurable business outcomes.",
    },
];

const WHAT_WE_DO = [
    "Custom Software Development",
    "SaaS Platforms",
    "AI Solutions & Automation",
    "Enterprise Web Applications",
    "E-Commerce Systems",
    "Digital Infrastructure",
    "UI/UX Design",
    "Data & Analytics",
    "Technical Consulting",
    "Managed Support & Maintenance",
];

export const AboutPageSection = () => {
    const { openCalendly } = useCalendly();
    const headlineRef = useRef();
    const bodyRef = useRef();
    const imageRef = useRef();
    const stickyContainerRef = useRef(null);
    const partnersRef = useRef(null);
    const teamRef = useRef(null);
    const [openPrinciple, setOpenPrinciple] = useState(null);

    const togglePrinciple = (id) => {
        setOpenPrinciple((current) => (current === id ? null : id));
    };

    useEffect(() => {
        preloadImages(STICKY_SERVICES.map((s) => s.image));
    }, []);

    useEffect(() => {
        const items = stickyContainerRef.current?.querySelectorAll(".about-sticky-item");
        if (!items?.length) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            const triggers = [];

            items.forEach((el, position) => {
                const isLast = position === items.length - 1;

                gsap.set(el, { willChange: "transform, filter" });

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: "center center",
                        end: "350%",
                        scrub: true,
                    },
                });

                timeline
                .to(el, {
                    ease: "none",
                    startAt: { filter: "blur(0px)" },
                    filter: isLast ? "blur(0px)" : "blur(3px)",
                    scrollTrigger: {
                        trigger: el,
                        start: "center center",
                        end: "+=100%",
                        scrub: true,
                    },
                }, 0)
                .to(el, {
                    ease: "none",
                    scale: isLast ? 1 : 0.55,
                    yPercent: isLast ? 0 : -45,
                }, 0);

                triggers.push(timeline.scrollTrigger);
            });

            return () => {
                triggers.forEach((trigger) => trigger?.kill());
            };
        });

        mm.add("(max-width: 768px)", () => {
            gsap.set(items, { clearProps: "transform,filter,scale,y" });
        });

        return () => mm.revert();
    }, []);

  return (
    <ReactLenis root>
      <LenisScrollTriggerSync />
      <section className="about">
        <div className="about-content">
            <div className="about-whyus">
                <p className="description about-whyus-description grey">Why us</p>
                <h2 className="headline about-whyus-headline white" ref={headlineRef}>
                    About <span className="accent-green">Zar Labs</span>
                </h2>
                <div className="about-whyus-body" ref={bodyRef}>
                    <div className="about-whyus-image-col">
                        <div className="about-whyus-imageframe" ref={imageRef}>
                            <img src="/images/brandlogo.jpeg" className="about-whyus-image" alt="Zar Labs brand" />
                        </div>
                    </div>
                    <div className="about-whyus-text-col">
                    <p className="subheadline about-whyus-paragraph white">
                        At <span className="accent-green">Zar Labs</span>, we help businesses transform ideas into scalable digital products, intelligent automation systems, and technology-driven growth opportunities.
                    </p>
                    <p className="description about-whyus-paragraph grey">
                        We believe technology should do more than exist—it should solve real business challenges, improve operational efficiency, create better customer experiences, and generate measurable results.
                    </p>
                    <p className="description about-whyus-paragraph grey">
                        Our team specializes in building modern websites, custom software platforms, SaaS products, AI-powered solutions, business automation systems, and digital infrastructure that enable organizations to scale with confidence.
                    </p>
                    <p className="description about-whyus-paragraph grey">
                        From startups launching their first product to established companies modernizing legacy systems, we work closely with our clients to understand their goals, identify opportunities, and deliver solutions that create long-term value.
                    </p>
                    <p className="description about-whyus-paragraph grey">
                        What sets <span className="accent-green">Zar Labs</span> apart is our ability to combine software engineering, artificial intelligence, automation, design, and strategic consulting into a unified approach. Rather than delivering isolated services, we build complete digital ecosystems that support business growth at every stage.
                    </p>
                    <p className="description about-whyus-paragraph grey">
                        Through our broader technology ecosystem and strategic collaboration with Vyzion Systems, we are able to support projects ranging from custom business applications and AI implementation to enterprise modernization and digital transformation initiatives.
                    </p>
                    <div className="about-principles">
                        <h3 className="about-principles-heading white">Every project we undertake is guided by three principles:</h3>
                        {PRINCIPLES.map((principle) => {
                            const isOpen = openPrinciple === principle.id;
                            return (
                                <div
                                    key={principle.id}
                                    className={`about-principle-dropdown${isOpen ? " is-open" : ""}`}
                                >
                                    <button
                                        type="button"
                                        className="about-principle-trigger"
                                        onClick={() => togglePrinciple(principle.id)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className="accent-green">{principle.title}</span>
                                        <ChevronDown className="about-principle-icon" aria-hidden="true" />
                                    </button>
                                    <div className="about-principle-panel">
                                        <p className="description about-principle-content grey">{principle.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="description about-whyus-paragraph grey">
                        At <span className="accent-green">Zar Labs</span>, we don&apos;t simply build software. We help organizations leverage technology as a catalyst for growth, efficiency, and long-term success.
                    </p>
                    <div className="about-what-we-do">
                        <h3 className="subheadline about-what-we-do-title white">What We Do</h3>
                        <ul className="about-what-we-do-list">
                            {WHAT_WE_DO.map((item) => (
                                <li key={item} className="description about-what-we-do-item grey">{item}</li>
                            ))}
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
            <div className="about-divider" />
            <AboutTeamSection sectionRef={teamRef} />
            <div className="about-divider" />
            <AboutPartnersSection sectionRef={partnersRef} />
            <div className="about-divider" />
            <div className="about-services-intro">
                <h1 className="headline about-services-heading white">
                    Services <span className="accent-green">we provide</span>
                </h1>
            </div>
            <div className="about-sticky-container" ref={stickyContainerRef}>
                {STICKY_SERVICES.map((service) => (
                    <div
                        key={service.num}
                        className="about-sticky-item"
                    >
                        <div className="about-sticky-item-left">
                            <div className="about-sticky-item-left-textbox">
                                <h1 className="headline white">{service.title}</h1>
                                <p className="about-sticky-item-left-textbox-description grey">{service.description}</p>
                            </div>
                            <h1 className="headline white">({service.num})</h1>
                        </div>
                        <div className="about-sticky-item-right">
                            <div className="about-sticky-item-right-imagebox">
                                <img src={service.image} className="about-sticky-item-right-image" alt="" />
                            </div>
                        </div>
                    </div>
                ))}
			</div>
            <div className="about-consultation-cta">
                <p className="description grey about-consultation-eyebrow">Let&apos;s talk</p>
                <h2 className="headline about-consultation-title white">
                    Don&apos;t know where to start?
                </h2>
                <p className="description about-consultation-text grey">
                    Get a consultation from us — we know what&apos;s best for{" "}
                    <span className="accent-green">your business</span>.
                </p>
                <div className="about-consultation-actions">
                    <button type="button" className="about-consultation-btn about-consultation-btn--primary" onClick={openCalendly}>
                        Book a consultation
                    </button>
                </div>
            </div>
        </div>
      </section>
      <SectionFooter />
    </ReactLenis>
  );
};