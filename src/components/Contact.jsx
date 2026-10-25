import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import LiquidText from "./LiquidText";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "rahulraikwae350@gmail.com";
const PHONE_DISPLAY = "+91 88178 92814";
const PHONE_LINK = "+918817892814";

const contactItems = [
  {
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_LINK}`,
    icon: Phone,
  },
];

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
];

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const detailsRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          textRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          detailsRef.current.children,
          {
            y: 25,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          linksRef.current.children,
          {
            y: 25,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#090807] text-white"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between px-6 py-12 md:px-12 lg:px-16">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/40">
            Contact
          </p>

          <p className="font-mono text-[10px] text-white/30">
            AVAILABLE FOR WORK
          </p>
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col justify-center py-10">
          <div ref={titleRef}>
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-white/35">
              Have a project in mind?
            </p>

            <LiquidText>
              <h2 className="text-[18vw] font-semibold leading-[0.75] tracking-[-0.07em] hover:text-[#FF6B3D] md:text-[12vw]">
                LET&apos;S
              </h2>

              <h2 className="text-[18vw] font-semibold leading-[0.75] tracking-[-0.07em] hover:text-[#FF6B3D] md:text-[12vw]">
                TALK<span className="text-white/25">.</span>
              </h2>
            </LiquidText>
          </div>

          <p
            ref={textRef}
            className="mt-12 max-w-md text-sm leading-7 text-white/45 md:text-base"
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something interesting.
          </p>

          {/* Contact details */}
          <div
            ref={detailsRef}
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-x-14 sm:gap-y-6"
          >
            {contactItems.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="group flex w-fit flex-col gap-2"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  {label}
                </span>

                <span className="flex items-center gap-3 border-b border-white/20 pb-2 text-sm transition-all duration-300 group-hover:border-white md:text-base">
                  <Icon size={15} className="text-white/40" />

                  <span>{value}</span>

                  <ArrowUpRight
                    size={15}
                    className="text-white/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          ref={linksRef}
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
            © 2026 Rahul Raikwar
          </p>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
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