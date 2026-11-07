import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import About from "./components/About";
import CustomCursor from "./components/CustomCursor";
import Contact from "./components/Contact";
import Marquee from "./components/marquee";
import Loader from "./components/Loader.jsx";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = "/me2.png";

const scrollToTop = () => {
  window.scrollTo(0, 0);
  window.lenis?.scrollTo(0, { immediate: true, force: true });
};

const App = () => {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
    });

    // Scrolling stays locked until the loader has fully left the screen.
    lenis.stop();
    window.lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  const handleReveal = () => {
    scrollToTop();
    setReady(true);
  };

  const handleLoaderComplete = () => {
    scrollToTop();
    window.lenis?.start();
    ScrollTrigger.refresh();
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <Loader
        images={[HERO_IMAGE]}
        onReveal={handleReveal}
        onComplete={handleLoaderComplete}
      />
      <CustomCursor />

      <Navbar />

      <main>
        <HeroSection ready={ready} />
        <About />
        <Marquee />

        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
};

export default App;
