/* eslint-disable jsx-a11y/alt-text */
"use client";
import { ArrowUpRight, X } from "lucide-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

export const Navigation = () => {

    // ANIMATIONS

    const navigationBar = useRef()
    const navigationBarCenter = useRef()
    const navigationBarCenterRef1 = useRef()
    const navigationBarCenterRef2 = useRef()
    const navigationBarCenterRef3 = useRef()
    const navigationBarCenterRef4 = useRef()

    useLayoutEffect(() => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            gsap.set(navigationBar.current, {
                opacity: 1,
                rotateY: "0deg",
                scale: "1",
                rotateX: "0deg",
                translateY: "0vh",
                width: "100%",
            });
            return;
        }

        gsap.to(navigationBar.current, { opacity: 1, rotateY: "0deg", scale: "1", rotateX: "0deg", translateY: "0vh", duration: 0.75, ease: 'power1', delay: 0.75 })
        gsap.fromTo(navigationBar.current, { width: "25%" }, { width: "100%", duration: 0.75, ease: "power1", delay: 1.75 })
        gsap.fromTo(navigationBarCenter.current, { display: "none" }, { display: "flex", duration: 0.01, delay: 1.75 })
        gsap.to(navigationBarCenterRef1.current, { opacity: 1, duration: 1, delay: 1.75 })
        gsap.to(navigationBarCenterRef2.current, { opacity: 1, duration: 1, delay: 1.85 })
        gsap.to(navigationBarCenterRef3.current, { opacity: 1, duration: 1, delay: 1.95 })
        gsap.to(navigationBarCenterRef4.current, { opacity: 1, duration: 1, delay: 2.05 })
    }, [])

    // NAVIGATION

    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    const handleNavigate = (path) => {
        setMobileMenuOpen(false);
        router.push(path);
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.classList.toggle('nav-menu-open', mobileMenuOpen);
        return () => document.body.classList.remove('nav-menu-open');
    }, [mobileMenuOpen]);

  return (
    <>
        <div className={`navigation-wrapper${mobileMenuOpen ? ' navigation-wrapper--menu-open' : ''}`}>
        <div className="navigation-inside" ref={navigationBar} >
            <Link href="/" className="navigation-inside-left" onClick={() => setMobileMenuOpen(false)} aria-label="Zar Labs home">
                <img src="/images/zarlabs-logo.webp" className="navigation-inside-left-image" alt="Zar Labs" />
            </Link>
            <div className="navigation-inside-big" ref={navigationBarCenter} >
                <p className="small-description white hover-text-white opacity" ref={navigationBarCenterRef1} onClick={() => handleNavigate('/')} >Home</p>
                <p className="small-description white hover-text-white opacity" ref={navigationBarCenterRef2} onClick={() => handleNavigate('/about')} >About</p>
                <p className="small-description white hover-text-white opacity" ref={navigationBarCenterRef3} onClick={() => handleNavigate('/works')} >Works</p>
            </div>
            <div className="navigation-inside-right">
                <button className="button button-navigation button-transparent-border" onClick={() => handleNavigate('/contact')} >
                    <div className="button-content">
                        <span className="small-description">Get In Touch</span>
                        <span className="small-description">Get In Touch</span>
                    </div>
                    <div className="button-circle button-circle-white">
                        <ArrowUpRight className="button-icon" />
                    </div>
                </button>
            </div>
            <button
                type="button"
                className={`navigation-inside-right-mobile${mobileMenuOpen ? ' is-open' : ''}`}
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
            >
                <span className="navigation-inside-right-mobile-line" />
                <span className="navigation-inside-right-mobile-line" />
                <span className="navigation-inside-right-mobile-line" />
            </button>
        </div>
        </div>

        <nav
            className={`navigation-mobile-menu${mobileMenuOpen ? ' is-open' : ''}`}
            aria-hidden={!mobileMenuOpen}
        >
            <div className="navigation-mobile-menu-top">
                <span className="navigation-mobile-menu-label small-description grey">Menu</span>
                <button
                    type="button"
                    className="navigation-mobile-menu-close"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <X className="navigation-mobile-menu-close-icon" />
                </button>
            </div>
            <div className="navigation-mobile-menu-links">
                <button type="button" className="navigation-mobile-menu-link" onClick={() => handleNavigate('/')}>Home</button>
                <button type="button" className="navigation-mobile-menu-link" onClick={() => handleNavigate('/about')}>About</button>
                <button type="button" className="navigation-mobile-menu-link" onClick={() => handleNavigate('/works')}>Works</button>
                <button type="button" className="navigation-mobile-menu-link navigation-mobile-menu-link--cta" onClick={() => handleNavigate('/contact')}>
                    Get In Touch
                    <ArrowUpRight className="navigation-mobile-menu-link-icon" />
                </button>
            </div>
        </nav>
    </>
  );
};
