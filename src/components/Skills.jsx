import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";


import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaGitAlt,
  FaNodeJs,
} from "react-icons/fa";
import { SiTailwindcss, SiGreensock, SiExpress, SiMongodb } from "react-icons/si";


import { MousePointerClick, Hand } from "lucide-react";

import LiquidText from "./LiquidText";

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

const BASE_SIZE = 560;
const ORBIT_DURATION = 22;


const getOrbitSize = () => {
  if (typeof window === "undefined") return BASE_SIZE;

  const byWidth = window.innerWidth - 24;
  const byHeight = window.innerHeight - 230;


  return Math.max(280, Math.min(BASE_SIZE, byWidth, byHeight));
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

      const intro = gsap.timeline();

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

      innerTweens.current = skillRefs.current
        .filter(Boolean)
        .map((el) =>
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
        borderColor: "rgba(255,255,255,0.12)",
        backgroundColor: "rgba(255,255,255,0.025)",
        duration: 0.3,
      });

      gsap.to(el.querySelector(".skill-icon"), {
        color: "rgba(255,255,255,0.6)",
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
      borderColor: "rgba(255,255,255,0.6)",
      backgroundColor: "rgba(255,255,255,0.08)",
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
      className="relative w-full overflow-hidden bg-[#090909] text-white"
      style={{ minHeight: `max(100svh, ${size + 260}px)` }}
    >
      <div className="relative z-20 px-4 pt-20 text-center md:pt-24">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/35 md:tracking-[0.5em]">
          What I Work With
        </p>
      </div>


      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: size, height: size }}
      >
      
        <div
          ref={ringRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
          style={{ width: outerRing, height: outerRing }}
        />

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08]"
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
                      className="skill-circle flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.025] backdrop-blur-sm"
                      style={{ width: circleSize, height: circleSize }}
                    >
                      <Icon
                        className="skill-icon text-white/60"
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
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF6B3D] text-black"
          style={{ width: centerSize, height: centerSize }}
        >
          <LiquidText>
            <span
              className="font-black tracking-[-0.08em]"
              style={{ fontSize: centerText }}
            >
              Skills
            </span>
          </LiquidText>
        </div>

     
        <div
          ref={detailRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{ width: cardWidth }}
        >
          {activeSkill && (
            <div className="rounded-2xl border border-white/10 bg-black/90 p-4 text-center shadow-2xl backdrop-blur-xl md:p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                Skill
              </p>

              <h3 className="mt-2 text-lg font-medium md:text-xl">
                {activeSkill.name}
              </h3>

              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                {activeSkill.level}
              </p>

              <div className="mx-auto my-3 h-px w-12 bg-white/10 md:my-4" />

              <p className="text-[11px] leading-relaxed text-white/50 md:text-xs">
                {activeSkill.description}
              </p>
            </div>
          )}
        </div>
      </div>


      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/30 md:bottom-10 md:tracking-[0.35em]">
        {isTouch ? (
          <Hand className="h-3.5 w-3.5" strokeWidth={1.5} />
        ) : (
          <MousePointerClick className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
        {isTouch ? "Tap a skill to explore" : "Hover a skill to explore"}
      </div>
    </section>
  );
};

export default Skills;