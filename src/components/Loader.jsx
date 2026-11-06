import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const WORDS = ["Design", "Develop", "Deliver", "Welcome"];
const IMAGE_TIMEOUT = 8000;
const CURVE_START = "M0 0 L100 0 Q50 24 0 0 Z";
const CURVE_END = "M0 0 L100 0 Q50 0 0 0 Z";

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

export default function Loader({ images = [], onDone }) {
  const [visible, setVisible] = useState(true);

  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const curveRef = useRef(null);
  const imagesRef = useRef(images);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let removeLoadListener = () => {};
    let cancelled = false;

    const ctx = gsap.context(() => {
      let introDone = false;
      let pageLoaded = document.readyState === "complete";
      let assetsLoaded = false;
      let started = false;

      const exit = () => {
        gsap
          .timeline({ onComplete: () => setVisible(false) })
          .to(contentRef.current, {
            y: -90,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.in",
          })
          .to(
            rootRef.current,
            { yPercent: -100, duration: 1.3, ease: "power4.inOut" },
            0.25
          )
          .fromTo(
            curveRef.current,
            { attr: { d: CURVE_START } },
            { attr: { d: CURVE_END }, duration: 1.3, ease: "power2.out" },
            0.25
          )
          .add(() => onDoneRef.current?.(), 0.85);
      };

      const check = () => {
        if (started || cancelled) return;
        if (introDone && pageLoaded && assetsLoaded) {
          started = true;
          gsap.delayedCall(0.25, exit);
        }
      };

      const onPageLoad = () => {
        pageLoaded = true;
        check();
      };
      if (!pageLoaded) {
        window.addEventListener("load", onPageLoad, { once: true });
        removeLoadListener = () => window.removeEventListener("load", onPageLoad);
      }

      Promise.all([
        ...imagesRef.current.map(preload),
        document.fonts ? document.fonts.ready : null,
      ]).then(() => {
        assetsLoaded = true;
        check();
      });

      const words = gsap.utils.toArray(".ld-word");
      gsap.set(words, { yPercent: 115 });

      const intro = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          introDone = true;
          check();
        },
      });

      intro.from(
        ".ld-corner",
        { autoAlpha: 0, y: 10, duration: 0.7, stagger: 0.1, ease: "power2.out" },
        0
      );

      words.forEach((word, i) => {
        const last = i === words.length - 1;
        intro.to(
          word,
          { yPercent: 0, duration: 0.45, ease: "power4.out" },
          i === 0 ? 0.15 : "<+=0.1"
        );
        if (!last) {
          intro.to(
            word,
            { yPercent: -115, duration: 0.28, ease: "power3.in" },
            "+=0.08"
          );
        }
      });
    }, rootRef);

    return () => {
      cancelled = true;
      removeLoadListener();
      ctx.revert();
    };
  }, [visible]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] bg-[#050505] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,61,0.14),transparent_55%)]" />

      <div ref={contentRef} className="absolute inset-0">
        <p className="ld-corner absolute left-5 top-5 text-[10px] uppercase tracking-[0.3em] text-white/50 md:left-10 md:top-8 md:text-xs">
          Rahul Raikwar
        </p>
        <p className="ld-corner absolute right-5 top-5 text-[10px] uppercase tracking-[0.3em] text-white/50 md:right-10 md:top-8 md:text-xs">
          Portfolio 2026
        </p>
        <p className="ld-corner absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.3em] text-white/50 md:bottom-8 md:left-10 md:text-xs">
          Full Stack Developer
        </p>
        <p className="ld-corner absolute bottom-5 right-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 md:bottom-8 md:right-10 md:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b3d] opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff6b3d]" />
          </span>
          Available for work
        </p>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="lemonmilk-font grid overflow-hidden px-2 text-[clamp(2.75rem,13vw,10rem)] font-medium uppercase leading-[1.05] tracking-tighter">
            {WORDS.map((word, i) => (
              <span
                key={word}
                className={`ld-word col-start-1 row-start-1 text-center ${
                  i === WORDS.length - 1 ? "text-[#ff6b3d]" : "text-white"
                }`}
              >
                {word}
              </span>
            ))}
          </h1>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute left-0 top-full -mt-px h-[12vh] w-full"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path ref={curveRef} d={CURVE_START} fill="#050505" />
      </svg>
    </div>,
    document.body
  );
}