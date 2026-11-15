import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const links = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const OVERLAY_BG = "radial-gradient(90% 70% at 60% 35%, #0b1a10 0%, #000000 70%)";

const Logo = () => (
  <video
    src="/me.mp4"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    aria-hidden="true"
    className="h-9 w-9 rounded-full border object-cover"
  />
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");

  const pillRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayLinksRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(pillRef.current, {
        y: -80,
        opacity: 0,
        duration: 1.1,
        delay: 0.5,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      if (y < 80) setHidden(false);
      else if (d > 6) setHidden(true);
      else if (d < -3) setHidden(false);
      if (Math.abs(d) > 3) last = y;
    };

    const onWheel = (e) => {
      if (e.deltaY < -2) setHidden(false);
      else if (e.deltaY > 6 && window.scrollY > 80) setHidden(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) window.lenis?.stop();
    else window.lenis?.start();

    const overlay = overlayRef.current;
    if (!overlay) return;

    if (open) {
      gsap.set(overlay, { display: "flex" });
      gsap.to(overlay, {
        clipPath: "circle(150% at 90% 5%)",
        duration: 0.8,
        ease: "power3.inOut",
      });
      gsap.fromTo(
        overlayLinksRef.current,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.25,
          ease: "expo.out",
        },
      );
    } else {
      gsap.to(overlay, {
        clipPath: "circle(0% at 90% 5%)",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (e, id) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);

    setTimeout(
      () => {
        const lenis = window.lenis;

        if (id === "home") {
          lenis
            ? lenis.scrollTo(0, { duration: 1.5 })
            : window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const el = document.getElementById(id);
        if (!el) {
          console.warn(`Section id="${id}" not found`);
          return;
        }

        lenis
          ? lenis.scrollTo(el, { duration: 1.5 })
          : el.scrollIntoView({ behavior: "smooth" });
      },
      wasOpen ? 350 : 0,
    );
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999] hidden flex-col justify-center gap-2 px-8 md:hidden"
        style={{ background: OVERLAY_BG, clipPath: "circle(0% at 90% 5%)" }}
      >
        {links.map((l, i) => (
          <div key={l.id} className="overflow-hidden">
            <a
              ref={(el) => {
                overlayLinksRef.current[i] = el;
              }}
              href={`#${l.id}`}
              onClick={(e) => goTo(e, l.id)}
              className={`lemonmilk-font block py-1 text-4xl font-medium tracking-[-0.02em] transition-colors ${
                active === l.id
                  ? "text-[#39ff88]"
                  : "text-[#d6ffe6] hover:text-[#39ff88]"
              }`}
            >
              {l.label}
            </a>
          </div>
        ))}
      </div>

      <nav
        className={`fixed inset-x-0 top-0 z-[1000] px-4 pt-4 font-['Space_Grotesk',sans-serif] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          hidden && !open ? "-translate-y-[170%]" : "translate-y-0"
        }`}
      >
        <div
          ref={pillRef}
          className="relative mx-auto flex w-full items-center justify-between overflow-hidden rounded-full border border-[#6d8f63]/35 bg-black/60 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 md:w-fit md:gap-2 md:pr-2"
        >
          <a
            href="#home"
            onClick={(e) => goTo(e, "home")}
            aria-label="Rahul Raikwar, home"
            className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
          >
            <Logo />
          </a>

          <span
            className="hidden h-6 w-px bg-[#6d8f63]/35 md:block"
            aria-hidden="true"
          />

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => goTo(e, l.id)}
                  className={`rounded-full px-4 py-2 font-mono text-xs transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39ff88] ${
                    active === l.id
                      ? "bg-[#39ff88]/10 text-[#39ff88]"
                      : "text-[#6d8f63] hover:text-[#d6ffe6]"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6d8f63]/50 text-[#d6ffe6] transition-colors duration-300 hover:border-[#39ff88] hover:text-[#39ff88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#39ff88]"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <div className="flex w-5 flex-col gap-[5px]">
                <span
                  className={`h-[1.5px] bg-current transition-transform duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-opacity duration-300 ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`h-[1.5px] bg-current transition-transform duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;