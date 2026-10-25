import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";



const CORAL = "#ff6b3d";
const INK = "#0b0b0d";

const lerpAngle = (a, b, t) => {
  const d = ((((b - a + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
  return a + d * t;
};

export const createBee = () => {
  const bee = new THREE.Group(); 
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05, ...extra });


  const abd = new THREE.SphereGeometry(0.5, 48, 32);
  abd.rotateZ(Math.PI / 2); 
  abd.scale(1.15, 0.78, 0.78);
  const pos = abd.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cA = new THREE.Color(CORAL);
  const cB = new THREE.Color(INK);
  const half = 0.575;
  for (let i = 0; i < pos.count; i++) {
    const band = Math.min(4, Math.floor(((pos.getX(i) + half) / (half * 2)) * 5));
    const c = band % 2 === 0 ? cA : cB;
    colors.set([c.r, c.g, c.b], i * 3);
  }
  abd.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const abdomen = new THREE.Mesh(abd, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 }));
  abdomen.position.x = -0.2;
  bee.add(abdomen);

  const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24), std("#151517", { roughness: 0.85 }));
  thorax.position.x = 0.46;
  bee.add(thorax);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 24), std("#1d1d20"));
  head.position.set(0.88, 0.02, 0);
  bee.add(head);


  [1, -1].forEach((s) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 16), std("#ffffff", { roughness: 0.2 }));
    eye.position.set(1.0, 0.09, 0.15 * s);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), std("#050505", { roughness: 0.1 }));
    pupil.position.set(1.07, 0.09, 0.17 * s);
    bee.add(eye, pupil);
  });


  const up = new THREE.Vector3(0, 1, 0);
  [1, -1].forEach((s) => {
    const dir = new THREE.Vector3(0.55, 0.8, 0.45 * s).normalize();
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.5, 8), std("#050505"));
    const base = new THREE.Vector3(0.95, 0.22, 0.07 * s);
    ant.position.copy(base).addScaledVector(dir, 0.25);
    ant.quaternion.setFromUnitVectors(up, dir);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), std(CORAL, { emissive: CORAL, emissiveIntensity: 0.4 }));
    tip.position.copy(base).addScaledVector(dir, 0.5);
    bee.add(ant, tip);
  });


  const sting = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 12), std("#050505"));
  sting.rotation.z = Math.PI / 2;
  sting.position.x = -0.85;
  bee.add(sting);


  [1, -1].forEach((s) => {
    [0.3, 0.46, 0.62].forEach((x, k) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.34, 6), std("#050505"));
      leg.position.set(x, -0.42, 0.14 * s);
      leg.rotation.x = 0.45 * s;
      leg.rotation.z = (k - 1) * 0.35;
      bee.add(leg);
    });
  });


  const wingMat = new THREE.MeshStandardMaterial({
    color: "#dff0ff",
    transparent: true,
    opacity: 0.55,
    roughness: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const makeWing = (rx, ry) => {
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
    const g = new THREE.ShapeGeometry(shape, 28);
    g.translate(0, ry, 0); 
    return g;
  };
  const wings = [];
  [1, -1].forEach((s) => {
    [
      { rx: 0.3, ry: 0.78, sweep: -0.12 }, 
      { rx: 0.22, ry: 0.52, sweep: 0.55 },
    ].forEach(({ rx, ry, sweep }) => {
      const pivot = new THREE.Group();
      pivot.position.set(0.42, 0.3, 0.1 * s);
      const mesh = new THREE.Mesh(makeWing(rx, ry), wingMat);
      mesh.rotation.z = sweep;
      pivot.add(mesh);
      bee.add(pivot);
      wings.push({ pivot, side: s });
    });
  });

  return { bee, wings };
};

const HINT_CSS = `
.bee-hint { opacity: 0; }
.bee-hint[data-phase="in"]  { animation: bee-flick-in 0.75s linear forwards; }
.bee-hint[data-phase="out"] { animation: bee-flick-out 0.45s linear forwards; }

.bee-hint-text { position: relative; display: inline-block; }
.bee-hint-text::before,
.bee-hint-text::after {
  content: attr(data-text);
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  opacity: 0; pointer-events: none;
}
.bee-hint-text::before { color: #00e5ff; }
.bee-hint-text::after  { color: #ff2d6f; }

.bee-hint[data-phase="in"] .bee-hint-text          { animation: bee-jitter 1.3s steps(1) infinite; }
.bee-hint[data-phase="in"] .bee-hint-text::before  { animation: bee-slice-a 1.3s steps(1) infinite; }
.bee-hint[data-phase="in"] .bee-hint-text::after   { animation: bee-slice-b 1.1s steps(1) infinite; }

@keyframes bee-flick-in {
  0% { opacity: 0 } 6% { opacity: 1 } 10% { opacity: .15 } 16% { opacity: 1 }
  22% { opacity: 0 } 30% { opacity: .9 } 36% { opacity: .2 } 46% { opacity: 1 }
  60% { opacity: .6 } 68% { opacity: 1 } 100% { opacity: 1 }
}
@keyframes bee-flick-out {
  0% { opacity: 1 } 20% { opacity: .1 } 35% { opacity: .9 } 55% { opacity: 0 }
  70% { opacity: .5 } 100% { opacity: 0 }
}
@keyframes bee-jitter {
  0%, 100% { transform: none }
  8%  { transform: translate(-1px, 0) skewX(-8deg) }
  16% { transform: none }
  42% { transform: translate(1px, -1px) }
  44% { transform: none }
  70% { transform: translate(-2px, 0) skewX(10deg) }
  72% { transform: none }
}
@keyframes bee-slice-a {
  0%, 100% { opacity: 0 }
  8%  { opacity: 1; transform: translate(-2px, 0); clip-path: inset(0 0 55% 0) }
  16% { opacity: 0 }
  42% { opacity: 1; transform: translate(2px, 0);  clip-path: inset(40% 0 20% 0) }
  46% { opacity: 0 }
  70% { opacity: 1; transform: translate(-3px, 0); clip-path: inset(60% 0 0 0) }
  74% { opacity: 0 }
}
@keyframes bee-slice-b {
  0%, 100% { opacity: 0 }
  14% { opacity: 1; transform: translate(2px, 0);  clip-path: inset(50% 0 10% 0) }
  20% { opacity: 0 }
  52% { opacity: 1; transform: translate(-2px, 1px); clip-path: inset(0 0 60% 0) }
  58% { opacity: 0 }
  80% { opacity: 1; transform: translate(3px, 0);  clip-path: inset(25% 0 40% 0) }
  84% { opacity: 0 }
}

@media (prefers-reduced-motion: reduce) {
  .bee-hint[data-phase="in"]  { animation: none; opacity: 1; }
  .bee-hint[data-phase="out"] { animation: none; opacity: 0; }
  .bee-hint[data-phase="in"] .bee-hint-text,
  .bee-hint[data-phase="in"] .bee-hint-text::before,
  .bee-hint[data-phase="in"] .bee-hint-text::after { animation: none; }
}
`;


const SIZE_MOBILE = 120;
const SIZE_DESKTOP = 144;
const EDGE = 8; 

const BeeFlyer = ({
  href = "#contact",
  label = "Hire me",
  hint = "hire me",
  hintEvery = 10000,
  start = "bottom-left",
  className = "",
}) => {
  const rootRef = useRef(null);
  const mountRef = useRef(null);
  const hoverRef = useRef(false);
  const dragRef = useRef(false);
  const posRef = useRef({ x: 0, y: 0 });
  const dragInfo = useRef(null);
  const wasDragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hintPhase, setHintPhase] = useState("off");
  const applyPos = (x, y) => {
    const el = rootRef.current;
    if (!el) return;
    const s = el.offsetWidth;
    const nx = Math.min(Math.max(x, -s * 0.2), window.innerWidth - s * 0.8);
    const ny = Math.min(Math.max(y, -s * 0.2), window.innerHeight - s * 0.8);
    posRef.current = { x: nx, y: ny };
    el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
  };


  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const s = el.offsetWidth;
    const left = start.endsWith("left");
    const bottom = start.startsWith("bottom");
    const x = left ? EDGE : window.innerWidth - s - EDGE;
    const y = bottom ? window.innerHeight - s - 24 : 84;
    applyPos(x, y);

    const onResize = () => applyPos(posRef.current.x, posRef.current.y);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);

  }, []);


  useEffect(() => {
    let t1, t2;
    const id = setInterval(() => {
      setHintPhase("in");
      t1 = setTimeout(() => setHintPhase("out"), 2400);
      t2 = setTimeout(() => setHintPhase("off"), 2850);
    }, hintEvery);
    return () => {
      clearInterval(id);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [hintEvery]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 2.1, 6.8);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight("#ffffff", 0.9));
    const key = new THREE.DirectionalLight("#ffffff", 2.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.PointLight(CORAL, 25, 12);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const { bee, wings } = createBee();
    scene.add(bee);

    const resize = () => {
      const w = mount.clientWidth || 120;
      const h = mount.clientHeight || 120;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const st = { ang: 0, h: 0 };
    const clock = new THREE.Clock();
    let raf;

    const frame = () => {
      const t = clock.getElapsedTime();
      const active = hoverRef.current || dragRef.current;
      st.h += ((active ? 1 : 0) - st.h) * 0.08;

      const freq = 38 + 24 * st.h;
      const f = 0.55 + 0.45 * Math.sin(t * freq);
      wings.forEach(({ pivot, side }) => {
        pivot.rotation.x = side * (Math.PI / 2 - (0.12 + f * 0.8));
      });

      const a = t * 0.9;
      const sx = 0.75 * (1 - 0.85 * st.h);
      const sz = 0.4 * (1 - 0.85 * st.h);
      const vx = sx * Math.cos(a) * 0.9;
      const vz = -sz * Math.sin(a) * 0.9;
      bee.position.set(sx * Math.sin(a), 0.14 * Math.sin(t * 2.3) + 0.06 * Math.sin(t * 5.1), sz * Math.cos(a));

      const velAng = Math.atan2(-vz, vx);
      const target = lerpAngle(velAng, -Math.PI / 2, st.h);
      st.ang = lerpAngle(st.ang, target, 0.07);
      bee.rotation.y = st.ang;
      bee.rotation.z = 0.1 * Math.sin(t * 2.3 + 0.8) - 0.12;
      bee.rotation.x = 0.1 * Math.sin(t * 1.6) * (1 - st.h);
      bee.scale.setScalar(0.95 + 0.12 * st.h);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      wings.forEach(({ pivot, side }) => (pivot.rotation.x = side * (Math.PI / 2 - 0.5)));
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragInfo.current = { px: e.clientX, py: e.clientY, ox: posRef.current.x, oy: posRef.current.y };
    wasDragged.current = false;
  };
  const onPointerMove = (e) => {
    const d = dragInfo.current;
    if (!d) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!wasDragged.current && Math.hypot(dx, dy) > 5) {
      wasDragged.current = true;
      dragRef.current = true;
      setDragging(true);
    }
    if (wasDragged.current) applyPos(d.ox + dx, d.oy + dy);
  };
  const onPointerUp = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    dragInfo.current = null;
    dragRef.current = false;
    setDragging(false);
  };

  const sizeStyle = { "--bee": `${SIZE_MOBILE}px`, "--bee-md": `${SIZE_DESKTOP}px` };
  const hintPhaseShown = hovering || dragging ? "off" : hintPhase;

  return (
    <div
      ref={rootRef}
      style={sizeStyle}
      className={`pointer-events-none fixed left-0 top-0 z-[900] h-[var(--bee)] w-[var(--bee)] md:h-[var(--bee-md)] md:w-[var(--bee-md)] ${className}`}
    >
      <style>{HINT_CSS}</style>

    
      <div className="absolute inset-[24%] rounded-full bg-[#ff6b3d]/20 blur-2xl" />


      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />

   
      <span
        aria-hidden="true"
        data-phase={hintPhaseShown}
        className="bee-hint absolute left-1/2 top-[10%] -translate-x-1/2 whitespace-nowrap rounded-full border border-[#ff6b3d]/60 bg-[#050505]/80 px-2.5 py-0.5 font-['Space_Grotesk',sans-serif] text-[11px] font-semibold text-[#ff9068] backdrop-blur"
      >
        <span className="bee-hint-text" data-text={hint}>
          {hint}
        </span>
      </span>


      <a
        href={href}
        aria-label={label}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={() => {
          hoverRef.current = true;
          setHovering(true);
        }}
        onPointerLeave={() => {
          hoverRef.current = false;
          setHovering(false);
        }}
        onFocus={() => {
          hoverRef.current = true;
          setHovering(true);
        }}
        onBlur={() => {
          hoverRef.current = false;
          setHovering(false);
        }}
        onClick={(e) => {
          if (wasDragged.current) {
            e.preventDefault(); 
            wasDragged.current = false;
          }
        }}
        style={{ touchAction: "none" }}
        className={`pointer-events-auto absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 select-none rounded-full outline-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <span
          className={`absolute left-1/2 top-[88%] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff6b3d] px-3.5 py-1 font-['Space_Grotesk',sans-serif] text-[13px] font-semibold text-[#050505] shadow-[0_0_30px_-6px_#ff6b3d] transition-all duration-300 ${
            hovering && !dragging ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {label}
        </span>
      </a>
    </div>
  );
};

export default BeeFlyer;