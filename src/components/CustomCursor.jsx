import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    const links = document.querySelectorAll("nav a");

    return () => {
      window.removeEventListener("mousemove", moveCursor);

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnterLink);
        link.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="
        fixed
        top-0
        left-0
        w-4
        h-4
        rounded-full
        bg-[#FF6B3D]
        pointer-events-none
        z-[999]
        -translate-x-1/2
        -translate-y-1/2
      "
    />
  );
};

export default CustomCursor;
