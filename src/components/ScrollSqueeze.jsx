import { useEffect } from "react";
import gsap from "gsap";

const DESKTOP_ONLY =
  "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)";

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
  maxCompress = 0.12,
  sideRatio = 0.35,
  fullAt = 20,
}) => {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_ONLY, () => {
      const targets = gsap.utils.toArray(selector);

      const items = targets.map((el) => ({
        el,
        setY: gsap.quickTo(el, "scaleY", { duration: 0.45, ease: "power3.out" }),
        setX: gsap.quickTo(el, "scaleX", { duration: 0.45, ease: "power3.out" }),
      }));

      gsap.set(targets, { willChange: "transform" });

      let lenis = null;
      let retry;
      let idle;

      const apply = (amount) => {
        const vh = window.innerHeight;
        const scrollY = window.scrollY;

        items.forEach(({ el, setY, setX }) => {
          const top = docTop(el);
          const bottom = top + el.offsetHeight;
          const visible = bottom > scrollY && top < scrollY + vh;

          if (visible && amount > 0) {
            gsap.set(el, {
              transformOrigin: `50% ${scrollY + vh / 2 - top}px`,
            });
          }

          setY(visible ? 1 - amount : 1);
          setX(visible ? 1 - amount * sideRatio : 1);
        });
      };

      const onScroll = (l) => {
        const v = Math.abs(l.velocity || 0);
        const amount = Math.min(v / fullAt, 1) * maxCompress;

        apply(amount);

        clearTimeout(idle);
        idle = setTimeout(() => apply(0), 150);
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
    });

    return () => mm.revert();
  }, [selector, maxCompress, sideRatio, fullAt]);

  return null;
};

export default ScrollSqueeze;