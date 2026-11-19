import React, { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import project1 from "../assets/images/project1.webp";
import project2 from "../assets/images/project2.webp";
import project3 from "../assets/images/project3.webp";
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

const VERTEX_SRC = `
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.02 + 7.3;
    a *= 0.5;
  }
  return v;
}

float cloth(vec2 p) {
  float t = uTime * 0.12;
  vec2 w = p;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    w += 0.5 * vec2(
      sin(w.y * 1.25 + t + fi * 1.9),
      cos(w.x * 1.05 - t * 0.8 + fi * 2.3)
    );
  }
  float folds = sin(w.x * 1.6 + w.y * 1.1);
  float soft = fbm(w * 0.9);
  return folds * 0.75 + soft * 0.35;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float s = sqrt(uRes.x * uRes.y);
  vec2 p = (fc - 0.5 * uRes) / s * 3.2;

  float e = 0.02;
  float h = cloth(p);
  float hx = cloth(p + vec2(e, 0.0));
  float hy = cloth(p + vec2(0.0, e));
  vec3 n = normalize(vec3((h - hx) / e * 0.55, (h - hy) / e * 0.55, 1.0));

  vec2 lp = (uLight - 0.5) * (uRes / s) * 3.2
    + vec2(0.25 * sin(uTime * 0.3), 0.2 * cos(uTime * 0.25));
  vec3 L = normalize(vec3(lp - p, 1.2));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  float diff = clamp(dot(n, L), 0.0, 1.0);
  float nh = clamp(dot(n, H), 0.0, 1.0);
  float spec = pow(nh, 90.0);
  float sheen = pow(nh, 8.0);
  float rim = pow(1.0 - n.z, 2.0);

  vec3 moss = vec3(0.427, 0.561, 0.388);
  vec3 neon = vec3(0.224, 1.0, 0.533);
  vec3 col = vec3(0.004, 0.010, 0.007)
    + diff * 0.10 * moss
    + sheen * 0.12 * moss
    + spec * 0.30 * neon
    + rim * 0.16 * moss;

  vec2 uv = fc / uRes;
  float vig = 1.0 - 0.7 * smoothstep(0.3, 1.0, length(vec2(uv.x - 0.5, (uv.y - 0.5) * 1.1)));
  col *= vig;

  gl_FragColor = vec4(pow(clamp(col, 0.0, 1.0), vec3(0.95)), 1.0);
}
`;

const SilkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const attr = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uLight = gl.getUniformLocation(program, "uLight");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { time: 6, lx: 0.62, ly: 0.55, tx: 0.62, ty: 0.55 };
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const render = () => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, state.time);
      gl.uniform2f(uLight, state.lx, state.ly);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (!cw || !ch) return;
      const scale = Math.min(0.55, Math.sqrt(550000 / (cw * ch)));
      canvas.width = Math.max(2, Math.round(cw * scale));
      canvas.height = Math.max(2, Math.round(ch * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      render();
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;

      state.time += dt;
      state.lx += (state.tx - state.lx) * 0.05;
      state.ly += (state.ty - state.ly) * 0.05;
      render();
    };

    const onMove = (e) => {
      state.tx = e.clientX / window.innerWidth;
      state.ty = 1 - e.clientY / window.innerHeight;
    };

    const onContextLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    canvas.addEventListener("webglcontextlost", onContextLost);

    resize();

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
};

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
      const section = sectionRef.current;
      const articles = section.querySelectorAll("[data-project]");
      const heading = section.querySelector("[data-heading]");
      const dim = section.querySelector("[data-dim]");

      // Heading fades and the silk dims while the first project scrolls in
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: articles[0],
            start: "top 85%",
            end: "top 30%",
            scrub: true,
          },
        })
        .to(heading, { opacity: 0.08 }, 0)
        .fromTo(dim, { opacity: 0 }, { opacity: 1 }, 0);

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
      className="relative w-full overflow-x-clip text-[#d6ffe6]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
          <SilkBackground />
          <div data-dim className="absolute inset-0 bg-black/55" />
        </div>

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div
        data-heading
        className="sticky top-0 z-0 flex h-[100svh] flex-col items-center justify-center px-5 text-center"
      >
        <h2 className="text-[16vw] font-semibold leading-none tracking-tighter transition-colors duration-300 hover:text-[#39ff88] md:text-[9vw]">
          <PsychedelicText text="Projects" strokeWidth={0.01} />
        </h2>

        <p className="mt-5 font-mono text-xs text-[#6d8f63]">
          Scroll to explore
        </p>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-24 px-5 pb-24 sm:px-8 md:gap-40 md:pb-40 lg:px-12">
        {projects.map((project, index) => {
          const imageOnRight = index % 2 === 1;

          return (
            <article key={project.id} data-project>
              <h3 className="overflow-hidden pb-[0.1em] text-[13vw] font-semibold uppercase leading-[0.88] tracking-[-0.05em] transition-colors duration-300 hover:text-[#39ff88] md:text-[6.5vw] xl:text-[7rem]">
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
                    className="group relative block overflow-hidden rounded-xl border border-[#6d8f63]/30 transition-colors duration-300 hover:border-[#39ff88]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88]"
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
                      className="pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full bg-[#39ff88] px-4 py-2 font-mono text-xs font-semibold text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100 [@media(hover:none)]:hidden"
                    >
                      View project
                    </span>
                  </a>
                </div>

                <div
                  data-text
                  className={`max-w-md ${
                    imageOnRight ? "md:order-1 md:ml-auto" : ""
                  }`}
                >
                  <p className="text-base leading-relaxed text-[#6d8f63] md:text-lg">
                    {project.description}
                  </p>

                  <ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-2">
                    {project.skills.split(", ").map((tech) => (
                      <li
                        key={tech}
                        className="rounded-sm border border-[#6d8f63]/50 px-3 py-1.5 font-mono text-xs text-[#d6ffe6]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-[#6d8f63] bg-black/30 px-6 py-3 text-sm font-semibold text-[#d6ffe6] backdrop-blur transition-colors duration-300 hover:border-[#39ff88] hover:bg-[#39ff88] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88]"
                  >
                    View project
                    <ArrowUpRight size={14} />
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