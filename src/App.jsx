import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
import Dock from "./components/Dock";
import ThemeToggle from "./components/ThemeToggle";
import Background from "./components/Background";
import site from "./content";

// Loaded only at #/admin, so visitors never download it.
const Admin = lazy(() => import("./admin/Admin"));

export const asset = (path) =>
  import.meta.env.BASE_URL + path.replace(/^\.?\//, "");

export const image = (path) => asset(`images/${path}`);

export default function App() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const onHash = () => setHash(location.hash);
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  // At the very top, the Experience peek under the hero is blurred; the first scroll brings it into focus (see #experience in index.css).
  useEffect(() => {
    const update = () => document.documentElement.classList.toggle("scrolled", scrollY > 30);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  if (hash.startsWith("#/admin")) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <>
      <Background />
      <Dock />
      <ThemeToggle />
      <main id="top">
        <Hero />
        <Experience />
        <Projects />
        <About />
      </main>
      <footer>
        © {new Date().getFullYear()} {site.profile.fullName}
      </footer>
    </>
  );
}
