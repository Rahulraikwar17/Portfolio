import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "rahulraikwae350@gmail.com";
const PHONE_DISPLAY = "+91 88178 92814";
const PHONE_LINK = "+918817892814";

const FACE_IMAGE = "/contact-face2.jpg";

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

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Rahulraikwar17",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rahul-raikwar-7a9674306/",
    icon: FaLinkedinIn,
  },
  {
    label: "Discord",
    href: "https://discord.com/users/1004779116253425789",
    icon: BsDiscord,
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: FaWhatsapp,
  },
];

const createRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const TWO_PI = Math.PI * 2;
const STAR_WHITE = "#ffffff";
const STAR_COOL = "#a9bcff";

const buildStars = (count) => {
  const random = createRandom(11);
  const bell = () => (random() + random() + random() + random() - 2) / 2;

  const stars = [];

  while (stars.length < count) {
    const clustered = stars.length % 5 !== 0;
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

const STARS = buildStars(260);

const FACE_MASK = {
  maskImage:
    "radial-gradient(ellipse 55% 58% at 50% 48%, #000 45%, transparent 100%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 55% 58% at 50% 48%, #000 45%, transparent 100%)",
};

const CARD_GLOW =
  "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.07), transparent 65%)";

const PRIMARY_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-opacity duration-300 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const GHOST_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/80 transition-colors duration-300 hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

const handleCardMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();

  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);

  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

const handleEmailClick = (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

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

const CopyButton = ({ copied, onCopy, label }) => (
  <button
    type="button"
    onClick={onCopy}
    aria-label={`Copy ${label}`}
    className={GHOST_BUTTON}
  >
    {copied ? <Check size={13} /> : <Copy size={13} />}
    <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
  </button>
);

const ContactCard = ({ icon: Icon, label, value, children }) => (
  <article
    onMouseMove={handleCardMove}
    className="group/card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-white/25"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
      style={{ background: CARD_GLOW }}
    />

    <div className="relative flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70">
          <Icon size={15} />
        </span>

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            {label}
          </p>

          <p className="break-all text-sm text-white md:text-base">{value}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  </article>
);

const StarField = () => {
  const canvasRef = useRef(null);

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

      for (const star of STARS) {
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
};

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const cardsRef = useRef(null);
  const footerRef = useRef(null);
  const copyTimer = useRef(null);

  const [copied, setCopied] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(textRef.current, { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(
          cardsRef.current.children,
          {
            y: 24,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          footerRef.current.children,
          {
            y: 16,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
          },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    return () => clearTimeout(copyTimer.current);
  }, []);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement("textarea");

      field.value = text;
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

    copyTimer.current = setTimeout(() => {
      setCopied("");
    }, 1800);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#090807] text-white"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-[-10%] top-[10%] h-[560px] w-[560px] rounded-full bg-white/[0.045] blur-[130px]" />

        <div className="absolute bottom-[-15%] left-[-8%] h-[420px] w-[420px] rounded-full bg-[#4a64d8]/10 blur-[130px]" />

        <StarField />

        {!imageFailed && (
          <img
            src={FACE_IMAGE}
            alt=""
            draggable={false}
            onError={() => setImageFailed(true)}
            className="absolute bottom-0 right-[2%] hidden h-[88%] w-auto max-w-none opacity-70 mix-blend-screen md:block"
            style={FACE_MASK}
          />
        )}
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-between px-6 py-10 sm:px-8 md:px-10 lg:px-14 xl:px-16">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">
            Contact
          </p>

          <p className="font-mono text-[10px] text-white/30">
            AVAILABLE FOR WORK
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center py-14 md:py-16">
          {/* Heading */}
          <div ref={titleRef}>
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
              Have a project in mind?
            </p>

            <h2 className="text-[20vw] font-semibold leading-[0.82] tracking-[-0.07em] transition-colors duration-300 hover:text-[#FF6B3D] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10rem]">
              LET&apos;S
            </h2>

            <h2 className="text-[20vw] font-semibold leading-[0.82] tracking-[-0.07em] transition-colors duration-300 hover:text-[#FF6B3D] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10rem]">
              TALK<span className="text-white/25">.</span>
            </h2>
          </div>

          {/* Description */}
          <p
            ref={textRef}
            className="mt-10 max-w-xl text-sm leading-7 text-white/45 md:text-base"
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something interesting.
          </p>

          {/* Contact Cards */}
          <div
            ref={cardsRef}
            className="mt-8 grid w-full max-w-[760px] gap-4 sm:grid-cols-2"
          >
            <ContactCard icon={Mail} label="Email" value={EMAIL}>
              <a
                href={MAILTO_URL}
                onClick={handleEmailClick}
                className={PRIMARY_BUTTON}
              >
                Send email
                <ArrowUpRight size={13} />
              </a>

              <CopyButton
                label="email address"
                copied={copied === "email"}
                onCopy={() => handleCopy(EMAIL, "email")}
              />
            </ContactCard>

            <ContactCard icon={Phone} label="Phone" value={PHONE_DISPLAY}>
              <a href={`tel:${PHONE_LINK}`} className={PRIMARY_BUTTON}>
                Call
                <ArrowUpRight size={13} />
              </a>

              <CopyButton
                label="phone number"
                copied={copied === "phone"}
                onCopy={() => handleCopy(PHONE_LINK, "phone")}
              />
            </ContactCard>
          </div>
        </div>

        {/* Footer */}
        <div
          ref={footerRef}
          className="flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
            © {new Date().getFullYear()} Rahul Raikwar
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
          >
            Back to top
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
