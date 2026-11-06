import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import PsychedelicText from "./PsychedelicText";
import StarField from "./StarField.jsx";

const IMAGE_SRC = "/me2.png";
const NAME = "Rahul";

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

const mask = (gradient) => ({
  maskImage: gradient,
  WebkitMaskImage: gradient,
});

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e) => setIsDesktop(e.matches);

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
};

const HeroSection = ({ ready = true }) => {
  const containerRef = useRef(null);
  const photoShiftRef = useRef(null);

  const nameRef = useRef([]);
  const surnameRef = useRef([]);

  const roleRef = useRef(null);
  const badgeRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const linksRef = useRef([]);
  const scrollRef = useRef(null);
  const timelineRef = useRef(null);

  const isDesktop = useIsDesktop();

  const bottomSpace = isDesktop ? 150 : 110;

  const horizontalMask = isDesktop
    ? "linear-gradient(to right, transparent 0%, #000 30%, #000 82%, transparent 100%)"
    : "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)";

  const verticalMask = isDesktop
    ? "linear-gradient(to bottom, transparent 0%, #000 10%, #000 86%, transparent 100%)"
    : "linear-gradient(to bottom, transparent 0%, #000 10%, #000 60%, transparent 100%)";

  // Role switching animation
  useEffect(() => {
    if (!ready) return;

    let i = 0;
    let swap;

    const id = setInterval(() => {
      if (!roleRef.current) return;

      i = (i + 1) % ROLES.length;

      swap = gsap
        .timeline()
        .to(roleRef.current, {
          yPercent: -110,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .add(() => {
          if (roleRef.current) {
            roleRef.current.textContent = ROLES[i];
          }
        })
        .fromTo(
          roleRef.current,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          },
        );
    }, 2600);

    return () => {
      clearInterval(id);
      swap?.kill();
    };
  }, [ready]);

  // Main entrance animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          badgeRef.current,
          copyRef.current,
          ctaRef.current,
          ...linksRef.current,
        ],
        { y: 20, opacity: 0 },
      );

      gsap.set([...nameRef.current, ...surnameRef.current], { yPercent: 115 });

      gsap.set(photoShiftRef.current, {
        scale: 1.08,
        opacity: 0,
      });

      gsap.set(scrollRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(photoShiftRef.current, {
        scale: 1.02,
        opacity: 1,
        duration: 1.6,
        ease: "power2.out",
      })
        .to(
          nameRef.current,
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.1,
        )
        .to(
          surnameRef.current,
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.25,
        )
        .to(
          badgeRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          0.15,
        )
        .to(
          copyRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          0.3,
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
          },
          0.45,
        )
        .to(
          linksRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
          },
          0.6,
        )
        .to(
          scrollRef.current,
          {
            opacity: 1,
            duration: 0.8,
          },
          0.9,
        );

      timelineRef.current = tl;
    }, containerRef);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  // Start animation after loader
  useEffect(() => {
    if (ready) timelineRef.current?.play();
  }, [ready]);

  // Render individual letters for Rahul
  const renderName = (word) => (
    <span className="block overflow-hidden pb-[0.08em] lemonmilk-font">
      {word.split("").map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            nameRef.current[index] = el;
          }}
          className="inline-block will-change-transform"
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
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden bg-[#050505] text-white md:min-h-[620px]"
    >
      <StarField seed={33} count={260} />
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#ff6b3d 1px, transparent 1px), linear-gradient(90deg, #ff6b3d 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          ...mask(
            "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent)",
          ),
        }}
      />

      {/* Orange glow */}
      <div className="pointer-events-none absolute right-[6%] top-[18%] hidden h-[55vh] w-[38vw] rounded-full bg-[#ff6b3d]/20 blur-[130px] md:block" />

      {/* Profile image */}
      <div className="absolute inset-x-0 top-0 h-[62svh] pt-20 md:inset-x-auto md:bottom-[30px] md:right-[10vw] md:h-auto md:pt-0">
        <div className="h-full" style={mask(horizontalMask)}>
          <div className="h-full" style={mask(verticalMask)}>
            <div className="relative h-full">
              <div
                ref={photoShiftRef}
                className="relative h-full will-change-transform"
              >
                <img
                  src={IMAGE_SRC}
                  alt="Rahul Raikwar"
                  draggable={false}
                  className="block h-full w-full max-w-none object-cover object-top md:w-auto md:object-fill"
                  style={{
                    filter: isDesktop
                      ? "grayscale(1) contrast(1.08) brightness(0.92)"
                      : "grayscale(1) contrast(1.1) brightness(1.05)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 via-45% to-transparent md:hidden" />

      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent md:block" />

      {/* Main content */}
      <section
        className="relative z-10 flex h-full items-end px-5 pt-20 md:items-center md:px-10"
        style={{ paddingBottom: bottomSpace }}
      >
        <div className="w-full max-w-7xl">
          {/* Availability */}
          <div
            ref={badgeRef}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/80 backdrop-blur sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b3d] opacity-80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b3d]" />
            </span>

            <span className="sm:hidden">Available for work</span>

            <span className="hidden sm:inline">
              Available for freelance and full-time roles
            </span>
          </div>

          {/* Name */}
          <h1 className="text-[min(16vw,15svh)] font-medium leading-[0.86] tracking-tighter md:text-[min(10.5vw,17svh)]">
            {renderName(NAME)}

            <span className="block overflow-visible pb-[0.08em]">
              <PsychedelicText
                text="raikwar"
                className="block"
                strokeWidth={1.5}
              />
            </span>
          </h1>

          {/* Role */}
          <div className="mt-4 flex items-center gap-3 text-lg font-medium md:mt-5 md:text-2xl">
            <span className="h-px w-8 bg-[#ff6b3d] md:w-10" />

            <span className="inline-block h-[1.4em] overflow-hidden leading-[1.4]">
              <span
                ref={roleRef}
                className="inline-block text-[#f96f45] will-change-transform"
              >
                {ROLES[0]}
              </span>
            </span>
          </div>

          {/* Description */}
          <p
            ref={copyRef}
            className="mt-4 hidden max-w-md text-base leading-relaxed text-white/70 md:block md:text-lg [@media(max-height:820px)]:hidden"
          >
            I build full-stack web apps, from interfaces that feel alive to the
            APIs and databases behind them.
          </p>

          {/* Buttons */}
          <div
            ref={ctaRef}
            className="mt-6 flex w-full items-center gap-3 md:mt-7 md:w-auto md:gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ff6b3d] px-5 py-3.5 text-sm font-semibold text-[#050505] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex-none md:px-7"
            >
              View projects
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <ArrowUpRight />
              </span>
            </a>

            <a
              href="#contact"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-white/25 bg-black/30 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors duration-300 hover:border-[#ff6b3d] hover:text-[#ff9068] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b3d] md:flex-none md:px-7"
            >
              Contact me
            </a>
          </div>

          {/* Social links */}
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70 md:mt-7 md:gap-x-7 md:text-white/60">
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

      {/* Scroll indicator */}
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
    </div>
  );
};

export default HeroSection;
