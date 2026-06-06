/* eslint-disable react/jsx-key */
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight, Layers } from "lucide-react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export const SectionTechstack = ({ videoSrc = "/videos/logos.mp4" }) => {

    const subheadlineBoxRef = useRef()
    const titleRef = useRef()
    const descriptionRef = useRef()
    const bentoBoxRef1 = useRef()
    const bentoBoxRef2 = useRef()
    const bentoBoxRef3 = useRef()

    useEffect(() => {

    gsap.to(subheadlineBoxRef.current, { opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power1', scrollTrigger: { trigger: subheadlineBoxRef.current, start: "top 95%" }});

    const titleSplit = new SplitText(titleRef.current, { type: "words" });
    gsap.fromTo(titleSplit.words, { 'will-change': 'opacity, transform', filter: 'blur(8px)', opacity: 0, yPercent: 50 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, stagger: 0.05, duration: 0.75, ease: "power2", scrollTrigger: { trigger: titleRef.current, start: "top 95%" } });

    const descriptionSplit = new SplitText(descriptionRef.current, { type: "words" });
    gsap.fromTo(descriptionSplit.words, { filter: 'blur(8px)', opacity: 0 }, { opacity: 1, filter: 'blur(0px)', stagger: 0.025, ease: 'sine', scrollTrigger: { trigger: descriptionRef.current, start: "top 95%" } });

    gsap.fromTo(bentoBoxRef1.current, { rotationY: 30, scale: 0.6, opacity: 0 }, { rotationY: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'power1', scrollTrigger: { trigger: bentoBoxRef1.current, start: "top bottom" }});
    gsap.fromTo(bentoBoxRef2.current, { rotationY: 30, scale: 0.6, opacity: 0 }, { rotationY: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'power1', scrollTrigger: { trigger: bentoBoxRef2.current, start: "top bottom" }});
    const addClassnames = () => {
        const cards = document.querySelectorAll(".techstack-item-card");
        cards.forEach((card, index) => {
            card.classList.add(`techstack-item-card-animated-${index + 1}`);
        });
        setTimeout(() => {
            cards.forEach((card) => {
            card.classList.add("techstack-item-card-animated-hover");
        });
        }, 1250);
    };
    gsap.fromTo(bentoBoxRef3.current, { rotationY: 30, scale: 0.6, opacity: 0 }, { delay: 0.2, rotationY: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'power1', scrollTrigger: { trigger: bentoBoxRef3.current, start: "top bottom" }, onComplete: addClassnames });

    }, [])

    const videoRef = useRef(null);

    const handleVideoButtonClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

  return (
    <section className="techstack tech-pattern-bg">
        <div className="techstack-content">
            <div className="textbox">
                <div className="subheadline-box opacity-blur" ref={subheadlineBoxRef} >
                    <Layers className="subheadline-box-icon accent-green" />
                    <h2 className="small-description grey" >Our Techstack</h2>
                </div>
                <div className="titlebox">
                    <div className="titlebox-big-gradient" />
                    <h1 className="subheadline white" ref={titleRef} >Integrating Powerful Tools To Create Seamless, <br className="hide-on-mobile" /> Scalable, And Innovative Solutions.</h1>
                </div>
                <p className="description grey" ref={descriptionRef} >Maximizing Results with Cutting-Edge Technology</p>
            </div>
            <div className="techstack-container">
                <div className="techstack-item-big techstack-item-no-padding" ref={bentoBoxRef1} >
                    <div className="techstack-item-content">
                        <div className="techstack-item-content-center">
                            <div className="textbox">
                                <h2 className="small-subheadline white hide-on-mobile" >Maximizing Results with <br /> Cutting-Edge Technology</h2>
                                <button className="button hero-button button-transparent-border" onClick={handleVideoButtonClick} >
                                    <div className="button-content">
                                        <span className="small-description">See Integrations</span>
                                        <span className="small-description">See Integrations</span>
                                    </div>
                                    <div className="button-circle button-circle-white">
                                        <ArrowUpRight className="button-icon button-icon-180" />
                                    </div>
                                </button>
                            </div>
                        </div>
                        <video className="techstack-item-content-video" ref={videoRef} src={videoSrc} alt="Duotone" muted playsInline={true} data-wf-ignore="true" loop  />
                    </div>
                    <div className="background-gradient-circle" />
                    <div className="techstack-item-no-padding-border" />
                </div>
                <div className="techstack-item-small techstack-item-small-mobile-big" ref={bentoBoxRef2} >
                    <div className="techstack-item-content">
                        <div className="techstack-item-content-column techstack-item-content-column--integration">
                            <div className="techstack-item-content-column-textbox">
                                <h2 className="small-subheadline white">Integration Is Key</h2>
                                <p className="description grey">
                                    We connect APIs, cloud services, CRMs, and business tools into one unified stack—so your systems work together, not in silos.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="background-gradient-circle" />
                </div>
                <div className="techstack-item-small bentoBoxRef3" ref={bentoBoxRef3} >
                    <div className="techstack-item-content-cards">
                        <div className="techstack-item-content-textbox">
                            <h2 className="small-subheadline white" >Seamless Client Updates</h2>
                            <p className="description grey" >Personalized tools, effortless updates, communication made simple.</p>
                        </div>
                        <div className="techstack-item-cards">
                            <div className="techstack-item-card techstack-item-card-1" >
                                <div className="techstack-item-card-content techstack-item-card-content-1">
                                    <div className="techstack-item-card-content-top">
                                        <p className="description white" >Slack</p>
                                        <img src="/logos/slack.png" className="techstack-item-card-content-top-image" alt="" />
                                    </div>
                                    <div className="techstack-item-card-content-bottom">
                                        <p className="small-description grey" >Content draft progress at 75%. Feedback incorporated, updates shared.</p>
                                    </div>
                                    <p className="small-description grey" >Nov 5</p>
                                </div>
                            </div>
                            <div className="techstack-item-card techstack-item-card-2" >
                                <div className="techstack-item-card-content techstack-item-card-content-2">
                                    <div className="techstack-item-card-content-top">
                                        <p className="description white" >Gmail</p>
                                        <img src="/logos/gmail.png" className="techstack-item-card-content-top-image" alt="" />
                                    </div>
                                    <div className="techstack-item-card-content-bottom">
                                        <p className="small-description grey" >Development is now 90% complete. Testing schedule shared with all stakeholders.</p>
                                    </div>
                                    <p className="small-description grey" >Nov 6</p>
                                </div>
                            </div>
                            <div className="techstack-item-card techstack-item-card-3" >
                                <div className="techstack-item-card-content">
                                    <div className="techstack-item-card-content-top">
                                        <p className="description white" >Notion</p>
                                        <img src="/logos/notion.png" className="techstack-item-card-content-top-image" alt="" />
                                    </div>
                                    <div className="techstack-item-card-content-bottom">
                                        <p className="small-description grey" >Design phase completed successfully. Tasks updated and prepared for review.</p>
                                    </div>
                                    <p className="small-description grey" >Nov 7</p>
                                </div>
                            </div>
                            <div className="techstack-item-card techstack-item-card-4" >
                                <div className="techstack-item-card-content techstack-item-card-content-4">
                                    <div className="techstack-item-card-content-top">
                                        <p className="description white" >Miro</p>
                                        <img src="/logos/miro.svg" className="techstack-item-card-content-top-image" alt="Miro" />
                                    </div>
                                    <div className="techstack-item-card-content-bottom">
                                        <p className="small-description grey" >Visual roadmap updated. Boards synced and shared with the client team.</p>
                                    </div>
                                    <p className="small-description grey" >Nov 8</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="background-gradient-circle-2" />
                </div>
            </div>
        </div>
    </section>
  );
};
