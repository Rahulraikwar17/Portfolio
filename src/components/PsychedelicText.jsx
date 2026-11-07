import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const PsychedelicText = ({
  text = "raikwar",
  lettersRef,
  className = "",
  strokeWidth = 1.5,
}) => {
  const wrapperRef = useRef(null);
  const localRefs = useRef([]);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    const parent = el?.parentElement;

    if (!el || !parent) return;

    let lastWidth = 0;

    const fit = () => {
      el.style.fontSize = "";

      const base = parseFloat(window.getComputedStyle(el).fontSize);
      const available = parent.clientWidth;
      const natural = el.scrollWidth;

      if (available > 0 && natural > available) {
        el.style.fontSize = `${(base * available * 0.98) / natural}px`;
      }
    };

    const onResize = () => {
      lastWidth = parent.clientWidth;
      fit();
    };

    fit();

    const observer = new ResizeObserver(() => {
      if (parent.clientWidth !== lastWidth) onResize();
    });

    observer.observe(parent);
    window.addEventListener("resize", fit);

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  useEffect(() => {
    return () => {
      localRefs.current.forEach((letter) => {
        if (letter) gsap.killTweensOf(letter);
      });
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const radius = 190;

    localRefs.current.forEach((letter) => {
      if (!letter) return;

      const rect = letter.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / radius);

      if (influence <= 0) {
        gsap.to(letter, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          skewY: 0,
          rotation: 0,
          color: "transparent",
          textShadow: "0 0 0 transparent",
          webkitTextStrokeColor: "#FF6B3D",
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });

        return;
      }

      const angle = Math.atan2(dy, dx);

      const moveX = Math.cos(angle) * 12 * influence;
      const moveY = Math.sin(angle) * 9.5 * influence;

      const stretchX = 1 + influence * 0.12;
      const stretchY = 1 + influence * 0.08;

      gsap.to(letter, {
        x: moveX,
        y: moveY,
        scaleX: stretchX,
        scaleY: stretchY,
        skewY: Math.cos(angle) * 3 * influence,
        rotation: Math.sin(angle) * 2.5 * influence,
        color: `rgba(255, 107, 61, ${influence * 0.9})`,
        webkitTextStrokeColor: "#FF9068",
        textShadow: `0 0 ${9 * influence}px rgba(255,107,61,0.45)`,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const handleMouseLeave = () => {
    localRefs.current.forEach((letter) => {
      if (!letter) return;

      gsap.to(letter, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewY: 0,
        rotation: 0,
        color: "transparent",
        webkitTextStrokeColor: "#FF6B3D",
        textShadow: "0 0 0 transparent",
        duration: 0.9,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    });
  };

  return (
    <span
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block max-w-full cursor-default select-none whitespace-nowrap ${className}`}
      style={{ fontFamily: "'Psychedelic', sans-serif" }}
    >
      {text.split("").map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          ref={(el) => {
            localRefs.current[index] = el;

            if (lettersRef) {
              lettersRef.current[index] = el;
            }
          }}
          className="inline-block will-change-transform"
          style={{
            color: "transparent",
            WebkitTextStroke: `${strokeWidth}px #FF6B3D`,
            transformOrigin: "center center",
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

export default PsychedelicText;