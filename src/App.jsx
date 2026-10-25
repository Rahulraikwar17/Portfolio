import React, { useLayoutEffect } from "react";
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

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
    });
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

  return (
    <div className="w-full min-h-screen bg-black">
      <CustomCursor />

      <Navbar />

      <main>
        <HeroSection />
        <About />
        <Marquee />

        <Skills />
        <Projects />
        <Contact />
        <BeeFlyer start="top-left" />
      </main>
    </div>
  );
};

export default App;
