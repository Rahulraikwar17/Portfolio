import React, { useRef, useEffect, useId } from "react";
import { gsap } from "gsap";



const LiquidText = ({ children }) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `liquid-filter-${uid}`;

  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const turbRef = useRef(null);
  const dispRef = useRef(null);

  const lastPos = useRef({ x: 0, y: 0, t: 0 });
  const scaleObj = useRef({ val: 0 });
  const idleTween = useRef(null);

  useEffect(() => {

    idleTween.current = gsap.to(turbRef.current, {
      attr: { baseFrequency: "0.012 0.018" },
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

   
    lastPos.current.t = performance.now();

    return () => {
      idleTween.current?.kill();
    };
  }, []);

  const applyScale = (v) => {
    gsap.to(scaleObj.current, {
      val: v,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        dispRef.current?.setAttribute("scale", scaleObj.current.val.toFixed(2));
      },
    });
  };

  const handleMouseMove = (e) => {
    const el = textRef.current;
    const rect = wrapRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    const moveX = (x / rect.width - 0.5) * 24;
    const moveY = (y / rect.height - 0.5) * 24;

    gsap.to(el, {
      x: moveX,
      y: moveY,
      skewX: moveX * 0.15,
      skewY: moveY * 0.1,
      scale: 1.04,
      duration: 0.5,
      ease: "power3.out",
    });

  
    const now = performance.now();
    const dt = Math.max(now - lastPos.current.t, 1);
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt; 

    lastPos.current = { x: e.clientX, y: e.clientY, t: now };

    const target = gsap.utils.clamp(6, 40, speed * 220);
    applyScale(target);

  
    gsap.to(turbRef.current, {
      attr: { baseFrequency: `${0.01 + speed * 0.001} ${0.015 + speed * 0.001}` },
      duration: 0.3,
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      skewX: 0,
      skewY: 0,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.4)",
    });
    applyScale(0);
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter
            id={filterId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.01 0.015"
              numOctaves="2"
              seed="7"
              result="turbulence"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="turbulence"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <h1
          ref={textRef}
          style={{ filter: `url(#${filterId})`, willChange: "transform" }}
          className=""
        >
          {children}
        </h1>
      </div>
    </div>
  );
};

export default LiquidText;