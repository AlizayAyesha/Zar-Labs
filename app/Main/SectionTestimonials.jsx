/* eslint-disable react/jsx-key */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useCalendly } from "./CalendlyProvider";
import { PrevButton, NextButton, usePrevNextButtons } from "./Carousel/EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import { TESTIMONIALS } from "./testimonials-data";

export const SectionTestimonials = () => {
  const { openCalendly } = useCalendly();

  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, align: "start" });
  const [scrollProgress, setScrollProgress] = useState(0);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi);

  const onScroll = useCallback((api) => {
    const progress = Math.max(0, Math.min(1, api.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll(emblaApi);
    emblaApi.on("reInit", onScroll).on("scroll", onScroll).on("slideFocus", onScroll);
  }, [emblaApi, onScroll]);

  return (
    <section className="testimonials">
      <div className="testimonials-content">
        <div className="textbox testimonials-content-textbox">
          <div className="subheadline-box opacity-blur">
            <Send className="subheadline-box-icon" />
            <h2 className="small-description grey">Client success stories</h2>
          </div>
          <div className="titlebox">
            <div className="titlebox-big-gradient" />
            <h2 className="subheadline white">
              Don&apos;t Take Our Word For It! <br />
              Hear It From Our Partners.
            </h2>
          </div>
        </div>
        <div className="opacity-blur">
          <div className="testimonials-carousel" ref={emblaRef}>
            <div className="testimonials-carousel-row">
              <div className="testimonials-item-padding" />
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="testimonials-item">
                  <div className="testimonials-item-content">
                    <div className="testimonials-item-profile">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                    <div className="testimonials-item-center">
                      <p className="big-description white">{testimonial.name}</p>
                      <p className="description grey">{testimonial.role}</p>
                    </div>
                    <p className="description white">{testimonial.quote}</p>
                  </div>
                  <div className="testimonials-item-grid" />
                </div>
              ))}
              <div className="testimonials-item testimonials-item-last">
                <div className="testimonials-item-content testimonials-item-content-last">
                  <div className="testimonials-item-last-top">
                    <p className="description white">Be our next client in this section!</p>
                  </div>
                  <p className="small-subheadline white">Let&apos;s connect and build something great.</p>
                  <div className="contact-button-wrapper" onClick={openCalendly}>
                    <button className="contact-button-white" type="button">
                      <span>
                        <span className="contact-button-container-white">
                          <span className="contact-button-primary-white"></span>
                          <span className="contact-button-complimentary-white"></span>
                        </span>
                      </span>
                      <span className="description black">Book a call</span>
                    </button>
                  </div>
                </div>
                <div className="background-gradient-circle-3" />
                <div className="testimonials-item-grid" />
              </div>
              <div className="testimonials-item-padding" />
            </div>
          </div>
        </div>

        <div className="testimonials-content-bottom">
          <div className="testimonials-content-bottom-buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
          <div className="embla__progress">
            <div
              className="embla__progress__bar"
              style={{ transform: `translate3d(${scrollProgress}%,0px,0px)` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
