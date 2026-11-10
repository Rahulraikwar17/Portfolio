import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PsychedelicText from "./PsychedelicText";

gsap.registerPlugin(ScrollTrigger);

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

const RING_UNIT = "Full Stack / Frontend / Backend / Creative / ";
const RING_TEXT = RING_UNIT.repeat(3);

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

const DotSphere = ({ ready }) => {
  const canvasRef = useRef(null);
  const progress = useRef({ p: 0 });


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = window.innerWidth < 768 ? 520 : 1000;
    const golden = Math.PI * (3 - Math.sqrt(5));

    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;

      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      const s = 1.8 + Math.random() * 1.6;

      return {
        tx: Math.cos(th) * r,
        ty: y,
        tz: Math.sin(th) * r,
        sx: Math.sin(b) * Math.cos(a) * s,
        sy: Math.cos(b) * s,
        sz: Math.sin(b) * Math.sin(a) * s,
        d: Math.random() * 0.45,
        accent: i % 9 === 0,
      };
    });

    let W = 0;
    let dpr = 1;
    let rotY = 0;
    let rotX = 0.35;
    let targetRotX = 0.35;
    let speed = reduce ? 0 : 0.0025;
    let targetSpeed = speed;
    let pointer = null; 
    let running = true;
    let raf;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width * dpr;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onMove = (e) => {
      if (reduce) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      targetSpeed = 0.0025 + nx * 0.006;
      targetRotX = 0.35 + ny * 0.6;

      const rect = canvas.getBoundingClientRect();
      const margin = 40;
      const inside =
        e.clientX > rect.left - margin &&
        e.clientX < rect.right + margin &&
        e.clientY > rect.top - margin &&
        e.clientY < rect.bottom + margin;

      pointer = inside
        ? { x: (e.clientX - rect.left) * dpr, y: (e.clientY - rect.top) * dpr }
        : null;
    };
    window.addEventListener("pointermove", onMove);

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!running || document.hidden) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      speed += (targetSpeed - speed) * 0.05;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += speed;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const R = W * 0.34;
      const reach = 110 * dpr;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const p = progress.current.p;

      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];

        const t = clamp((p - pt.d) / (1 - 0.45), 0, 1);
        const e = 1 - Math.pow(1 - t, 3);

        const x = pt.sx + (pt.tx - pt.sx) * e;
        const y = pt.sy + (pt.ty - pt.sy) * e;
        const z = pt.sz + (pt.tz - pt.sz) * e;

        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const persp = 5 / (5 - Math.min(z2, 2));
        let sx = cx + x1 * R * persp;
        let sy = cy + y2 * R * persp;

        const depth = clamp((z2 + 1) / 2, 0, 1);
        let size = (0.8 + depth * 1.7) * dpr;
        let alpha = (0.15 + depth * 0.85) * (0.25 + 0.75 * e);
        let glow = 0;

        if (pointer && e > 0.9) {
          const dx = sx - pointer.x;
          const dy = sy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < reach && dist > 0.001) {
            glow = Math.pow(1 - dist / reach, 2);
            sx += (dx / dist) * glow * 26 * dpr;
            sy += (dy / dist) * glow * 26 * dpr;
            size += glow * 2.4 * dpr;
          }
        }

        const orange = pt.accent || glow > 0.04;
        if (orange) {
          ctx.fillStyle = `rgba(255,107,61,${clamp(alpha + glow, 0, 1)})`;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`;
        }

        ctx.beginPath();
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progress.current.p = 1;
      return;
    }

    const tween = gsap.to(progress.current, {
      p: 1,
      duration: 2.8,
      delay: 0.3,
      ease: "power2.inOut",
    });

    return () => tween.kill();
  }, [ready]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
};

const Orb = ({ ready }) => (
  <div className="relative h-full w-full">
    <DotSphere ready={ready} />

    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full animate-spin motion-reduce:animate-none"
      style={{ animationDuration: "50s" }}
      aria-hidden="true"
    >
      <defs>
        <path
          id="hero-ring"
          d="M200,200 m-185,0 a185,185 0 1,1 370,0 a185,185 0 1,1 -370,0"
        />
      </defs>
      <text
        fill="rgba(255,255,255,0.5)"
        fontSize="12"
        className="font-mono"
        letterSpacing="1.2"
      >
        <textPath href="#hero-ring" textLength="1162" lengthAdjust="spacing">
          {RING_TEXT}
        </textPath>
      </text>
    </svg>
  </div>
);

const HeroSection = ({ ready = true }) => {
  const containerRef = useRef(null);
  const orbWrapRef = useRef(null);

  const nameRef = useRef([]);

  const roleRef = useRef(null);
  const badgeRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const linksRef = useRef([]);
  const scrollRef = useRef(null);
  const timelineRef = useRef(null);

  const isDesktop = useIsDesktop();

  const bottomSpace = isDesktop ? 104 : 28;


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

  // intro timeline
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

      gsap.set(nameRef.current, { yPercent: 115 });
      gsap.set(orbWrapRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(scrollRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(
        orbWrapRef.current,
        { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
        0.1,
      )
        .to(
          nameRef.current,
          { yPercent: 0, duration: 1.2, stagger: 0.05, ease: "expo.out" },
          0.1,
        )
        .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.15)
        .to(copyRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.8 }, 0.45)
        .to(
          linksRef.current,
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
          0.6,
        )
        .to(scrollRef.current, { opacity: 1, duration: 0.8 }, 0.9);

      timelineRef.current = tl;
    }, containerRef);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (ready) timelineRef.current?.play();
  }, [ready]);


  useLayoutEffect(() => {
    const about = document.querySelector("#about");
    const hero = containerRef.current;
    if (!about || !hero) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(hero, { transformOrigin: "50% 100%" });

      gsap.to(hero, {
        autoAlpha: 0,
        scale: 0.92,
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      hero.style.position = "relative";
      return () => {
        hero.style.position = "";
      };
    });

    return () => mm.revert();
  }, []);

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
      data-no-squeeze
      className="sticky top-0 z-0 h-[100svh] min-h-[560px] w-full overflow-hidden text-white will-change-transform md:min-h-[620px]"
    >
    
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[2%] top-[10%] h-[44svh] w-[70vw] rounded-full bg-[#ff6b3d]/20 blur-[110px] md:right-[4%] md:top-[18%] md:h-[60vh] md:w-[36vw] md:blur-[140px]"
      />

     
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 via-45% to-transparent md:hidden" />

      <section
        className="relative z-10 flex h-full items-end px-5 pt-16 sm:px-8 sm:pt-20 md:items-center md:px-10 lg:px-14"
        style={{
          paddingBottom: `calc(${bottomSpace}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <div className="w-full max-w-7xl md:mx-auto md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-12">
  
          <div className="relative z-10">
            <div
              ref={badgeRef}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur sm:mb-4 sm:px-3.5 sm:text-sm"
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

            <h1 className="text-[min(17vw,14svh)] font-medium leading-[0.86] tracking-tighter sm:text-[min(14vw,15svh)] md:text-[min(9vw,17svh)]">
              {renderName(NAME)}

              <span className="block overflow-visible pb-[0.08em]">
                <PsychedelicText
                  text="raikwar"
                  className="block"
                  strokeWidth={1.5}
                />
              </span>
            </h1>

            <div className="mt-3 flex items-center gap-3 text-base font-medium sm:mt-4 sm:text-lg md:mt-5 md:text-2xl">
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

            <p
              ref={copyRef}
              className="mt-4 hidden max-w-md text-base leading-relaxed text-white/70 md:block md:text-lg [@media(max-height:820px)]:hidden"
            >
              I build full-stack web apps, from interfaces that feel alive to
              the APIs and databases behind them.
            </p>

            <div
              ref={ctaRef}
              className="mt-5 flex w-full items-center gap-3 sm:mt-6 sm:max-w-md md:mt-7 md:w-auto md:max-w-none md:gap-4"
            >
              <a
                href="#projects"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ff6b3d] px-4 py-3 text-sm font-semibold text-[#050505] transition-transform duration-300 hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-5 sm:py-3.5 md:flex-none md:px-7"
              >
                View projects
                <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight />
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/25 bg-black/30 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition-colors duration-300 hover:border-[#ff6b3d] hover:text-[#ff9068] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b3d] sm:px-5 sm:py-3.5 md:flex-none md:px-7"
              >
                Contact me
              </a>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70 sm:mt-6 sm:gap-x-6 md:mt-7 md:gap-x-7 md:text-white/60">
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
          <div
            ref={orbWrapRef}
            className="pointer-events-none absolute -right-[14%] top-[64px] aspect-square w-[68vw] opacity-70 [-webkit-mask-image:linear-gradient(to_bottom,#000_50%,transparent)] [mask-image:linear-gradient(to_bottom,#000_50%,transparent)] sm:-right-[8%] sm:top-[80px] sm:w-[52vw] md:static md:ml-auto md:w-full md:max-w-[min(580px,64svh)] md:opacity-100 md:[-webkit-mask-image:none] md:[mask-image:none]"
          >
            <Orb ready={ready} />
          </div>
        </div>
      </section>

      <a
        ref={scrollRef}
        href="#skills"
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-[#ff6b3d] hover:bg-[#ff6b3d] md:flex"
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