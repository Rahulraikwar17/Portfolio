import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LiquidText from "./LiquidText";

import project1 from "../assets/images/project1.png";
import project2 from "../assets/images/project2.png";
import project3 from "../assets/images/project3.png";

const projects = [
  {
    id: 1,
    title: "E-Commerce",
    image: project1,
    skills: "React, Node.js, MongoDB",
    link: "https://reva-ecom.vercel.app/",
  },
  {
    id: 2,
    title: "Fin Track Pro",
    image: project2,
    skills: "Html, CSS, JavaScript",
    link: "https://fin-track-pro-dun.vercel.app/",
  },
  {
    id: 3,
    title: "Production Hub",
    image: project3,
    skills: "React",
    link: "https://productive-hub-nine.vercel.app/",
  },
];

const getRelativePosition = (index, active) => {
  let position = index - active;
  const total = projects.length;

  if (position > total / 2) position -= total;
  if (position < -total / 2) position += total;

  return position;
};

const getSpread = () => (window.innerWidth >= 768 ? 440 : 190);

const getPosition = (position) => {
  const spread = getSpread();

  if (position === 0) {
    return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 10 };
  }

  if (position === -1) {
    return { x: -spread, y: 30, scale: 0.74, opacity: 0.55, zIndex: 5 };
  }

  if (position === 1) {
    return { x: spread, y: 30, scale: 0.74, opacity: 0.55, zIndex: 5 };
  }

  return { x: 0, y: 100, scale: 0.5, opacity: 0, zIndex: 0 };
};

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const busyRef = useRef(false);
  const activeRef = useRef(1);
  const touchStartX = useRef(null);

  const animateCards = (newIndex, duration = 0.7) => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const position = getRelativePosition(index, newIndex);

      gsap.to(card, {
        ...getPosition(position),
        duration,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });
  };

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    animateCards(activeRef.current, 0);

    const handleResize = () => animateCards(activeRef.current, 0);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeProject = (index) => {
    if (index === activeRef.current || busyRef.current) return;

    busyRef.current = true;

    animateCards(index);

    gsap.to([titleRef.current, infoRef.current], {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        setActiveIndex(index);

        gsap.to([titleRef.current, infoRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: "power3.out",
          onComplete: () => {
            busyRef.current = false;
          },
        });
      },
    });
  };

  const nextProject = () => {
    changeProject((activeRef.current + 1) % projects.length);
  };

  const previousProject = () => {
    changeProject(
      (activeRef.current - 1 + projects.length) % projects.length
    );
  };


  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "ArrowRight") nextProject();
      if (event.key === "ArrowLeft") previousProject();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

 
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const diff = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(diff) < 50) return;
    if (diff < 0) nextProject();
    else previousProject();
  };

  const activeProject = projects[activeIndex];

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#090807] text-white"
      id="projects"
    >
   
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm transition-all duration-700"
          style={{ backgroundImage: `url(${activeProject.image})` }}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center">
   
        <div className="absolute top-[9%] z-30 text-center">
          <p className="mb-2 text-[11px] uppercase tracking-[0.45em] text-white/50">
            Projects
          </p>

          <LiquidText>
            <h1
              ref={titleRef}
              className="text-4xl font-semibold tracking-tight transition-colors duration-300 hover:text-[#FF6B3D] md:text-5xl"
            >
              {activeProject.title}
            </h1>
          </LiquidText>
        </div>

   
        <div
          className="absolute left-1/2 top-[50%] h-[400px] w-full -translate-x-1/2 -translate-y-1/2 overflow-visible"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {projects.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={project.id}
                ref={(element) => {
                  cardsRef.current[index] = element;
                }}
                onClick={() => changeProject(index)}
                className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:w-[380px] md:w-[540px]"
              >
             
                <div
                  className={`overflow-hidden rounded-xl border bg-[#14110f] shadow-2xl shadow-black/60 transition-colors duration-500 ${
                    isActive ? "border-white/25" : "border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                  </div>

                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      draggable="false"
                      className="block h-auto w-full select-none"
                    />

                    {!isActive && (
                      <div className="absolute inset-0 bg-black/45" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            aria-label="Previous project"
            onClick={previousProject}
            className="absolute left-[3%] top-1/2 z-40 -translate-y-1/2 text-4xl font-light transition-all duration-300 hover:scale-125 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next project"
            onClick={nextProject}
            className="absolute right-[3%] top-1/2 z-40 -translate-y-1/2 text-4xl font-light transition-all duration-300 hover:scale-125 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
          >
            ›
          </button>
        </div>


        <div
          ref={infoRef}
          className="absolute bottom-[7%] left-1/2 z-30 flex w-[575px] max-w-[90%] -translate-x-1/2 items-end border-t border-white/20 pt-5"
        >
          <div className="w-[200px]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Main Skills
            </p>

            <p className="mt-2 text-sm font-semibold">{activeProject.skills}</p>
          </div>

          <div className="w-[100px]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
              Index
            </p>

            <p className="mt-2 text-sm font-semibold">
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(projects.length).padStart(2, "0")}
            </p>
          </div>

          <a
            href={activeProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto whitespace-nowrap rounded-full border border-white/30 px-6 py-3 font-mono text-[11px] tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
          >
            VIEW PROJECT
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;