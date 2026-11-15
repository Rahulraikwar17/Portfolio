import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger);


const EMAIL = "rahulraikwae350@gmail.com";
const PHONE_DISPLAY = "+91 88178 92814";
const PHONE_LINK = "+918817892814";

const MAIL_SUBJECT = "Project inquiry";
const MAIL_BODY = "Hi Rahul,\n\n";

const MAILTO_URL = `mailto:${EMAIL}?subject=${encodeURIComponent(
  MAIL_SUBJECT,
)}&body=${encodeURIComponent(MAIL_BODY)}`;

const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL,
)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(
  MAIL_BODY,
)}`;

const WHATSAPP_URL = `https://wa.me/${PHONE_LINK.replace(
  "+",
  "",
)}?text=${encodeURIComponent("Hi Rahul,")}`;

const SOCIAL_ROWS = [
  {
    key: "github",
    label: "GitHub",
    icon: FaGithub,
    value: "Rahulraikwar17",
    action: "Open GitHub",
    href: "https://github.com/Rahulraikwar17",
    external: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedinIn,
    value: "Rahul Raikwar",
    action: "Open LinkedIn",
    href: "https://www.linkedin.com/in/rahul-raikwar-7a9674306/",
    external: true,
  },
  {
    key: "discord",
    label: "Discord",
    icon: BsDiscord,
    value: "Send a message",
    action: "Open Discord",
    href: "https://discord.com/users/1004779116253425789",
    external: true,
  },
];

const ROWS = [
  {
    key: "email",
    label: "Email",
    icon: Mail,
    value: EMAIL,
    action: "Write me an email",
    href: MAILTO_URL,
    copy: EMAIL,
  },
  {
    key: "phone",
    label: "Phone",
    icon: Phone,
    value: PHONE_DISPLAY,
    action: "Call me",
    href: `tel:${PHONE_LINK}`,
    copy: PHONE_LINK,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    value: "Quick chat",
    action: "Say hi on WhatsApp",
    href: WHATSAPP_URL,
    external: true,
  },
];

const HEADLINE = {
  desktop: ["LET’S TALK"],
  mobile: ["LET’S", "TALK"],
};

const MARQUEE = [
  { text: "Available for freelance", outline: false },
  { text: "Full stack, start to finish", outline: true },
  { text: "Open to collaborations", outline: false },
  { text: "Interfaces that move", outline: true },
];

const DOT_GRID = {
  backgroundImage:
    "radial-gradient(rgba(214,255,230,0.10) 1px, transparent 1.3px)",
  backgroundSize: "26px 26px",
  maskImage: "linear-gradient(to bottom, #000 0%, transparent 65%)",
  WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 65%)",
};

const CURSOR_GLOW = {
  background:
    "radial-gradient(circle, rgba(57,255,136,0.16) 0%, rgba(57,255,136,0.05) 40%, transparent 68%)",
};

const OUTLINE_TEXT = {
  color: "transparent",
  WebkitTextStroke: "max(1px, 0.02em) #39ff88",
};

const EASE_WIPE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const handleEmailClick = (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  e.preventDefault();
  const win = window.open(GMAIL_URL, "_blank");
  if (win) {
    win.opener = null;
  } else {
    window.location.href = MAILTO_URL;
  }
};

const scrollToTop = () => {
  if (window.lenis) {
    window.lenis.scrollTo(0, { duration: 1.8 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};


const PAD = 90;
const PARTICLE_COLORS = ["#d6ffe6", "#39ff88", "#6d8f63"];

const createParticleText = (canvas, wrapper, lines, reduced) => {
  const ctx = canvas.getContext("2d");
  const state = { pull: reduced ? 1 : 0 };
  const pointer = { x: -9999, y: -9999 };

  let w = 0;
  let h = 0;
  let dpr = 1;
  let n = 0;
  let radius = 120;
  let ready = false;
  let inView = true;
  let destroyed = false;

  let tx = new Float32Array(0);
  let ty = new Float32Array(0);
  let px = new Float32Array(0);
  let py = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let dl = new Float32Array(0);
  let sz = new Float32Array(0);
  let col = new Uint8Array(0);

  function render(pull) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
    ctx.globalAlpha = 0.28 + 0.72 * clamp(pull * 1.5);

    for (let c = 0; c < PARTICLE_COLORS.length; c++) {
      ctx.fillStyle = PARTICLE_COLORS[c];
      for (let i = 0; i < n; i++) {
        if (col[i] !== c) continue;
        const s = sz[i];
        ctx.fillRect(px[i] - s / 2, py[i] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  function build(width, force = false) {
    if (destroyed || !ready || !width) return;
    if (!force && n && Math.abs(width - w) < 1) return;

    const cs = getComputedStyle(canvas);
    const mobile = width < 700;
    const rows = mobile ? lines.mobile : lines.desktop;

    const probe = document.createElement("canvas").getContext("2d");
    probe.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const widest = Math.max(...rows.map((r) => probe.measureText(r).width));
    if (!widest) return;

    const fontSize = Math.min(((width * 0.98) / widest) * 100, mobile ? 150 : 190);
    const lineH = fontSize;

    w = Math.round(width);
    h = Math.ceil(lineH * rows.length);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    wrapper.style.height = `${h}px`;
    canvas.width = Math.round((w + PAD * 2) * dpr);
    canvas.height = Math.round((h + PAD * 2) * dpr);
    canvas.style.width = `${w + PAD * 2}px`;
    canvas.style.height = `${h + PAD * 2}px`;

    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.font = `${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillStyle = "#fff";
    rows.forEach((r, i) => octx.fillText(r, w / 2, lineH * (i + 0.5)));
    const data = octx.getImageData(0, 0, w, h).data;

    const gap = mobile ? 4 : 5;
    const xs = [];
    const ys = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const sx = Math.min(w - 1, x + (gap >> 1));
        const sy = Math.min(h - 1, y + (gap >> 1));
        if (data[(sy * w + sx) * 4 + 3] > 140) {
          xs.push(x + gap / 2);
          ys.push(y + gap / 2);
        }
      }
    }

    const assembled = state.pull >= 1;
    n = xs.length;
    tx = Float32Array.from(xs);
    ty = Float32Array.from(ys);
    px = new Float32Array(n);
    py = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    dl = new Float32Array(n);
    sz = new Float32Array(n);
    col = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      dl[i] = (tx[i] / w) * 0.5;
      sz[i] = gap * (0.62 + Math.random() * 0.3);
      const r = Math.random();
      col[i] = r < 0.72 ? 0 : r < 0.92 ? 1 : 2;
      if (assembled) {
        px[i] = tx[i];
        py[i] = ty[i];
      } else {
        px[i] = Math.random() * w;
        py[i] = Math.random() * h;
      }
    }

    radius = clamp(w * 0.11, 90, 170);
    render(state.pull);
  }

  function tick(timeSec) {
    if (!n || !inView || reduced || destroyed) return;

    const t = timeSec * 1000;
    const rect = canvas.getBoundingClientRect();
    const mx = pointer.x - rect.left - PAD;
    const my = pointer.y - rect.top - PAD;
    const r2 = radius * radius;
    const pull = state.pull;

    for (let i = 0; i < n; i++) {
      const local = clamp((pull - dl[i]) / 0.5);
      const k = 0.085 * local;

    
      const gx = tx[i] + Math.sin(t * 0.0012 + i) * 0.8;
      const gy = ty[i] + Math.cos(t * 0.001 + i * 1.3) * 0.8;

      let ax = (gx - px[i]) * k;
      let ay = (gy - py[i]) * k;

      if (local < 1) {
        ax += (Math.random() - 0.5) * 0.06 * (1 - local);
        ay += (Math.random() - 0.5) * 0.06 * (1 - local);
      }

      const dx = px[i] - mx;
      const dy = py[i] - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = 1 - d / radius;
        const push = f * f * 4.5;
        ax += (dx / d) * push;
        ay += (dy / d) * push;
      }

      vx[i] = (vx[i] + ax) * 0.86;
      vy[i] = (vy[i] + ay) * 0.86;
      px[i] += vx[i];
      py[i] += vy[i];
    }

    render(pull);
  }

  function burst(clientX, clientY) {
    if (!n || reduced || destroyed) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - PAD;
    const y = clientY - rect.top - PAD;
    if (x < -40 || x > w + 40 || y < -40 || y > h + 40) return;

    const reach = radius * 1.8;
    for (let i = 0; i < n; i++) {
      const dx = px[i] - x;
      const dy = py[i] - y;
      const d = Math.hypot(dx, dy);
      if (d < reach && d > 0.01) {
        const f = 1 - d / reach;
        const imp = f * f * 26;
        vx[i] += (dx / d) * imp + (Math.random() - 0.5) * 6;
        vy[i] += (dy / d) * imp + (Math.random() - 0.5) * 6;
      }
    }
  }

  function init() {
    const cs = getComputedStyle(canvas);
    const spec = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const go = () => {
      ready = true;
      build(wrapper.clientWidth, true);
    };

    if (document.fonts && document.fonts.load) {
      document.fonts
        .load(spec, lines.desktop.join(" "))
        .catch(() => {})
        .finally(go);
    } else {
      go();
    }
  }

  return {
    state,
    init,
    build,
    tick,
    burst,
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setInView(v) {
      inView = v;
    },
    destroy() {
      destroyed = true;
    },
  };
};

