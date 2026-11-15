import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaGitAlt,
  FaNodeJs,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiGreensock,
  SiExpress,
  SiMongodb,
} from "react-icons/si";

import {
  MousePointerClick,
  Hand,
  Atom,
  FileCode,
  Braces,
  Code,
  Palette,
  Wind,
  Sparkles,
  Zap,
  PenTool,
  Layers,
  Hexagon,
  Server,
  Leaf,
  Network,
  KeyRound,
  GitBranch,
  HardDrive,
  Send,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    id: 1,
    name: "HTML5",
    icon: FaHtml5,
    color: "#E34F26",
    level: "Strong",
    description:
      "Semantic and accessible HTML structure with clean, scalable markup.",
  },
  {
    id: 2,
    name: "CSS3",
    icon: FaCss3Alt,
    color: "#2D8CE0",
    level: "Strong",
    description:
      "Responsive layouts, modern UI, transitions and advanced CSS effects.",
  },
  {
    id: 3,
    name: "JavaScript",
    icon: FaJs,
    color: "#F7DF1E",
    level: "Strong",
    description:
      "Interactive frontend logic, APIs and modern ES6+ development.",
  },
  {
    id: 4,
    name: "React",
    icon: FaReact,
    color: "#61DAFB",
    level: "Advanced",
    description:
      "Component-based interfaces, hooks, routing, state and API integration.",
  },
  {
    id: 5,
    name: "GSAP",
    icon: SiGreensock,
    color: "#88CE02",
    level: "Intermediate",
    description:
      "Smooth UI animations, timelines, scroll effects and interactive motion.",
  },
  {
    id: 6,
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#38BDF8",
    level: "Strong",
    description: "Fast responsive UI development using utility-first styling.",
  },
  {
    id: 8,
    name: "Node.js",
    icon: FaNodeJs,
    color: "#68A063",
    level: "Intermediate",
    description:
      "Building backend servers, REST APIs and handling server-side logic with Node.js.",
  },
  {
    id: 9,
    name: "Express.js",
    icon: SiExpress,
    color: "#FFFFFF",
    level: "Intermediate",
    description:
      "Routing, middleware, authentication and clean API structure with Express.",
  },
  {
    id: 10,
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    level: "Intermediate",
    description:
      "NoSQL database design, schemas with Mongoose and CRUD operations for full-stack apps.",
  },
  {
    id: 7,
    name: "Git",
    icon: FaGitAlt,
    color: "#F05032",
    level: "Strong",
    description:
      "Version control, branching and maintaining frontend projects with Git.",
  },
];

const FRONTEND = [
  { name: "React", icon: Atom },
  { name: "TypeScript", icon: FileCode },
  { name: "JavaScript", icon: Braces },
  { name: "HTML", icon: Code },
  { name: "CSS", icon: Palette },
  { name: "Tailwind CSS", icon: Wind },
  { name: "Framer Motion", icon: Sparkles },
  { name: "GSAP", icon: Zap },
  { name: "UI Design", icon: PenTool },
  { name: "Redux", icon: Layers },
];

const BACKEND = [
  { name: "Node.js", icon: Hexagon },
  { name: "Express", icon: Server },
  { name: "MongoDB", icon: Leaf },
  { name: "REST APIs", icon: Network },
  { name: "JWT Auth", icon: KeyRound },
  { name: "Redis", icon: HardDrive },
  { name: "Git", icon: GitBranch },
  { name: "Postman", icon: Send },
];

const TAIL = 64; 
const HEAD = 14; 
const SPEED = 240; 
const CYCLE = 3.4; 
const BRANCH_R = 14;

const BASE_SIZE = 560;
const ORBIT_DURATION = 22;

const CONTAINER = "mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12";

const SECTION_GLOW =
  "radial-gradient(42% 38% at 50% 52%, rgba(57,255,136,0.13), transparent 70%), radial-gradient(70% 50% at 50% 55%, rgba(11,26,16,0.9), transparent 75%)";

const OUTLINE_STYLE = {
  color: "transparent",
  WebkitTextStroke: "max(1px, 0.012em) #39ff88",
};

const ICON_IDLE = "#d6ffe6";
const CHIP_ICON_IDLE = "rgba(214,255,230,0.8)";

const NODE_IDLE = {
  borderColor: "rgba(109,143,99,0.6)",
  backgroundColor: "rgba(11,26,16,0.9)",
};
const NODE_ACTIVE = {
  borderColor: "#39ff88",
  backgroundColor: "rgba(57,255,136,0.12)",
};

