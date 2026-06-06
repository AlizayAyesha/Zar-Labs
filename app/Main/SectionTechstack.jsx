/* eslint-disable react/jsx-key */
import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ArrowUpRight, Layers } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { usePrevNextButtons } from "./Carousel/EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./Carousel/EmblaCarouselDotButton";
import { motion } from "framer-motion";
import { preloadImages } from "../../lib/preloadImages";

gsap.registerPlugin(ScrollTrigger);

const TWEEN_FACTOR_BASE = 0.25;

const numberWithinRange = (number, min, max) => Math.min(Math.max(number, min), max);

const TECHSTACK_SLIDER_IMAGES = [
  "/images/abs.webp",
  "/logos/blenderwhite.svg",
  "/logos/ae.svg",
  "/logos/photoshop.svg",
  "/logos/davinciresolvewhite.svg",
  "/logos/houdini.png",
];

const TECHSTACK_CARD_IMAGES = [
  "/logos/slack.png",
  "/logos/gmail.png",
  "/logos/notion.png",
  "/logos/miro.svg",
];

export const SectionTechstack = ({ videoSrc = "/videos/logos.mp4" }) => {
  const bentoBoxRef1 = useRef();
  const bentoBoxRef2 = useRef();
  const bentoBoxRef3 = useRef();
  const videoRef = useRef(null);

  useEffect(() => {
    preloadImages([...TECHSTACK_SLIDER_IMAGES, ...TECHSTACK_CARD_IMAGES]);

    const video = videoRef.current;
    if (video) {
      video.preload = "auto";
      video.load();
    }

    gsap.set([bentoBoxRef1.current, bentoBoxRef2.current, bentoBoxRef3.current], {
      rotationY: 30,
      scale: 0.6,
      opacity: 0,
    });

    const animateCards = () => {
      const cards = document.querySelectorAll(".techstack-item-card");
      cards.forEach((card, index) => {
        card.classList.add(`techstack-item-card-animated-${index + 1}`);
      });
      requestAnimationFrame(() => {
        cards.forEach((card) => {
          card.classList.add("techstack-item-card-animated-hover");
        });
      });
    };

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".techstack-container",
        start: "top 88%",
        once: true,
      },
    });

    timeline
      .to(bentoBoxRef1.current, {
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(
        bentoBoxRef2.current,
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.28"
      )
      .to(
        bentoBoxRef3.current,
        {
          rotationY: 0,
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onStart: animateCards,
        },
        "-=0.28"
      );

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, []);

  const handleVideoButtonClick = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playbackRate = 1.35;

    const play = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      play();
      return;
    }

    video.addEventListener("canplay", play, { once: true });
    video.load();
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: false });
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  const tweenFactor = useRef(0);
  const tweenNodes = useRef([]);

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback((api) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slideNode) => slideNode.querySelector(".techstack-item-content-column-slider-item-child"));
  }, []);

  const setTweenFactor = useCallback((api) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenEffects = useCallback((api, eventName) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const scale = numberWithinRange(tweenValue, 0, 1).toString();
        const opacity = numberWithinRange(tweenValue, 0, 1).toString();

        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `scale(${scale})`;
        }

        api.slideNodes()[slideIndex].style.opacity = opacity;
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenEffects(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenEffects)
      .on("scroll", tweenEffects)
      .on("slideFocus", tweenEffects);
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenEffects]);

  const slideDescriptions = [
    "We create stunning 3D models, animations, and realistic environments for immersive experiences.",
    "Dynamic motion graphics and cinematic visual effects brought to life with seamless precision.",
    "Precision-crafted designs and visuals with unmatched detail for polished, professional results.",
    "Professional-grade video editing and vibrant color grading for high-quality storytelling impact.",
    "Complex simulations and breathtaking VFX for cutting-edge creativity in every project.",
  ];

  return (
    <section className="techstack tech-pattern-bg">
      <div className="techstack-content">
        <div className="textbox">
          <div className="subheadline-box opacity-blur">
            <Layers className="subheadline-box-icon accent-green" />
            <h2 className="small-description grey">Our Techstack</h2>
          </div>
          <div className="titlebox">
            <div className="titlebox-big-gradient" />
            <h1 className="subheadline white">
              Integrating Powerful Tools To Create Seamless, <br className="hide-on-mobile" /> Scalable, And Innovative
              Solutions.
            </h1>
          </div>
          <p className="description grey">Maximizing Results with Cutting-Edge Technology</p>
        </div>
        <div className="techstack-container">
          <div className="techstack-item-big techstack-item-no-padding" ref={bentoBoxRef1}>
            <div className="techstack-item-content">
              <div className="techstack-item-content-center">
                <div className="textbox">
                  <h2 className="small-subheadline white hide-on-mobile">
                    Maximizing Results with <br /> Cutting-Edge Technology
                  </h2>
                  <button className="button hero-button button-transparent-border" type="button" onClick={handleVideoButtonClick}>
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
              <video
                className="techstack-item-content-video"
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                preload="auto"
                data-wf-ignore="true"
                loop
              />
            </div>
            <div className="background-gradient-circle" />
            <div className="techstack-item-no-padding-border" />
          </div>
          <div className="techstack-item-small techstack-item-small-mobile-big" ref={bentoBoxRef2}>
            <div className="techstack-item-content">
              <div className="techstack-item-content-column">
                <div className="techstack-item-content-column-slider">
                  <img src="/images/abs.webp" className="techstack-item-content-column-slider-image" alt="" />
                  <div className="techstack-item-content-column-slider-carousel" ref={emblaRef}>
                    <div className="techstack-item-content-column-slider-carousel-row">
                      <div className="techstack-item-content-column-slider-item">
                        <div className="techstack-item-content-column-slider-item-child">
                          <img src="/logos/blenderwhite.svg" className="techstack-item-content-column-slider-item-image" alt="Blender" />
                        </div>
                      </div>
                      <div className="techstack-item-content-column-slider-item">
                        <div className="techstack-item-content-column-slider-item-child">
                          <img src="/logos/ae.svg" className="techstack-item-content-column-slider-item-image" alt="After Effects" />
                        </div>
                      </div>
                      <div className="techstack-item-content-column-slider-item">
                        <div className="techstack-item-content-column-slider-item-child">
                          <img src="/logos/photoshop.svg" className="techstack-item-content-column-slider-item-image" alt="Photoshop" />
                        </div>
                      </div>
                      <div className="techstack-item-content-column-slider-item">
                        <div className="techstack-item-content-column-slider-item-child">
                          <img
                            src="/logos/davinciresolvewhite.svg"
                            className="techstack-item-content-column-slider-item-image"
                            alt="DaVinci Resolve"
                          />
                        </div>
                      </div>
                      <div className="techstack-item-content-column-slider-item">
                        <div className="techstack-item-content-column-slider-item-child">
                          <img src="/logos/houdini.png" className="techstack-item-content-column-slider-item-image" alt="Houdini" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="techstack-item-content-column-textbox">
                  <h2 className="small-subheadline white">Integration Is Key</h2>
                  <motion.p
                    key={selectedIndex}
                    className="description grey"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.28 }}
                  >
                    {slideDescriptions[selectedIndex]}
                  </motion.p>
                </div>
                <div className="techstack-item-content-column-border" />
                <div className="techstack-item-content-column-bottom">
                  <div className="techstack-item-content-column-bottom-left">
                    <button type="button" className="button techstack-item-content-column-bottom-button" onClick={onPrevButtonClick}>
                      <div className="button-content">
                        <span className="small-description">Previous</span>
                        <span className="small-description">Previous</span>
                      </div>
                    </button>
                  </div>
                  <div className="techstack-item-content-column-bottom-center">
                    <div className="embla__dots-small">
                      {scrollSnaps.map((_, index) => (
                        <DotButton
                          key={index}
                          onClick={() => onDotButtonClick(index)}
                          className={"embla__dot-small".concat(index === selectedIndex ? " embla__dot--selected-small" : "")}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="techstack-item-content-column-bottom-right">
                    <button type="button" className="button techstack-item-content-column-bottom-button" onClick={onNextButtonClick}>
                      <div className="button-content">
                        <span className="small-description">Continue</span>
                        <span className="small-description">Continue</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="background-gradient-circle" />
          </div>
          <div className="techstack-item-small bentoBoxRef3" ref={bentoBoxRef3}>
            <div className="techstack-item-content-cards">
              <div className="techstack-item-content-textbox">
                <h2 className="small-subheadline white">Seamless Client Updates</h2>
                <p className="description grey">Personalized tools, effortless updates, communication made simple.</p>
              </div>
              <div className="techstack-item-cards">
                <div className="techstack-item-card techstack-item-card-1">
                  <div className="techstack-item-card-content techstack-item-card-content-1">
                    <div className="techstack-item-card-content-top">
                      <p className="description white">Slack</p>
                      <img src="/logos/slack.png" className="techstack-item-card-content-top-image" alt="" />
                    </div>
                    <div className="techstack-item-card-content-bottom">
                      <p className="small-description grey">Content draft progress at 75%. Feedback incorporated, updates shared.</p>
                    </div>
                    <p className="small-description grey">Nov 5</p>
                  </div>
                </div>
                <div className="techstack-item-card techstack-item-card-2">
                  <div className="techstack-item-card-content techstack-item-card-content-2">
                    <div className="techstack-item-card-content-top">
                      <p className="description white">Gmail</p>
                      <img src="/logos/gmail.png" className="techstack-item-card-content-top-image" alt="" />
                    </div>
                    <div className="techstack-item-card-content-bottom">
                      <p className="small-description grey">Development is now 90% complete. Testing schedule shared with all stakeholders.</p>
                    </div>
                    <p className="small-description grey">Nov 6</p>
                  </div>
                </div>
                <div className="techstack-item-card techstack-item-card-3">
                  <div className="techstack-item-card-content">
                    <div className="techstack-item-card-content-top">
                      <p className="description white">Notion</p>
                      <img src="/logos/notion.png" className="techstack-item-card-content-top-image" alt="" />
                    </div>
                    <div className="techstack-item-card-content-bottom">
                      <p className="small-description grey">Design phase completed successfully. Tasks updated and prepared for review.</p>
                    </div>
                    <p className="small-description grey">Nov 7</p>
                  </div>
                </div>
                <div className="techstack-item-card techstack-item-card-4">
                  <div className="techstack-item-card-content techstack-item-card-content-4">
                    <div className="techstack-item-card-content-top">
                      <p className="description white">Miro</p>
                      <img src="/logos/miro.svg" className="techstack-item-card-content-top-image" alt="Miro" />
                    </div>
                    <div className="techstack-item-card-content-bottom">
                      <p className="small-description grey">Visual roadmap updated. Boards synced and shared with the client team.</p>
                    </div>
                    <p className="small-description grey">Nov 8</p>
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
