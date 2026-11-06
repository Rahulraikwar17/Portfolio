import React, { useEffect, useLayoutEffect, useState } from "react";
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

import BeeFlyer from "./components/BeeFlyer";
import Marquee from "./components/marquee";
import Loader from "./components/Loader.jsx";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = "/me2.png";

const App = () => {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
    });
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

  useEffect(() => {
    if (!ready) return;
    window.lenis?.start();
    ScrollTrigger.refresh();
  }, [ready]);

  return (
    <div className="w-full min-h-screen bg-black">
      <Loader images={[HERO_IMAGE]} onDone={() => setReady(true)} />
      <CustomCursor />

      <Navbar />

      <main>
        <HeroSection ready={ready} />
        <About />
        <Marquee />

        <Skills />
        <Projects />
        <Contact />
        <BeeFlyer spawnDelay={5000} startX={0.2} startY={0.2} />
      </main>
    </div>
  );
};

export default App;