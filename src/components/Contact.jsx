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
    className="group/card relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-white/25 sm:bg-white/[0.02] sm:p-5 sm:backdrop-blur-none"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
      style={{ background: CARD_GLOW }}
    />

    <div className="relative flex flex-col gap-4 sm:gap-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70">
          <Icon size={15} />
        </span>

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            {label}
          </p>

          <p className="break-all text-[13px] text-white sm:text-sm md:text-base">
            {value}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  </article>
);

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
      className="relative min-h-[100svh] w-full overflow-hidden text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute right-[-30%] top-[5%] h-[320px] w-[320px] rounded-full bg-white/[0.045] blur-[100px] sm:right-[-10%] sm:top-[10%] sm:h-[560px] sm:w-[560px] sm:blur-[130px]" />

        <div className="absolute bottom-[-10%] left-[-20%] h-[280px] w-[280px] rounded-full bg-[#4a64d8]/10 blur-[100px] sm:bottom-[-15%] sm:left-[-8%] sm:h-[420px] sm:w-[420px] sm:blur-[130px]" />

        {!imageFailed && (
          <img
            src={FACE_IMAGE}
            alt=""
            draggable={false}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute bottom-0 right-[-18%] h-[52%] w-auto max-w-none opacity-45 mix-blend-screen min-[480px]:right-[-8%] min-[480px]:h-[60%] min-[480px]:opacity-55 sm:right-[-4%] sm:h-[70%] sm:opacity-60 md:right-[2%] md:h-[88%] md:opacity-70"
            style={FACE_MASK}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#090807]/70 via-[#090807]/20 to-[#090807]/60 md:hidden" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-14 xl:px-16">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 sm:pb-5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/40 sm:tracking-[0.45em]">
            Contact
          </p>

          <p className="font-mono text-[9px] text-white/30 sm:text-[10px]">
            AVAILABLE FOR WORK
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 sm:py-12 md:py-16">
          <div ref={titleRef}>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:mb-5 sm:text-xs sm:tracking-[0.4em]">
              Have a project in mind?
            </p>

            <h2 className="text-[22vw] font-semibold leading-[0.85] tracking-[-0.07em] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10rem]">
              LET&apos;S
            </h2>

            <h2 className="text-[22vw] font-semibold leading-[0.85] tracking-[-0.07em] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] xl:text-[10rem]">
              TALK<span className="text-[#092369]">.</span>
            </h2>
          </div>

          <p
            ref={textRef}
            className="mt-6 max-w-xl text-[13px] leading-6 text-white/60 sm:mt-8 sm:text-sm sm:leading-7 sm:text-white/45 md:mt-10 md:text-base"
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something interesting.
          </p>

          <div
            ref={cardsRef}
            className="mt-6 grid w-full max-w-[760px] grid-cols-1 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2"
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

        <div
          ref={footerRef}
          className="flex flex-col items-center gap-5 border-t border-white/10 pt-5 sm:gap-6 sm:pt-6 md:flex-row md:justify-between"
        >
          <div className="flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/30 sm:tracking-[0.3em]">
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
