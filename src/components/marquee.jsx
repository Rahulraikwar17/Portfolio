import React from "react";
import {
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

const Row = ({ items, direction, duration, durationMobile }) => {
  const group = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className={`skills-track flex w-max md:hover:[animation-play-state:paused] ${
          direction === "right" ? "to-right" : "to-left"
        }`}
        style={{
          "--dm": `${durationMobile}s`,
          "--dd": `${duration}s`,
        }}
      >
        {[0, 1].map((g) => (
          <ul key={g} className="flex shrink-0">
            {group.map(({ name, icon: Icon }, i) => (
              <li
                key={`${g}-${i}`}
                className="mx-1.5 flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-zinc-400 transition-colors duration-300 hover:text-[#FF6B3D] md:mx-0 md:gap-3 md:border-transparent md:bg-transparent md:px-10 md:py-0 md:text-zinc-500"
              >
                <Icon
                  strokeWidth={1.6}
                  className="h-[18px] w-[18px] shrink-0 md:h-[30px] md:w-[30px]"
                />
                <span className="whitespace-nowrap text-xs font-semibold tracking-[0.1em] md:text-sm md:tracking-[0.12em]">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};

const Marquee = () => (
  <section
    id="skills"
    className="relative overflow-hidden bg-transparent py-10 font-['Space_Grotesk',sans-serif] md:py-16"
  >
    <style>{`
      @keyframes skills-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
      @keyframes skills-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      .skills-track { animation-timing-function: linear; animation-iteration-count: infinite; animation-duration: var(--dm); }
      .skills-track.to-left  { animation-name: skills-left; }
      .skills-track.to-right { animation-name: skills-right; }
      .skills-fade {
        mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
      }
      @media (min-width: 768px) {
        .skills-track { animation-duration: var(--dd); }
        .skills-fade {
          mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
        }
      }
      @media (prefers-reduced-motion: reduce) { .skills-track { animation: none; } }
    `}</style>

    <div className="skills-fade relative z-10 flex flex-col gap-3 md:gap-10">
      <Row
        items={FRONTEND}
        direction="right"
        duration={60}
        durationMobile={34}
      />
      <Row
        items={BACKEND}
        direction="left"
        duration={60}
        durationMobile={42}
      />
    </div>
  </section>
);

export default Marquee;