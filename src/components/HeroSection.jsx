import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const IMAGE_SRC = "/me2.png";
const NAME = "Rahul";
const SURNAME = "Raikwar";
const ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Creative Developer",
];

const LINKS = [
  { label: "GitHub", href: "https://github.com/Rahulraikwar17" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rahul-raikwar-7a9674306/",
  },
  { label: "Resume", href: "/resume.pdf" },
];

const ArrowUpRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 9L9 3M4 3h5v5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeroSection = () => {
  const containerRef = useRef(null);
  const photoRef = useRef(null);
  const photoShiftRef = useRef(null);
  const lettersRef = useRef([]);
  const roleRef = useRef(null);
  const badgeRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const linksRef = useRef([]);
  const scrollRef = useRef(null);

  /* Role rotate */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (!roleRef.current) return;
      i = (i + 1) % ROLES.length;
      gsap
        .timeline()
        .to(roleRef.current, {
          yPercent: -110,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .add(() => {
          if (roleRef.current) roleRef.current.textContent = ROLES[i];
        })
        .fromTo(
          roleRef.current,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        );
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* Intro */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(lettersRef.current, { yPercent: 115, rotate: 5 });
      gsap.set(
        [
          badgeRef.current,
          copyRef.current,
          ctaRef.current,
          ...linksRef.current,
        ],
        { y: 20, opacity: 0 },
      );
      gsap.set(photoShiftRef.current, { scale: 1.08, opacity: 0 });
      gsap.set(scrollRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        delay: 0.3,
        defaults: { ease: "power3.out" },
      });
      tl.to(photoShiftRef.current, {
        scale: 1.02,
        opacity: 1,
        duration: 1.8,
        ease: "power2.out",
      })
        .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.5)
        .to(
          lettersRef.current,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.6,
        )
        .to(copyRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .to(
          linksRef.current,
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          "-=0.6",
        )
        .to(scrollRef.current, { opacity: 1, duration: 0.8 }, "-=0.4");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const renderWord = (word, offset, outline) => (
    <span className="block overflow-hidden pb-[0.08em]">
      {word.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            lettersRef.current[offset + index] = el;
          }}
          className={`inline-block will-change-transform ${outline ? "text-transparent" : "text-white"}`}
          style={outline ? { WebkitTextStroke: "1.5px #ffffff" } : undefined}
        >
          {letter}
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={containerRef}
      id="home"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[#050505] font-['Space_Grotesk',sans-serif] text-white"
    >
      {/* coral glow + soft grid */}
      <div className="pointer-events-none absolute right-[6%] top-[18%] h-[55vh] w-[38vw] rounded-full bg-[#ff6b3d]/25 blur-[130px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#ff6b3d 1px, transparent 1px), linear-gradient(90deg, #ff6b3d 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent)",
        }}
      />

      {/* PHOTO: image ke apne edges fade hote hain (left, right, top, bottom), isliye cut nahi dikhta */}
      <div className="absolute bottom-[30px] right-0 top-0 opacity-60 md:right-[10vw] md:opacity-100">
        <div
          className="h-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 30%, #000 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 30%, #000 82%, transparent 100%)",
          }}
        >
          <div
            className="h-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, #000 10%, #000 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, #000 10%, #000 86%, transparent 100%)",
            }}
          >
            <div ref={photoRef} className="relative h-full">
              <div
                ref={photoShiftRef}
                className="relative h-full will-change-transform"
              >
                <img
                  src={IMAGE_SRC}
                  alt="Rahul Raikwar"
                  className="block h-full w-auto max-w-none"
                  style={{
                    filter: "grayscale(1) contrast(1.08) brightness(0.92)",
                  }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* left overlay (text readable) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent md:via-[#050505]/20" />

      {/* CONTENT */}
      <section className="relative z-10 flex h-full items-center px-5 pb-[150px] pt-20 md:px-10">
        <div className="w-full max-w-7xl">
          <div
            ref={badgeRef}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b3d] opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b3d]" />
            </span>
            Available for freelance and full-time roles
          </div>

          <h1 className="lemonmilk-font text-[min(14vw,15svh)] font-medium uppercase leading-[0.86] tracking-tighter md:text-[min(10.5vw,17svh)]">
            {renderWord(NAME, 0, false)}
            {renderWord(SURNAME, NAME.length, true)}
          </h1>

          <div className="mt-5 flex items-center gap-3 text-lg font-medium md:text-2xl">
            <span className="h-px w-10 bg-[#ff6b3d]" />
            <span className="inline-block h-[1.4em] overflow-hidden leading-[1.4]">
              <span ref={roleRef} className="inline-block text-[#ff9068]">
                {ROLES[0]}
              </span>
            </span>
          </div>

          <p
            ref={copyRef}
            className="mt-4 max-w-md text-base leading-relaxed text-whitemd:text-lg [@media(max-height:820px)]:hidden"
          >
            I build full-stack web apps, from interfaces that feel alive to the
            APIs and databases behind them.
          </p>

          <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-[#ff6b3d] px-7 py-3.5 text-sm font-semibold text-[#050505] shadow-[0_0_40px_-8px_#ff6b3d] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              View projects
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight />
              </span>
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-[#ff6b3d] hover:text-[#ff9068] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b3d]"
            >
              Contact me
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/60">
            {LINKS.map((l, i) => (
              <li
                key={l.label}
                ref={(el) => {
                  linksRef.current[i] = el;
                }}
              >
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#ff6b3d] hover:text-[#ff9068]"
                >
                  {l.label}
                  <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* scroll cue */}
      <a
        ref={scrollRef}
        href="#skills"
        aria-label="Scroll down"
        className="absolute bottom-[150px] left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-[#ff6b3d] hover:bg-[#ff6b3d] md:flex"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 3v10M3.5 8.5L8 13l4.5-4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {/* MARQUEE (alag component) */}
    </div>
  );
};

export default HeroSection;
