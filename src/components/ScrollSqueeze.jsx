import { useEffect } from "react";
import gsap from "gsap";

const docTop = (el) => {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
};

const ScrollSqueeze = ({
  selector = "main > *:not([data-no-squeeze])",
  maxCompress = 0.06,
  fullAt = 25,
}) => {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const targets = gsap.utils.toArray(selector);
    const items = targets.map((el) => ({
      el,
      set: gsap.quickTo(el, "scaleY", { duration: 0.45, ease: "power3.out" }),
    }));

    gsap.set(targets, { willChange: "transform" });

    let lenis = null;
    let retry;
    let idle;

    const apply = (value) => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      items.forEach(({ el, set }) => {
        const top = docTop(el);
        const bottom = top + el.offsetHeight;
        const visible = bottom > scrollY && top < scrollY + vh;

        if (visible && value !== 1) {
          gsap.set(el, { transformOrigin: `50% ${scrollY + vh / 2 - top}px` });
        }

        set(visible ? value : 1);
      });
    };

    const onScroll = (l) => {
      const v = Math.abs(l.velocity || 0);
      const amount = Math.min(v / fullAt, 1) * maxCompress;

      apply(1 - amount);

      clearTimeout(idle);
      idle = setTimeout(() => apply(1), 150);
    };

    const attach = () => {
      lenis = window.lenis;
      if (!lenis) {
        retry = setTimeout(attach, 200);
        return;
      }
      lenis.on("scroll", onScroll);
    };
    attach();

    return () => {
      clearTimeout(idle);
      clearTimeout(retry);
      lenis?.off?.("scroll", onScroll);
      gsap.set(targets, {
        clearProps: "transform,willChange,transformOrigin",
      });
    };
  }, [selector, maxCompress, fullAt]);

  return null;
};

export default ScrollSqueeze;