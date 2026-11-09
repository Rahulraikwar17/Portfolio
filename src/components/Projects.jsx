import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import project1 from "../assets/images/project1.png";
import project2 from "../assets/images/project2.png";
import project3 from "../assets/images/project3.png";
import PsychedelicText from "./PsychedelicText.jsx";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: "E-Commerce",
    image: project1,
    skills: "React, Node.js, MongoDB",
    description:
      "A full stack online store with product listings, a working cart and a Node.js and MongoDB backend behind it.",
    link: "https://reva-ecom.vercel.app/",
  },
  {
    id: 2,
    title: "Fin Track Pro",
    image: project2,
    skills: "Html, CSS, JavaScript",
    description:
      "A finance tracker to log income and expenses and see clearly where your money goes every month.",
    link: "https://fin-track-pro-dun.vercel.app/",
  },
  {
    id: 3,
    title: "Production Hub",
    image: project3,
    skills: "Html, CSS, JavaScript",
    description:
      "A productivity hub that keeps your tasks and focus time together in one simple, clean workspace.",
    link: "https://productive-hub-nine.vercel.app/",
  },
];

const GRID_LEFT = "md:grid-cols-[1.2fr_0.8fr]";
const GRID_RIGHT = "md:grid-cols-[0.8fr_1.2fr]";

const movePill = (event) => {
  const pill = event.currentTarget.querySelector("[data-pill]");
  if (!pill) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  pill.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
};

const Projects = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const articles = sectionRef.current.querySelectorAll("[data-project]");

      gsap.to("[data-heading]", {
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: articles[0],
          start: "top 85%",
          end: "top 30%",
          scrub: true,
        },
      });

      articles.forEach((article) => {
        const title = article.querySelector("[data-title]");
        const image = article.querySelector("[data-img]");
        const items = article.querySelectorAll("[data-text] > *");

        gsap.set(title, { yPercent: 110 });
        gsap.set(items, { opacity: 0, y: 30 });

        const reveal = gsap
          .timeline({ paused: true })
          .to(title, { yPercent: 0, duration: 1.1, ease: "expo.out" })
          .to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            },
            0.25,
          );

        ScrollTrigger.create({
          trigger: image,
          start: "center 75%",
          onEnter: () => reveal.timeScale(1).play(),
          onLeaveBack: () => reveal.timeScale(1.6).reverse(),
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-no-squeeze
      className="relative w-full overflow-x-clip text-white"
    >
      <div
        data-heading
        className="sticky top-0 z-0 flex h-[100svh] flex-col items-center justify-center px-5 text-center"
      >
        <h2 className="text-[16vw] font-semibold leading-none tracking-tighter transition-colors duration-300 hover:text-[#FF6B3D] md:text-[9vw]">
          <PsychedelicText text="Projects" strokeWidth={0.01} />
        </h2>

        <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-white/30">
          (Scroll to explore more)
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-24 px-5 pb-24 sm:px-8 md:gap-40 md:pb-40 lg:px-12">
        {projects.map((project, index) => {
          const imageOnRight = index % 2 === 1;

          return (
            <article key={project.id} data-project>
              <h3 className="overflow-hidden pb-[0.1em] text-[13vw] font-semibold uppercase leading-[0.88] tracking-[-0.05em] transition-colors duration-300 hover:text-[#FF6B3D] md:text-[6.5vw] xl:text-[7rem]">
                <span data-title className="block">
                  {project.title}
                </span>
              </h3>

              <div
                className={`mt-8 grid items-end gap-8 md:mt-12 md:gap-12 ${
                  imageOnRight ? GRID_RIGHT : GRID_LEFT
                }`}
              >
                <div data-img className={imageOnRight ? "md:order-2" : ""}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title}`}
                    onMouseMove={movePill}
                    className="group relative block overflow-hidden rounded-xl border border-white/10"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      draggable="false"
                      onLoad={() => ScrollTrigger.refresh()}
                      className="block h-auto w-full select-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />

                    <span
                      data-pill
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 whitespace-nowrap bg-[#ff6b3d] px-4 py-2 font-mono text-[10px] tracking-wider text-white opacity-0 transition-opacity rounded-full duration-200 group-hover:opacity-100 [@media(hover:none)]:hidden"
                    >
                      VIEW PROJECT
                    </span>
                  </a>
                </div>

                <div
                  data-text
                  className={`max-w-md ${
                    imageOnRight ? "md:order-1 md:ml-auto" : ""
                  }`}
                >
                  <p className="text-base leading-relaxed text-white/50 md:text-lg">
                    {project.description}
                  </p>

                  <p className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                    Main Skills
                  </p>

                  <p className="mt-2 text-sm font-semibold">{project.skills}</p>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block w-fit whitespace-nowrap rounded-full border border-white/30 px-6 py-3 font-mono text-[11px] tracking-wider transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    VIEW PROJECT
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;