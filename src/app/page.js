import Scene from "@/components/canvas/Scene";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Journey from "@/components/sections/Journey";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      {/* Fixed 3D canvas behind everything */}
      <Scene />

      {/* Site content sits above canvas */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Navbar />

        <main>
          <Hero />
          <About />
          <Skills />
          <Journey />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}