import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import LiquidText from "./LiquidText";
import { BsDiscord } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          textRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          linksRef.current.children,
          {
            y: 25,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#090807] text-white"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-12 md:px-12 lg:px-16">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">
            Contact
          </p>

          <p className="font-mono text-[10px] text-white/30">
            AVAILABLE FOR WORK
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div ref={titleRef}>
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
              Have a project in mind?
            </p>

            <LiquidText>
              <h2 className="text-[18vw] font-semibold leading-[0.75] tracking-[-0.07em] md:text-[12vw] hover:text-[#FF6B3D]">
                LET&apos;S
              </h2>

              <h2 className="text-[18vw] font-semibold leading-[0.75] tracking-[-0.07em] md:text-[12vw] hover:text-[#FF6B3D]">
                TALK<span className="text-white/25">.</span>
              </h2>
            </LiquidText>
          </div>

          <p
            ref={textRef}
            className="mt-12 max-w-md text-sm leading-7 text-white/45 md:text-base"
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something interesting.
          </p>

          <a
            href="mailto:yourmail@gmail.com"
            className="group mt-8 flex w-fit items-center gap-3 border-b border-white/20 pb-2 text-sm transition-all duration-300 hover:border-white"
          >
            <Mail size={15} className="text-white/40" />

            <span>rahulraikwae350@gmail.com</span>

            <ArrowUpRight
              size={15}
              className="text-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        <div
          ref={linksRef}
          className="flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Rahulraikwar17"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
            >
              <FaGithub size={16} />
            </a>

            <a
              href="https://www.linkedin.com/in/rahul-raikwar-7a9674306/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
            >
              <FaLinkedinIn size={16} />
            </a>

            <a
              href="https://discord.com/users/1004779116253425789"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
            >
              <BsDiscord size={16} />
            </a>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            © 2026 Rahul Raikwar
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
          >
            Back to top
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
