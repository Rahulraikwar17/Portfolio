import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import PsychedelicText from "./PsychedelicText.jsx";

gsap.registerPlugin(ScrollTrigger, SplitText);

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.97,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      gsap.utils.toArray(".about-paragraph").forEach((paragraph) => {
        const split = new SplitText(paragraph, {
          type: "words",
        });

        gsap.set(split.words, {
          opacity: 0,
          y: 20,
          filter: "blur(6px)",
        });

        gsap.to(split.words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: paragraph,
            start: "top 90%",
            end: "top 55%",
            scrub: 1.2,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 w-full overflow-hidden px-5 py-28 text-[#d6ffe6] sm:px-8 md:py-36 lg:px-12"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#39ff88]/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#6d8f63]/[0.12] blur-[140px]" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-[1500px]"
      >
        <div className="mb-16 text-center md:mb-24">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#6d8f63]">
            Get to know me
          </p>

          <h2 className="mt-3 text-5xl font-medium tracking-tight md:text-7xl">
            <PsychedelicText text="About" />
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-12 lg:gap-20 xl:gap-24">
          <div className="md:sticky md:top-28">
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#6d8f63]">
              <span className="h-px w-8 bg-[#39ff88]" />
              Who am I?
            </p>

            <h3 className="mt-6 text-4xl font-medium leading-[1.05] transition-[color,text-shadow] duration-300 hover:text-[#39ff88] hover:[text-shadow:0_0_0.3em_rgba(57,255,136,0.45)] sm:text-5xl md:text-6xl lg:text-7xl">
              I build complete
              <br />
              web products.
            </h3>
          </div>

          <div className="max-w-2xl border-l border-[#6d8f63]/30 pl-5 sm:pl-8 md:ml-auto">
            <p className="about-paragraph text-lg leading-relaxed text-[#d6ffe6]/70 md:text-xl">
              I'm Rahul Raikwar, a full stack developer who designs the
              interface and builds the server behind it, from the first
              animation to the last API route.
            </p>

            <p className="about-paragraph mt-6 text-base leading-relaxed text-[#6d8f63]">
              I started with frontend, crafting interactive experiences with
              React and GSAP. Now I also build backends with Node.js, Express
              and MongoDB, so I can take an idea all the way to a working,
              deployed product. A website shouldn't just work, it should feel
              memorable too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;