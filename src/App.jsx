import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
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
      <header className="nav">
        <a href="#top">{site.profile.name}</a>
        <nav>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <ThemeToggle />
        </nav>
        <span className="runner" aria-hidden="true">
          <img src={image(site.profile.avatar)} alt="" />
        </span>
      </header>
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
