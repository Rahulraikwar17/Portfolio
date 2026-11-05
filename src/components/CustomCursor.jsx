import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor="hover"]';
const ACCENT = "255,107,61";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const dotInnerRef = useRef(null);
  const ringInnerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const style = document.createElement("style");
    style.textContent = "html, html * { cursor: none !important; }";
    document.head.appendChild(style);

    let shown = false;
    let hovering = false;
    let pressed = false;

    const ctx = gsap.context(() => {
      gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });

      const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.55, ease: "power3.out" });
      const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.55, ease: "power3.out" });

      const render = (ease = "power3.out") => {
        const ringScale = shown ? (hovering ? 1.8 : 1) * (pressed ? 0.85 : 1) : 0;
        const dotScale = shown ? (hovering ? 0 : 1) * (pressed ? 0.7 : 1) : 0;

        gsap.to(ringInnerRef.current, {
          scale: ringScale,
          autoAlpha: shown ? 1 : 0,
          backgroundColor: `rgba(${ACCENT},${hovering ? 0.14 : 0})`,
          duration: 0.4,
          ease,
          overwrite: "auto",
        });
        gsap.to(dotInnerRef.current, {
          scale: dotScale,
          autoAlpha: shown ? 1 : 0,
          duration: 0.3,
          ease,
          overwrite: "auto",
        });
      };

      const snapTo = (x, y) => {
        gsap.set([dotRef.current, ringRef.current], { x, y });
      };

      const reveal = (x, y) => {
        if (shown) return;
        shown = true;
        snapTo(x, y);
        render("back.out(1.8)");
      };

      const onMove = (e) => {
        if (!shown) {
          reveal(e.clientX, e.clientY);
          return;
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onEnter = (e) => reveal(e.clientX, e.clientY);

      const onLeave = () => {
        shown = false;
        hovering = false;
        pressed = false;
        render("power2.in");
      };

      const onOver = (e) => {
        const next = !!(e.target instanceof Element && e.target.closest(INTERACTIVE));
        if (next === hovering) return;
        hovering = next;
        if (shown) render();
      };

      const onDown = () => {
        pressed = true;
        if (shown) render();
      };

      const onUp = () => {
        pressed = false;
        if (shown) render();
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseover", onOver, { passive: true });
      window.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      document.documentElement.addEventListener("mouseenter", onEnter);
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseover", onOver);
        window.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
      };
    });

    return () => {
      ctx.revert();
      style.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000]"
      >
        <div
          ref={ringInnerRef}
          className="h-10 w-10 rounded-full border border-[#FF6B3D] opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000]"
      >
        <div
          ref={dotInnerRef}
          className="h-2 w-2 rounded-full bg-[#FF6B3D] opacity-0"
        />
      </div>
    </>
  );
}