import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
import ThemeToggle from "./components/ThemeToggle";

export const asset = (path) =>
  import.meta.env.BASE_URL + path.replace(/^\.?\//, "");

export default function App() {
  return (
    <>
      <header className="nav">
        <a href="#top">Jason Wu</a>
        <nav>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <ThemeToggle />
        </nav>
      </header>
      <main id="top">
        <Hero />
        <Experience />
        <Projects />
        <About />
      </main>
      <footer>© {new Date().getFullYear()} Chia-Hsiang (Jason) Wu</footer>
    </>
  );
}
