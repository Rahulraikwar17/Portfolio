import React from "react";
import {
  Atom,
  Smartphone,
  Triangle,
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
  Database,
  Leaf,
  Network,
  Workflow,
  Flame,
  KeyRound,
  Container,
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

const Row = ({ items, direction, duration }) => {
  const group = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`skills-track flex w-max hover:[animation-play-state:paused] ${direction === "right" ? "to-right" : "to-left"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((g) => (
          <ul key={g} className="flex shrink-0">
            {group.map(({ name, icon: Icon }, i) => (
              <li
                key={`${g}-${i}`}
                className="flex cursor-default items-center gap-3 px-10 text-zinc-500 transition-colors duration-300 hover:text-[#FF6B3D]"
              >
                <Icon size={30} strokeWidth={1.6} />
                <span className="whitespace-nowrap text-sm font-semibold tracking-[0.12em]">
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

const SkillsMarquee = () => (
  <section
    id="skills"
    className="flex flex-col gap-10 bg-[#050505] py-16 font-['Space_Grotesk',sans-serif]"
    style={{
      maskImage:
        "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
    }}
  >
    <style>{`
      @keyframes skills-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
      @keyframes skills-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
      .skills-track { animation-timing-function: linear; animation-iteration-count: infinite; }
      .skills-track.to-left  { animation-name: skills-left; }
      .skills-track.to-right { animation-name: skills-right; }
      @media (prefers-reduced-motion: reduce) { .skills-track { animation: none; } }
    `}</style>

    <Row items={FRONTEND} direction="right" duration={60} />
    <Row items={BACKEND} direction="left" duration={60} />
  </section>
);

export default SkillsMarquee;
