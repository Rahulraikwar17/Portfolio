import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const IMAGE_TIMEOUT = 8000;
const FONT_TIMEOUT = 2500;
const MIN_DURATION = 1800;
const RING_RADIUS = 54;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const SCROLL_KEYS = [
  " ",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  "ArrowUp",
  "ArrowDown",
];

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(#ff6b3d 1px, transparent 1px), linear-gradient(90deg, #ff6b3d 1px, transparent 1px)",
  backgroundSize: "64px 64px",
  maskImage: "radial-gradient(circle at center, black, transparent 65%)",
  WebkitMaskImage: "radial-gradient(circle at center, black, transparent 65%)",
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preload(src) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, IMAGE_TIMEOUT);
    const done = () => {
      clearTimeout(timer);
      resolve();
    };
    const img = new Image();
    img.src = src;
    if (typeof img.decode === "function") {
      img.decode().then(done, done);
    } else {
      img.onload = done;
      img.onerror = done;
    }
  });
}

function waitForFonts() {
  if (!document.fonts) return Promise.resolve();

  // Load the exact font used by the hero heading so it does not swap after the reveal.
  const heading = document.querySelector("h1");
  const loads = [];
  if (heading) {
    const cs = getComputedStyle(heading);
    loads.push(
      document.fonts
        .load(`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`)
        .catch(() => null),
    );
  }

  const ready = Promise.all(loads).then(() => document.fonts.ready);
  return Promise.race([ready, wait(FONT_TIMEOUT)]);
}

function waitForPageLoad() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) =>
    window.addEventListener("load", resolve, { once: true }),
  );
}

export default function Loader({ images = [], onReveal, onComplete }) {
  const [visible, setVisible] = useState(true);

  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);
  const orbitRef = useRef(null);
  const ringRef = useRef(null);
  const counterRef = useRef(null);
  const imagesRef = useRef(images);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!visible) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    // Lock both elements because an overflow rule on <html> makes the body lock useless.
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const blockScroll = (e) => {
      if (e.ctrlKey) return;
      if (e.cancelable) e.preventDefault();
    };
    const blockKeys = (e) => {
      if (SCROLL_KEYS.includes(e.key) && e.cancelable) e.preventDefault();
    };
    // Safety net: if anything still moves the page, put it back at the top.
    const keepTop = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", keepTop);

    return () => {
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("scroll", keepTop);
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [visible]);

  // Runs after the lock above has been released and the loader has unmounted.
  useEffect(() => {
    if (!visible) onCompleteRef.current?.();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let crawl;
    let finish;
    let pause;
    let exitTimeline;
    const progress = { value: 0 };
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const render = () => {
      const value = progress.value;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(
          RING_LENGTH * (1 - value / 100),
        );
      }
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(value)).padStart(
          2,
          "0",
        );
      }
    };

    const exit = () => {
      if (cancelled || !rootRef.current) return;
      rootRef.current.style.pointerEvents = "none";

      // The content fades out first, then the whole screen lifts like a curtain.
      exitTimeline = gsap
        .timeline({ onComplete: () => setVisible(false) })
        .to(
          contentRef.current,
          { opacity: 0, scale: 0.9, duration: 0.45, ease: "power2.in" },
          0.1,
        )
        .to(
          rootRef.current,
          { yPercent: -100, duration: 1, ease: "power4.inOut" },
          0.45,
        )
        .add(() => onRevealRef.current?.(), 0.75);
    };

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 9,
        ease: "none",
        repeat: -1,
      });
      gsap.fromTo(
        glowRef.current,
        { scale: 0.9, opacity: 0.2 },
        {
          scale: 1.2,
          opacity: 0.45,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );
    }, rootRef);

    render();

    // The counter moves on its own up to 88%, then jumps to 100% once everything is loaded.
    crawl = gsap.to(progress, {
      value: 88,
      duration: 3,
      ease: "power2.out",
      onUpdate: render,
    });

    Promise.all([
      Promise.all(imagesRef.current.map(preload)),
      waitForFonts(),
      waitForPageLoad(),
      wait(MIN_DURATION),
    ]).then(() => {
      if (cancelled) return;
      crawl.kill();
      finish = gsap.to(progress, {
        value: 100,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: render,
        onComplete: () => {
          pause = gsap.delayedCall(0.2, exit);
        },
      });
    });

    return () => {
      cancelled = true;
      crawl?.kill();
      finish?.kill();
      pause?.kill();
      exitTimeline?.kill();
      ctx.revert();
    };
  }, [visible]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#050505] font-['Space_Grotesk',sans-serif] text-white will-change-transform"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={GRID_STYLE}
      />

      <div ref={contentRef} className="relative h-40 w-40">
        <div
          ref={glowRef}
          className="absolute inset-4 rounded-full bg-[#ff6b3d] blur-[50px]"
          style={{ opacity: 0.2 }}
        />

        <div
          ref={orbitRef}
          className="absolute -inset-5 rounded-full border border-dashed border-white/15"
        />

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <circle
            ref={ringRef}
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="#ff6b3d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-baseline">
            <span
              ref={counterRef}
              className="text-4xl font-medium tabular-nums leading-none"
            >
              00
            </span>
            <span className="ml-1 text-sm leading-none text-white/50">%</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}