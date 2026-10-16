import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";

export const asset = (path) =>
  import.meta.env.BASE_URL + path.replace(/^\.?\//, "");

export default function App() {
  return (
    <>
      <nav className="nav">
        <a href="#top" className="brand">
          <img src={asset("images/Memoji_1.png")} alt="" width="28" height="28" />
          Jason
        </a>
        <div>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </div>
      </nav>
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