const PULSE_GLOW = { filter: "drop-shadow(0 0 4px rgba(57,255,136,0.85))" };

const getOrbitSize = () => {
  if (typeof window === "undefined") return BASE_SIZE;

  const byWidth = window.innerWidth - 24;
  const byHeight = window.innerHeight - 230;

  return Math.max(280, Math.min(BASE_SIZE, byWidth, byHeight));
};

const SkillTree = ({ title, items, side = "left", startDelay = 0 }) => {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const nodeRef = useRef(null);
  const baseSvgRef = useRef(null);
  const pulseSvgRef = useRef(null);

  const chipRefs = useRef([]);
  const flashRefs = useRef([]);
  const iconRefs = useRef([]);
  const dotRefs = useRef([]);
  const tailRefs = useRef([]);
  const headRefs = useRef([]);

  const [geo, setGeo] = useState(null);
  const isRight = side === "right";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const node = nodeRef.current;
      const chips = chipRefs.current.filter(Boolean);
      if (!node || chips.length !== items.length) return;

      const x0 = node.offsetLeft + node.offsetWidth / 2;
      const y0 = node.offsetTop + node.offsetHeight;

      const branches = chips.map((el) => {
        const cy = el.offsetTop + el.offsetHeight / 2;
        const left = el.offsetLeft;
        const toRight = left + el.offsetWidth / 2 > x0;
        const x1 = toRight ? left : left + el.offsetWidth;
        const dir = toRight ? 1 : -1;
        const r = Math.max(2, Math.min(BRANCH_R, Math.abs(x1 - x0), cy - y0));
        return { cy, x1, dir, r };
      });

      const last = branches[branches.length - 1];

      setGeo({
        w: root.offsetWidth,
        h: root.offsetHeight,
        trunk: `M${x0} ${y0} V${last.cy - last.r}`,
        paths: branches.map((b) => ({
          full: `M${x0} ${y0} V${b.cy - b.r} Q${x0} ${b.cy} ${x0 + b.dir * b.r} ${b.cy} H${b.x1}`,
          branch: `M${x0} ${b.cy - b.r} Q${x0} ${b.cy} ${x0 + b.dir * b.r} ${b.cy} H${b.x1}`,
          x: b.x1,
          y: b.cy,
        })),
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [items.length]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
          defaults: { ease: "power3.out" },
        })
        .from(headerRef.current, { opacity: 0, y: 12, duration: 0.7 })
        .from(
          chipRefs.current.filter(Boolean),
          { opacity: 0, y: 14, duration: 0.6, stagger: 0.07 },
          0.2,
        )
        .from(
          [baseSvgRef.current, pulseSvgRef.current],
          { opacity: 0, duration: 1.2 },
          0.3,
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!geo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tls = [];

    const ctx = gsap.context(() => {
      geo.paths.forEach((_, i) => {
        const tail = tailRefs.current[i];
        const head = headRefs.current[i];
        if (!tail || !head) return;

        const L = tail.getTotalLength();
        const gap = L + TAIL + 10;

        tail.style.strokeDasharray = `${TAIL} ${gap}`;
        head.style.strokeDasharray = `${HEAD} ${gap}`;

        const dur = (L + TAIL) / SPEED;
        const arrive = L / SPEED;
        const on = Math.max(0, arrive - 0.08);

        const tl = gsap.timeline({
          repeat: -1,
          paused: true,
          delay: 1.2 + startDelay,
        });

        tl.fromTo(
          tail,
          { strokeDashoffset: TAIL },
          { strokeDashoffset: -L, duration: dur, ease: "none" },
          0,
        ).fromTo(
          head,
          { strokeDashoffset: HEAD },
          { strokeDashoffset: HEAD - TAIL - L, duration: dur, ease: "none" },
          0,
        );

        tl.to(flashRefs.current[i], { opacity: 1, duration: 0.15 }, on)
          .to(
            flashRefs.current[i],
            { opacity: 0, duration: 0.9, ease: "power2.out" },
            on + 0.2,
          )
          .to(iconRefs.current[i], { color: "#39ff88", duration: 0.15 }, on)
          .to(
            iconRefs.current[i],
            { color: CHIP_ICON_IDLE, duration: 0.9, ease: "power2.out" },
            on + 0.2,
          )
          .to(dotRefs.current[i], { fill: "#39ff88", duration: 0.15 }, on)
          .to(
            dotRefs.current[i],
            { fill: "#0b1a10", duration: 0.9, ease: "power2.out" },
            on + 0.2,
          );

        tl.repeatDelay(Math.max(0.3, CYCLE - tl.duration()));
        tls.push(tl);
      });
    }, rootRef);

    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          tls.forEach((tl) => (entry.isIntersecting ? tl.play() : tl.pause()));
        },
        { rootMargin: "80px" },
      );
      io.observe(rootRef.current);
    } else {
      tls.forEach((tl) => tl.play());
    }

    return () => {
      if (io) io.disconnect();
      ctx.revert();
    };
  }, [geo, startDelay]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${isRight ? "xl:text-right" : ""}`}
    >
      <svg
        ref={baseSvgRef}
        aria-hidden="true"
        width={geo ? geo.w : 0}
        height={geo ? geo.h : 0}
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
      >
        {geo && (
          <g fill="none" stroke="rgba(109,143,99,0.38)" strokeWidth="1.5">
            <path d={geo.trunk} />
            {geo.paths.map((p, i) => (
              <path key={i} d={p.branch} />
            ))}
          </g>
        )}
        {geo &&
          geo.paths.map((p, i) => (
            <circle
              key={`dot-${i}`}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#0b1a10"
              stroke="#6d8f63"
              strokeWidth="1.2"
            />
          ))}
      </svg>

      <svg
        ref={pulseSvgRef}
        aria-hidden="true"
        width={geo ? geo.w : 0}
        height={geo ? geo.h : 0}
        className="pointer-events-none absolute left-0 top-0 overflow-visible"
        style={PULSE_GLOW}
      >
        {geo &&
          geo.paths.map((p, i) => (
            <g key={i} fill="none" strokeLinecap="round">
              <path
                ref={(el) => {
                  tailRefs.current[i] = el;
                }}
                d={p.full}
                stroke="rgba(57,255,136,0.4)"
                strokeWidth="2"
                style={{ strokeDasharray: `0 9999` }}
              />
              <path
                ref={(el) => {
                  headRefs.current[i] = el;
                }}
                d={p.full}
                stroke="#eafff2"
                strokeWidth="2.4"
                style={{ strokeDasharray: `0 9999` }}
              />
            </g>
          ))}
      </svg>

      <div
        ref={headerRef}
        className={`flex items-center gap-3 ${isRight ? "xl:flex-row-reverse" : ""}`}
      >
        <span
          ref={nodeRef}
          className="relative flex h-3 w-3 shrink-0 items-center justify-center"
        >
          <span className="absolute inset-0 rotate-45 bg-[#39ff88] shadow-[0_0_14px_#39ff88]" />
          <span className="absolute -inset-1 rotate-45 border border-[#39ff88]/50 motion-safe:animate-ping" />
        </span>

        <h3 className="lemonmilk-font text-lg font-medium uppercase leading-none tracking-tight text-[#d6ffe6] sm:text-xl">
          {title}
        </h3>
      </div>

      {/* skills */}
      <ul
        aria-label={`${title} skills`}
        className={`mt-5 flex flex-col gap-2.5 pl-8 ${
          isRight ? "xl:pl-0 xl:pr-8" : ""
        }`}
      >
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <div
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                className={`relative flex h-10 w-full max-w-[19rem] items-center gap-3 rounded-[10px] border border-[#6d8f63]/35 bg-[#0b1a10]/70 px-2.5 backdrop-blur-sm transition-colors duration-300 hover:border-[#39ff88]/60 hover:bg-[#39ff88]/10 ${
                  isRight ? "xl:ml-auto" : ""
                }`}
              >
                <span
                  ref={(el) => {
                    flashRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[10px] border border-[#39ff88] opacity-0 shadow-[0_0_18px_rgba(57,255,136,0.45)]"
                />

                <span
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#39ff88]/10 text-[#d6ffe6]/80"
                >
                  <Icon size={15} strokeWidth={1.8} />
                </span>

                <span className="truncate text-sm font-medium text-[#d6ffe6]">
                  {item.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);
  const ringRef = useRef(null);
  const centerRef = useRef(null);
  const detailRef = useRef(null);
  const skillRefs = useRef([]);

  const orbitTween = useRef(null);
  const innerTweens = useRef([]);
  const activeRef = useRef(null);
  const lastPointer = useRef("mouse");

  const [activeSkill, setActiveSkill] = useState(null);
  const [size, setSize] = useState(getOrbitSize);
  const [isTouch, setIsTouch] = useState(false);

  const s = size / BASE_SIZE;
  const radius = 210 * s;
  const nodeSize = Math.max(54, 76 * s);
  const circleSize = nodeSize - 6;
  const iconSize = Math.max(22, 28 * s);

  const outerRing = radius * 2;
  const innerRing = 270 * s;
  const centerSize = Math.max(86, 118 * s);
  const centerText = Math.max(20, 36 * s);
  const cardWidth = Math.max(170, 230 * s);

  useEffect(() => {
    const handleResize = () => setSize(getOrbitSize());

    setIsTouch(window.matchMedia("(hover: none)").matches);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current, { opacity: 0 });

      gsap.set([centerRef.current, ringRef.current, ...skillRefs.current], {
        opacity: 0,
        scale: 0.7,
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });

      intro.to(sectionRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });

      intro.to(
        ringRef.current,
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.4",
      );

      intro.to(
        centerRef.current,
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.7",
      );

      intro.to(
        skillRefs.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.5)",
        },
        "-=0.5",
      );

      orbitTween.current = gsap.to(orbitRef.current, {
        rotation: 360,
        duration: ORBIT_DURATION,
        repeat: -1,
        ease: "none",
      });

      innerTweens.current = skillRefs.current.filter(Boolean).map((el) =>
        gsap.to(el.querySelector(".skill-inner"), {
          rotation: -360,
          duration: ORBIT_DURATION,
          repeat: -1,
          ease: "none",
        }),
      );

      gsap.to(centerRef.current, {
        scale: 1.04,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const resetVisuals = () => {
    skillRefs.current.forEach((el) => {
      if (!el) return;

      gsap.to(el, { scale: 1, duration: 0.35, ease: "power2.out" });

      gsap.to(el.querySelector(".skill-circle"), {
        ...NODE_IDLE,
        duration: 0.3,
      });

      gsap.to(el.querySelector(".skill-icon"), {
        color: ICON_IDLE,
        duration: 0.3,
      });
    });
  };

  const setOrbitSpeed = (speed, duration) => {
    if (orbitTween.current) {
      gsap.to(orbitTween.current, { timeScale: speed, duration });
    }

    innerTweens.current.forEach((tween) => {
      gsap.to(tween, { timeScale: speed, duration });
    });
  };

  const handleSkillEnter = (skill) => {
    resetVisuals();

    activeRef.current = skill;
    setActiveSkill(skill);

    setOrbitSpeed(0, 0.4);

    const index = skills.findIndex((item) => item.id === skill.id);
    const currentSkill = skillRefs.current[index];

    if (!currentSkill) return;

    gsap.to(currentSkill, {
      scale: 1.15,
      duration: 0.4,
      ease: "back.out(2)",
      overwrite: "auto",
    });

    gsap.to(currentSkill.querySelector(".skill-circle"), {
      ...NODE_ACTIVE,
      duration: 0.3,
    });

    gsap.to(currentSkill.querySelector(".skill-icon"), {
      color: skill.color,
      duration: 0.3,
    });

    gsap.fromTo(
      detailRef.current,
      { opacity: 0, y: 15, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
    );
  };

  const handleSkillLeave = () => {
    activeRef.current = null;
    setActiveSkill(null);

    resetVisuals();

    gsap.to(detailRef.current, {
      opacity: 0,
      y: 10,
      scale: 0.97,
      duration: 0.25,
      ease: "power2.in",
    });

    setOrbitSpeed(1, 0.6);
  };

  const handlePointerEnter = (event, skill) => {
    if (event.pointerType === "mouse") handleSkillEnter(skill);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === "mouse") handleSkillLeave();
  };

  const handleClick = (event, skill) => {
    event.stopPropagation();

    if (lastPointer.current === "mouse") return;

    if (activeRef.current?.id === skill.id) handleSkillLeave();
    else handleSkillEnter(skill);
  };

  const handleSectionClick = () => {
    if (activeRef.current) handleSkillLeave();
  };

  return (
    <section
      ref={sectionRef}
      onClick={handleSectionClick}
      id="skills"
      className="relative w-full overflow-hidden py-20 text-[#d6ffe6] md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: SECTION_GLOW }}
      />

      <div className={`relative z-10 ${CONTAINER}`}>
        <h2 className="lemonmilk-font text-[12vw] font-medium leading-[0.95] tracking-[-0.02em] sm:text-[8vw] lg:text-[5.5rem]">
          <span className="block">What I</span>
          <span className="block" style={OUTLINE_STYLE}>
            work with
          </span>
        </h2>

        <p className="mt-5 flex items-center gap-2 font-mono text-xs text-[#d6ffe6]/60">
          {isTouch ? (
            <Hand className="h-3.5 w-3.5" strokeWidth={1.5} />
          ) : (
            <MousePointerClick className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
          {isTouch ? "Tap a skill to explore" : "Hover a skill to explore"}
        </p>
      </div>

      <div className={`relative z-10 mt-8 md:mt-4 ${CONTAINER}`}>
        <div className="grid items-center gap-14 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-10">
          {/* orbit */}
          <div className="order-1 flex justify-center xl:order-2">
            <div className="relative" style={{ width: size, height: size }}>
              <div
                ref={ringRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6d8f63]/45"
                style={{ width: outerRing, height: outerRing }}
              />

              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#6d8f63]/35"
                style={{ width: innerRing, height: innerRing }}
              />

              <div ref={orbitRef} className="absolute inset-0 rounded-full">
                {skills.map((skill, index) => {
                  const angle = (index / skills.length) * Math.PI * 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const Icon = skill.icon;

                  return (
                    <div
                      key={skill.id}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px - ${nodeSize / 2}px)`,
                        top: `calc(50% + ${y}px - ${nodeSize / 2}px)`,
                        width: nodeSize,
                        height: nodeSize,
                      }}
                    >
                      <div
                        ref={(el) => {
                          skillRefs.current[index] = el;
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={skill.name}
                        onPointerDown={(e) => {
                          lastPointer.current = e.pointerType;
                        }}
                        onPointerEnter={(e) => handlePointerEnter(e, skill)}
                        onPointerLeave={handlePointerLeave}
                        onClick={(e) => handleClick(e, skill)}
                        onFocus={(e) => {
                          if (e.currentTarget.matches(":focus-visible")) {
                            handleSkillEnter(skill);
                          }
                        }}
                        onBlur={handleSkillLeave}
                        className="h-full w-full cursor-pointer outline-none"
                      >
                        <div className="skill-inner flex h-full w-full items-center justify-center">
                          <div
                            className="skill-circle flex items-center justify-center rounded-full border border-[#6d8f63]/60 bg-[#0b1a10]/90"
                            style={{ width: circleSize, height: circleSize }}
                          >
                            <Icon
                              className="skill-icon text-[#d6ffe6]"
                              style={{ width: iconSize, height: iconSize }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                ref={centerRef}
                className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#39ff88] text-black"
                style={{
                  width: centerSize,
                  height: centerSize,
                  boxShadow: "0 0 56px rgba(57,255,136,0.4)",
                }}
              >
                <span
                  className="font-black tracking-[-0.08em]"
                  style={{ fontSize: centerText }}
                >
                  Skills
                </span>
              </div>

              <div
                ref={detailRef}
                className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 opacity-0"
                style={{ width: cardWidth }}
              >
                {activeSkill && (
                  <div className="rounded-2xl border border-[#39ff88]/50 bg-[#050d08]/95 p-4 text-center backdrop-blur-xl md:p-5">
                    <h3 className="text-lg font-medium text-[#d6ffe6] md:text-xl">
                      {activeSkill.name}
                    </h3>

                    <p className="mt-1 font-mono text-xs text-[#39ff88]">
                      {activeSkill.level}
                    </p>

                    <div className="mx-auto my-3 h-px w-12 bg-[#6d8f63]/50 md:my-4" />

                    <p className="text-xs leading-relaxed text-[#d6ffe6]/70">
                      {activeSkill.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

         
          <div className="order-2 grid gap-12 md:grid-cols-2 md:gap-10 xl:contents">
            <div className="mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none xl:order-1 xl:max-w-[22rem] xl:justify-self-start">
              <SkillTree title="Frontend" items={FRONTEND} side="left" />
            </div>

            <div className="mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none xl:order-3 xl:max-w-[22rem] xl:justify-self-end">
              <SkillTree
                title="Backend & Tools"
                items={BACKEND}
                side="right"
                startDelay={0.5}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;