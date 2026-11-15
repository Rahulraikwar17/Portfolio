import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [data-cursor="hover"]';
const ACCENT = "57, 255, 136";

const SIZE = 10;
const HALF = SIZE / 2;
const TRAIL_COUNT = 12;
const HEAD_FOLLOW = 0.5;
const TRAIL_FOLLOW = 0.4;

const ghostOpacity = (i) => 0.5 * (1 - i / TRAIL_COUNT);
const ghostScale = (i) => 1 - (i / TRAIL_COUNT) * 0.55;

const TRAIL_ORDER = Array.from({ length: TRAIL_COUNT }, (_, i) => TRAIL_COUNT - 1 - i);

export default function CustomCursor() {
  const headRef = useRef(null);
  const headInnerRef = useRef(null);
  const trailRefs = useRef([]);
  const trailInnerRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const headEl = headRef.current;
    const headInner = headInnerRef.current;
    const trailEls = trailRefs.current.slice(0, TRAIL_COUNT);
    const trailInners = trailInnerRefs.current.slice(0, TRAIL_COUNT);
    if (!headEl || !headInner || trailEls.some((el) => !el)) return;

    const style = document.createElement("style");
    style.textContent = "html, html * { cursor: none !important; }";
    document.head.appendChild(style);

    let shown = false;
    let hovering = false;
    let pressed = false;

    const pointer = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }));

    const place = (el, p) => {
      el.style.transform = `translate3d(${p.x - HALF}px, ${p.y - HALF}px, 0)`;
    };

    const write = () => {
      place(headEl, head);
      trail.forEach((p, i) => place(trailEls[i], p));
    };

    const render = (ease = "power3.out") => {
      gsap.to(headInner, {
        scale: shown ? (hovering ? 2.6 : 1) * (pressed ? 0.7 : 1) : 0,
        rotation: hovering ? 45 : 0,
        opacity: shown ? 1 : 0,
        backgroundColor: `rgba(${ACCENT},${hovering ? 0.12 : 1})`,
        duration: 0.4,
        ease,
        overwrite: "auto",
      });

      gsap.to(trailInners, {
        opacity: (i) => (shown && !hovering ? ghostOpacity(i) : 0),
        scale: (i) => (shown ? ghostScale(i) * (pressed ? 0.8 : 1) : 0),
        duration: 0.3,
        ease,
        overwrite: "auto",
      });
    };

    const snapTo = (x, y) => {
      pointer.x = x;
      pointer.y = y;
      head.x = x;
      head.y = y;
      trail.forEach((p) => {
        p.x = x;
        p.y = y;
      });
      write();
    };

    const reveal = (x, y) => {
      if (shown) return;
      shown = true;
      snapTo(x, y);
      render("back.out(1.8)");
    };

    const tick = (time, deltaTime) => {
      if (!shown) return;

      const dt = Math.min(deltaTime, 100) / 1000;
      const headK = 1 - Math.pow(1 - HEAD_FOLLOW, dt * 60);
      const trailK = 1 - Math.pow(1 - TRAIL_FOLLOW, dt * 60);

      let moving = false;

      const follow = (p, target, k) => {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
        p.x += dx * k;
        p.y += dy * k;
        moving = true;
      };

      follow(head, pointer, headK);

      let previous = head;
      for (const p of trail) {
        follow(p, previous, trailK);
        previous = p;
      }

      if (moving) write();
    };

    const onMove = (e) => {
      if (!shown) {
        reveal(e.clientX, e.clientY);
        return;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
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

    gsap.ticker.add(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      gsap.ticker.remove(tick);
      gsap.killTweensOf([headInner, ...trailInners]);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      style.remove();
    };
  }, []);

  return (
    <>
      {TRAIL_ORDER.map((i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="pointer-events-none fixed left-0 top-0 z-[100000] will-change-transform"
          style={{ width: SIZE, height: SIZE }}
        >
          <div
            ref={(el) => {
              trailInnerRefs.current[i] = el;
            }}
            className="h-full w-full bg-[#39ff88] opacity-0"
          />
        </div>
      ))}

      <div
        ref={headRef}
        className="pointer-events-none fixed left-0 top-0 z-[100000] will-change-transform"
        style={{ width: SIZE, height: SIZE }}
      >
        <div
          ref={headInnerRef}
          className="h-full w-full border border-[#39ff88] bg-[#39ff88] opacity-0 shadow-[0_0_14px_rgba(57,255,136,0.8)]"
        />
      </div>
    </>
  );
}