const Magnet = ({ strength = 0.3, className = "", children, ...rest }) => (
  <div data-magnet={strength} className={className} {...rest}>
    {children}
  </div>
);

const Clock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      Local time {time || "--:--:--"} IST
    </span>
  );
};

const ContactRow = ({ row, copied, onCopy }) => {
  const Icon = row.icon;
  const externalProps = row.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <li className="relative">
      <span
        data-line
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[#6d8f63]/35"
      />

      <div className="group relative overflow-hidden">
        <span
          aria-hidden="true"
          className={`absolute inset-0 bg-[#39ff88] transition-[clip-path] duration-500 ${EASE_WIPE} [clip-path:inset(100%_0_0_0)] group-focus-within:[clip-path:inset(0)] group-hover:[clip-path:inset(0)]`}
        />

        <a
          data-row-link
          href={row.href}
          onClick={row.key === "email" ? handleEmailClick : undefined}
          {...externalProps}
          className="relative z-10 flex items-center gap-3 py-3 pl-2 pr-12 text-[#d6ffe6] transition-colors duration-300 focus-visible:outline-none group-hover:text-black sm:gap-4 sm:pl-3 sm:pr-14"
        >
          <span className="flex w-4 shrink-0 items-center gap-2 font-mono text-xs text-[#6d8f63] transition-colors duration-300 group-hover:text-black/70 sm:w-24">
            <Icon
              size={14}
              className="shrink-0 text-[#39ff88] transition-colors duration-300 group-hover:text-black"
            />
            <span className="sr-only sm:not-sr-only">{row.label}</span>
          </span>
          <span className="relative block min-w-0 flex-1 overflow-hidden whitespace-nowrap text-[15px] font-medium leading-[1.6] tracking-tight sm:text-base">
            <span
              className={`block truncate transition-transform duration-500 ${EASE_WIPE} group-hover:-translate-y-full`}
            >
              {row.value}
            </span>
            <span
              aria-hidden="true"
              className={`absolute left-0 top-full block transition-transform duration-500 ${EASE_WIPE} group-hover:-translate-y-full`}
            >
              {row.action}
            </span>
          </span>
        </a>

        {row.copy ? (
          <button
            data-copy
            type="button"
            onClick={() => onCopy(row.copy, row.key)}
            aria-label={`Copy ${row.label.toLowerCase()}`}
            className="absolute bottom-0 right-2 top-0 z-20 my-auto flex h-8 w-8 items-center justify-center rounded-full border border-[#6d8f63]/50 text-[#d6ffe6] transition-colors duration-300 hover:!bg-black hover:!text-[#39ff88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39ff88] group-hover:border-black/40 group-hover:text-black sm:right-3"
          >
            {copied === row.key ? <Check size={14} /> : <Copy size={14} />}
          </button>
        ) : (
          <span
            data-copy
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-2 top-0 z-20 my-auto flex h-8 w-8 items-center justify-center text-[#6d8f63] transition-colors duration-300 group-hover:text-black sm:right-3"
          >
            <ArrowUpRight size={16} />
          </span>
        )}
      </div>
    </li>
  );
};

const Contact = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const rowsRef = useRef(null);
  const footerRef = useRef(null);
  const copyTimer = useRef(null);

  const [copied, setCopied] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = headlineRef.current;
    const canvas = canvasRef.current;
    const track = trackRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!section || !wrapper || !canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const text = createParticleText(canvas, wrapper, HEADLINE, reduced);
    const resize = new ResizeObserver(() => text.build(wrapper.clientWidth));
    resize.observe(wrapper);
    text.init();

    if (reduced) {
      return () => {
        resize.disconnect();
        text.destroy();
      };
    }

    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        text.setInView(inView);
      },
      { rootMargin: "100px" },
    );
    io.observe(section);

    let tickFn = null;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top 65%", once: true },
          defaults: { ease: "power3.out" },
        })
        .from("[data-top]", { opacity: 0, y: -12, duration: 0.7 })
        .to(text.state, { pull: 1, duration: 2.8, ease: "power2.inOut" }, 0.1)
        .from(
          "[data-blurb] > *",
          { y: 24, opacity: 0, duration: 0.8, stagger: 0.12 },
          0.9,
        )
        .from(
          "[data-cta]",
          { scale: 0, rotation: -40, duration: 1.3, ease: "elastic.out(1, 0.55)" },
          1.1,
        )
        .from("[data-marquee]", { opacity: 0, duration: 1 }, 1.2);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rowsRef.current,
            start: "top 88%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        })
        .from(
          "[data-line]",
          { scaleX: 0, transformOrigin: "left center", duration: 1.1, stagger: 0.07, ease: "expo.out" },
          0,
        )
        .from(
          "[data-row-link]",
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.07 },
          0.15,
        )
        .from(
          "[data-copy]",
          { opacity: 0, scale: 0.6, duration: 0.6, stagger: 0.07 },
          0.5,
        );

      gsap.from(footerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 98%",
          once: true,
        },
      });

      let x = 0;
      let dir = 1;
      let targetV = 0;
      let smooth = 0;

      const setTrackX = gsap.quickSetter(track, "xPercent");
      const setTrackSkew = gsap.quickSetter(track, "skewX", "deg");
      const ringTween = gsap.to(ring, {
        rotation: 360,
        duration: 16,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          targetV = self.getVelocity();
          if (targetV) dir = Math.sign(targetV);
        },
      });

      tickFn = (time, deltaTime) => {
        text.tick(time);
        if (!inView) return;

        const dt = Math.min(deltaTime, 64) / 1000;
        targetV *= 0.92;
        smooth += (targetV - smooth) * 0.12;

        x -= dir * (1.8 + Math.abs(smooth) * 0.012) * dt;
        if (x <= -50) x += 50;
        if (x > 0) x -= 50;

        setTrackX(x);
        setTrackSkew(clamp(-smooth / 350, -9, 9));
        ringTween.timeScale(1 + Math.min(Math.abs(smooth) / 600, 5));
      };
      gsap.ticker.add(tickFn);
    }, section);

    const glowX = gsap.quickTo(glow, "x", { duration: 0.8, ease: "power3" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.8, ease: "power3" });
    const glowO = gsap.quickTo(glow, "opacity", { duration: 0.6 });

    const magnets = Array.from(section.querySelectorAll("[data-magnet]")).map(
      (el) => ({
        el,
        strength: parseFloat(el.dataset.magnet) || 0.3,
        x: gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.4)" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.4)" }),
      }),
    );

    const resetMagnets = () =>
      magnets.forEach((m) => {
        m.x(0);
        m.y(0);
      });

    const onMove = (e) => {
      text.setPointer(e.clientX, e.clientY);
      if (e.pointerType === "touch") return;

      const r = section.getBoundingClientRect();
      glowX(e.clientX - r.left - 320);
      glowY(e.clientY - r.top - 320);
      glowO(1);

      magnets.forEach((m) => {
        const rect = m.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2 - gsap.getProperty(m.el, "x");
        const cy = rect.top + rect.height / 2 - gsap.getProperty(m.el, "y");
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = Math.max(rect.width, rect.height) * 0.9 + 40;

        if (Math.hypot(dx, dy) < reach) {
          m.x(dx * m.strength);
          m.y(dy * m.strength);
        } else {
          m.x(0);
          m.y(0);
        }
      });
    };

    const onLeave = () => {
      text.setPointer(-9999, -9999);
      glowO(0);
      resetMagnets();
    };

    const onDown = (e) => text.burst(e.clientX, e.clientY);

    const onUp = (e) => {
      if (e.pointerType !== "mouse") text.setPointer(-9999, -9999);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointerup", onUp);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointerup", onUp);
      if (tickFn) gsap.ticker.remove(tickFn);
      io.disconnect();
      resize.disconnect();
      text.destroy();
      ctx.revert();
    };
  }, []);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleCopy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }

    setCopied(key);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(""), 1800);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black text-[#d6ffe6]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={DOT_GRID} />
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-[640px] w-[640px] rounded-full opacity-0"
          style={CURSOR_GLOW}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
     
        <div
          data-top
          className="flex items-center justify-between gap-4 font-mono text-[11px] text-[#6d8f63] sm:text-xs"
        >
         
          <Clock />
        </div>

      
        <div
          ref={headlineRef}
          className="relative mt-10 h-[24vw] sm:mt-14 sm:h-[11vw]"
        >
          <h2 className="sr-only">Let’s talk</h2>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="lemonmilk-font pointer-events-none absolute font-medium"
            style={{ left: -PAD, top: -PAD }}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-8 sm:mt-16 md:flex-row md:items-end">
          <div data-blurb className="max-w-md">
            <p className="text-base leading-relaxed text-[#d6ffe6] sm:text-lg">
              Got a product to ship or an idea that needs building?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#6d8f63] sm:text-base">
              I build full stack web apps, with React on the front and Node and
              MongoDB behind it. Tell me what you’re making.
            </p>
          </div>

          <Magnet
            data-cta
            strength={0.35}
            className="self-end md:self-auto"
          >
            <a
              href={MAILTO_URL}
              onClick={handleEmailClick}
              aria-label="Start a conversation by email"
              className="group relative flex h-28 w-28 items-center justify-center rounded-full bg-[#39ff88] text-black shadow-[0_0_50px_rgba(57,255,136,0.25)] transition-[background-color,transform,box-shadow] duration-300 hover:scale-105 hover:bg-[#d6ffe6] hover:shadow-[0_0_70px_rgba(57,255,136,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39ff88] sm:h-32 sm:w-32"
            >
              <svg
                ref={ringRef}
                viewBox="0 0 200 200"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <path
                    id="contact-ring"
                    d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                  />
                </defs>
                <text
                  fill="currentColor"
                  fontSize="14"
                  className="font-mono font-semibold"
                >
                  <textPath
                    href="#contact-ring"
                    textLength={485}
                    lengthAdjust="spacing"
                  >
                    {
                      "START A CONVERSATION\u00A0•\u00A0START A CONVERSATION\u00A0•\u00A0"
                    }
                  </textPath>
                </text>
              </svg>

              <ArrowUpRight
                size={32}
                strokeWidth={1.6}
                className="relative transition-transform duration-500 group-hover:rotate-45"
              />
            </a>
          </Magnet>
        </div>

        <div
          data-marquee
          className="relative mt-14 overflow-hidden border-y border-[#6d8f63]/25 py-4 sm:mt-20"
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? "true" : undefined}
                className="flex shrink-0 items-center"
              >
                {MARQUEE.map((item) => (
                  <div key={item.text} className="flex items-center">
                    <span
                      className="lemonmilk-font whitespace-nowrap text-[clamp(1.6rem,4.2vw,3.25rem)] font-medium uppercase leading-none"
                      style={item.outline ? OUTLINE_TEXT : { color: "#d6ffe6" }}
                    >
                      {item.text}
                    </span>
                    <span className="mx-6 h-2.5 w-2.5 shrink-0 bg-[#39ff88] sm:mx-8 sm:h-3 sm:w-3" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          ref={rowsRef}
          className="mt-10 grid gap-x-12 gap-y-6 sm:mt-14 lg:grid-cols-2 lg:gap-y-0"
        >
          {[ROWS, SOCIAL_ROWS].map((group, i) => (
            <ul key={i}>
              {group.map((row) => (
                <ContactRow
                  key={row.key}
                  row={row}
                  copied={copied}
                  onCopy={handleCopy}
                />
              ))}
              <li aria-hidden="true" className="relative h-px">
                <span
                  data-line
                  className="absolute inset-0 bg-[#6d8f63]/35"
                />
              </li>
            </ul>
          ))}
        </div>

        <footer
          ref={footerRef}
          className="mt-10 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#39ff88] shadow-[0_0_10px_#39ff88]" />
            <span className="lemonmilk-font text-sm font-semibold tracking-wider text-[#d6ffe6]">
              RAHUL RAIKWAR
            </span>
            <span className="text-xs text-[#6d8f63]">
              © {new Date().getFullYear()}
            </span>
          </div>

          <Magnet strength={0.3}>
            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#6d8f63]/35 px-4 py-2 font-mono text-[11px] text-[#6d8f63] transition-colors duration-300 hover:border-[#39ff88] hover:text-[#39ff88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39ff88]"
            >
              Back to top
              <ArrowUp
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </Magnet>
        </footer>
      </div>
    </section>
  );
};

export default Contact;