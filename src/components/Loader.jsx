import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

const BG = "#0a0a0a";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const gridRef = useRef({ cols: 0, rows: 0 });

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const size = window.innerWidth < 640 ? 24 : 28;
    const next = {
      cols: Math.ceil(window.innerWidth / size),
      rows: Math.ceil(window.innerHeight / size),
    };
    gridRef.current = next;
    setGrid(next);
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let removeLoadListener = () => {};

    const ctx = gsap.context(() => {
      const counter = { v: 0 };

      const update = () => {
        if (!barRef.current || !countRef.current) return;
        barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        countRef.current.textContent = Math.round(counter.v);
      };

      const exit = () => {
        const { cols, rows } = gridRef.current;
        const cx = (cols - 1) / 2;
        const cy = (rows - 1) / 2;
        const direction = (i) => {
          const dx = (i % cols) - cx;
          const dy = Math.floor(i / cols) - cy;
          const len = Math.hypot(dx, dy) || 1;
          return { x: dx / len, y: dy / len };
        };
        const stagger = { amount: 0.9, from: "center", grid: [rows, cols] };

        gsap
          .timeline({ onComplete: () => setVisible(false) })
          .to(contentRef.current, { autoAlpha: 0, duration: 0.35, ease: "power2.in" })
          .set(rootRef.current, { backgroundColor: "transparent" })
          .to(".ld-px", {
            x: (i) => direction(i).x * gsap.utils.random(80, 320),
            y: (i) => direction(i).y * gsap.utils.random(80, 320),
            rotation: () => gsap.utils.random(-270, 270),
            scale: 0.2,
            duration: 1,
            ease: "power2.out",
            stagger,
          })
          .to(".ld-px", { autoAlpha: 0, duration: 1, ease: "power3.in", stagger }, "<");
      };

      const finish = () =>
        gsap.to(counter, {
          v: 100,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: update,
          onComplete: () => gsap.delayedCall(0.25, exit),
        });

      gsap.from(contentRef.current, { autoAlpha: 0, y: 10, duration: 0.6, ease: "power2.out" });

      gsap.to(counter, {
        v: 85,
        duration: 1.8,
        ease: "power1.out",
        onUpdate: update,
        onComplete: () => {
          if (document.readyState === "complete") {
            finish();
          } else {
            window.addEventListener("load", finish, { once: true });
            removeLoadListener = () => window.removeEventListener("load", finish);
          }
        },
      });
    }, rootRef);

    return () => {
      removeLoadListener();
      ctx.revert();
    };
  }, [visible]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[99999] overflow-hidden bg-neutral-950 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: grid.cols * grid.rows }).map((_, i) => (
          <div
            key={i}
            className="ld-px bg-neutral-950 will-change-transform"
            style={{ boxShadow: `0 0 0 0.6px ${BG}` }}
          />
        ))}
      </div>

      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      >
        <p className="text-6xl font-light tabular-nums tracking-widest">
          <span ref={countRef}>0</span>
          <span className="ml-1 text-2xl text-white/50">%</span>
        </p>
        <div className="h-px w-64 max-w-[70vw] overflow-hidden bg-white/15">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </div>,
    document.body
  );
}