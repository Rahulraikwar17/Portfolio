import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAME_LINES = ["Rahul", "Raikwar"];

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

const FIRST_NAME_STYLE = {
  color: "#d6ffe6",
  textShadow:
    "0 0 0.05em rgba(57,255,136,0.9), 0 0 0.18em rgba(57,255,136,0.6), 0 0 0.5em rgba(57,255,136,0.35)",
};

const LAST_NAME_STYLE = {
  color: "transparent",
  WebkitTextStroke: "max(1.25px, 0.012em) #39ff88",
  filter:
    "drop-shadow(0 0 0.06em rgba(57,255,136,0.85)) drop-shadow(0 0 0.3em rgba(57,255,136,0.4))",
};

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

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    const reduce = prefersReducedMotion();
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
      if (window.scrollY > window.innerHeight * 1.1) return;

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

const useRoleIndex = (enabled) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 2600);

    return () => clearInterval(id);
  }, [enabled]);

  return index;
};

const HeroSection = ({ ready = true }) => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const nameWrapRef = useRef(null);
  const titleRef = useRef(null);
  const letterRefs = useRef([]);
  const badgeRef = useRef(null);
  const rolesRef = useRef(null);
  const ruleRef = useRef(null);
  const copyRef = useRef(null);
  const ctaRef = useRef(null);
  const linksRef = useRef(null);
  const timelineRef = useRef(null);

  const activeRole = useRoleIndex(ready);

  useLayoutEffect(() => {
    const hero = containerRef.current;
    const wrap = nameWrapRef.current;
    const title = titleRef.current;
    if (!hero || !wrap || !title) return;

    const fit = () => {
      const available = wrap.clientWidth;
      if (!available) return;

      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const probe = 100;
      title.style.fontSize = `${probe}px`;

      let widest = 0;
      title.querySelectorAll("[data-measure]").forEach((el) => {
        widest = Math.max(widest, el.offsetWidth);
      });
      if (!widest) return;

      const byWidth = (available / widest) * probe * (wide ? 0.62 : 0.98);
      const byHeight = hero.clientHeight * (wide ? 0.26 : 0.24);
      title.style.fontSize = `${Math.floor(Math.min(byWidth, byHeight, 300))}px`;
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    ro.observe(hero);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = letterRefs.current.filter(Boolean);
      const fadeItems = [
        badgeRef.current,
        rolesRef.current,
        copyRef.current,
        ctaRef.current,
        linksRef.current,
      ];

      gsap.set(fadeItems, { y: 20, opacity: 0 });
      gsap.set(letters, { y: 28, opacity: 0 });
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(bgRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(bgRef.current, { opacity: 1, duration: 2, ease: "power2.out" }, 0)
        .to(badgeRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.15)
        .to(letters, { y: 0, duration: 0.9, stagger: 0.07 }, 0.3)
        .to(
          letters,
          {
            keyframes: { opacity: [1, 0.2, 1, 0.5, 1], easeEach: "none" },
            duration: 0.9,
            stagger: 0.07,
          },
          0.3,
        )
        .to(rolesRef.current, { y: 0, opacity: 1, duration: 0.8 }, 1.1)
        .to(ruleRef.current, { scaleX: 1, duration: 1.2, ease: "expo.out" }, 0.9)
        .to(
          [copyRef.current, ctaRef.current, linksRef.current],
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          1.05,
        );

      timelineRef.current = tl;
    }, containerRef);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!ready || !tl) return;
    if (prefersReducedMotion()) {
      tl.progress(1);
    } else {
      tl.play();
    }
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

  const renderNameLines = () => {
    let letterIndex = 0;

    return NAME_LINES.map((word, lineIndex) => (
      <span
        key={word}
        className={`block ${lineIndex === 1 ? "text-right" : "text-left"}`}
      >
        <span
          data-measure
          className="inline-block whitespace-nowrap"
          style={lineIndex === 0 ? FIRST_NAME_STYLE : LAST_NAME_STYLE}
        >
          {word.split("").map((letter, i) => {
            const slot = letterIndex++;
            return (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[slot] = el;
                }}
                className="inline-block will-change-transform"
              >
                {letter}
              </span>
            );
          })}
        </span>
      </span>
    ));
  };

  return (
    <div
      ref={containerRef}
      id="home"
      data-no-squeeze
      className="sticky top-0 z-0 h-[100svh] min-h-[560px] w-full overflow-hidden bg-black text-white will-change-transform"
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 60% 35%, #0b1a10 0%, #000000 70%)",
        }}
      >
        <SilkBackground />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 42%, rgba(57,255,136,0.08), transparent 70%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 36%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <section
        className="relative z-10 flex h-full flex-col px-5 pt-[84px] sm:px-8 sm:pt-24 lg:px-10"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col justify-end md:justify-center">
            <div
              ref={badgeRef}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-sm border border-[#39ff88]/40 bg-[#39ff88]/5 px-3 py-1.5 font-mono text-xs text-[#39ff88] sm:mb-5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping bg-[#39ff88] opacity-80" />
                <span className="relative inline-flex h-2 w-2  bg-[#39ff88]" />
              </span>
              <span className="sm:hidden">Available for work</span>
              <span className="hidden sm:inline">
                Available for freelance and full-time roles
              </span>
            </div>

            <div ref={nameWrapRef} className="relative w-full">
              <h1
                ref={titleRef}
                className="lemonmilk-font text-[16vw] font-medium leading-[0.95] tracking-[-0.02em]"
              >
                {renderNameLines()}
              </h1>

              <ul
                ref={rolesRef}
                className="mt-4 flex flex-col gap-2 font-mono text-sm sm:mt-5 lg:absolute lg:right-0 lg:top-3 lg:mt-0 lg:text-xs"
              >
                {ROLES.map((role, i) => {
                  const active = i === activeRole;
                  return (
                    <li
                      key={role}
                      className={`items-center gap-3 transition-colors duration-500 ${
                        active
                          ? "flex text-[#39ff88]"
                          : "hidden text-[#6d8f63]/70 lg:flex"
                      }`}
                    >
                      <span
                        className={`h-px bg-current transition-all duration-500 ${
                          active ? "w-8" : "w-3"
                        }`}
                      />
                      <span>0{i + 1}</span>
                      <span>{role}</span>
                    </li>
                  );
                })}
              </ul>

              <p
                ref={copyRef}
                className="mt-4 hidden max-w-md text-sm leading-relaxed text-[#6d8f63] sm:block sm:text-base lg:absolute lg:bottom-3 lg:left-0 lg:mt-0 lg:max-w-[15rem] lg:text-sm"
              >
                I build full-stack web apps, from interfaces that feel alive to
                the APIs and databases behind them.
              </p>
            </div>
          </div>

          <div className="mt-8 shrink-0 md:mt-10">
            <div
              ref={ruleRef}
              className="mb-5 h-px w-full bg-[#6d8f63]/35 md:mb-6"
            />

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <ul
                ref={linksRef}
                className="order-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6d8f63] md:order-1 md:gap-x-7"
              >
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 transition-colors duration-200 hover:border-[#39ff88] hover:text-[#39ff88]"
                    >
                      {l.label}
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>

              <div
                ref={ctaRef}
                className="order-1 flex w-full items-center gap-3 sm:max-w-md md:order-2 md:w-auto md:max-w-none md:gap-4"
              >
                <a
                  href="#projects"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#39ff88] px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(57,255,136,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:flex-none md:px-7"
                >
                  View projects
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <ArrowUpRight />
                  </span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-[#6d8f63] bg-black/30 px-5 py-3 text-sm font-semibold text-[#d6ffe6] backdrop-blur transition-colors duration-300 hover:border-[#39ff88] hover:text-[#39ff88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88] md:flex-none md:px-7"
                >
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;