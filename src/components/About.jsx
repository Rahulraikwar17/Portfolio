import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import LiquidText from "./LiquidText";

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
        const split = new SplitText(paragraph, { type: "words" });

        gsap.set(split.words, { opacity: 0, y: 20, filter: "blur(6px)" });

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

      gsap.from(".about-chip", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-stack",
          start: "top 88%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden bg-[#090909] px-6 py-28 text-white md:py-36"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#FF6B3D]/10 blur-[140px]" />

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-16 text-center md:mb-24">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
            Get to know me
          </p>

          <h2 className="mt-3 text-5xl font-medium tracking-tight transition-colors duration-300 hover:text-[#FF6B3D] md:text-7xl">
            <LiquidText>About</LiquidText>
          </h2>
        </div>

        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-20">
          <div className="md:sticky md:top-28">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/30">
              Who am I?
            </p>

            <h3 className="mt-6 text-4xl font-medium leading-[1.05] transition-colors duration-300 hover:text-[#FF6B3D] md:text-6xl">
              <LiquidText>
                I build complete
                <br />
                web products.
              </LiquidText>
            </h3>
          </div>

          <div className="max-w-xl">
            <p className="about-paragraph text-lg leading-relaxed text-white/60 md:text-xl">
              I'm Rahul Raikwar, a full stack developer who designs the
              interface and builds the server behind it, from the first
              animation to the last API route.
            </p>

            <p className="about-paragraph mt-6 text-base leading-relaxed text-white/40">
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
