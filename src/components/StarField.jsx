import { useEffect, useMemo, useRef } from "react";

const TWO_PI = Math.PI * 2;
const STAR_WHITE = "#ffffff";
const STAR_COOL = "#a9bcff";

const createRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildStars = (count, seed, cluster) => {
  const random = createRandom(seed);
  const bell = () => (random() + random() + random() + random() - 2) / 2;
  const stars = [];

  while (stars.length < count) {
    const clustered = cluster && stars.length % 5 !== 0;
    const x = clustered ? 74 + bell() * 70 : random() * 100;
    const y = clustered ? 48 + bell() * 80 : random() * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) continue;

    const r = 0.4 + random() * random() * 1.5;
    const depth = 0.5 + r / 1.9;

    stars.push({
      x: x / 100,
      y: y / 100,
      r,
      opacity: 0.15 + random() * 0.7,
      cool: stars.length % 9 === 0,
      ax: (8 + random() * 26) * depth,
      ay: (8 + random() * 26) * depth,
      fx: TWO_PI / (28 + random() * 50),
      fy: TWO_PI / (28 + random() * 50),
      px: random() * TWO_PI,
      py: random() * TWO_PI,
      tw: 0.15 + random() * 0.3,
      ft: TWO_PI / (3 + random() * 5),
      pt: random() * TWO_PI,
    });
  }

  return stars;
};

const StarField = ({
  count = 200,
  seed = 11,
  cluster = false,
  fixed = false,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const stars = useMemo(
    () => buildStars(count, seed, cluster),
    [count, seed, cluster],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    const start = performance.now();

    const draw = (elapsed) => {
      const t = elapsed / 1000;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const x = star.x * width + Math.sin(t * star.fx + star.px) * star.ax;
        const y = star.y * height + Math.cos(t * star.fy + star.py) * star.ay;
        const twinkle =
          1 - star.tw * (0.5 + 0.5 * Math.sin(t * star.ft + star.pt));

        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = star.cool ? STAR_COOL : STAR_WHITE;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, TWO_PI);
        ctx.fill();
      }
    };

    const loop = (now) => {
      draw(now - start);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduceMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now() - start);
    };

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else pause();
    });
    viewObserver.observe(canvas);

    return () => {
      pause();
      sizeObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none inset-0 h-full w-full ${
        fixed ? "fixed" : "absolute"
      } ${className}`}
    />
  );
};

export default StarField;