import { lazy, Suspense, useEffect, useState } from "react";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import About from "./components/About";
import Dock from "./components/Dock";
import ProgressBar from "./components/ProgressBar";
import ThemeToggle from "./components/ThemeToggle";
import Windows from "./components/Windows";
import Background from "./components/Background";
import site from "./content";

// Loaded only at #/admin-LFG, so visitors never download it.
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

  // At the very top, the Experience peek under the hero is blurred; the first scroll brings it into focus (see #experience .timeline in index.css).
  useEffect(() => {
    const update = () => document.documentElement.classList.toggle("scrolled", scrollY > 30);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  // Slight fisheye / scroll-barrel: rows (a project's title, description, screenshots and skill tree each count as one: the whole project is too tall) shrink toward the top and bottom of the screen. No 3D tilt: with `perspective`, Chrome hit-tests a tilted row away from where it is drawn, so hover and clicks missed it.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const h = innerHeight;
      // A block is several pieces that scale together about one shared centre, so their edges stay lined up: a project's title row, description and links; its screenshots, dots and caption.
      const block = (parts) => {
        parts = parts.filter((el) => el.offsetParent);
        if (!parts.length) return;
        parts.forEach((el) => (el.style.scale = ""));
        const rs = parts.map((el) => el.getBoundingClientRect());
        const cx = (Math.min(...rs.map((r) => r.left)) + Math.max(...rs.map((r) => r.right))) / 2, cy = (Math.min(...rs.map((r) => r.top)) + Math.max(...rs.map((r) => r.bottom))) / 2;
        const d = Math.max(-1, Math.min(1, (cy - h / 2) / (h / 2))); // -1 top edge .. 1 bottom edge
        parts.forEach((el, i) => { el.style.transformOrigin = `${cx - rs[i].left}px ${cy - rs[i].top}px`; el.style.scale = 1 - 0.12 * d * d; });
      };
      for (const proj of document.querySelectorAll("main .proj")) {
        block([proj.querySelector(":scope > summary"), ...proj.querySelectorAll(":scope > .body > p:not(.cap), :scope > .body > .links:not(.after)")]);
        block([...proj.querySelectorAll(":scope > .body > :is(.gal, .bars, .cap)")]);
      }
      for (const el of document.querySelectorAll("main section:not(.hero) :is(h2, .timeline > li, .proj .body > :not(p, .links, .gal, .bars), .about > *)")) {
        if (el.offsetHeight > h * 0.9) { el.style.scale = ""; continue; } // a row about as tall as the screen has its centre off-screen, so it would stay shrunk and its top edge slide down by 6% of its height. Judged by layout height: the scaled box is shorter, which made the verdict depend on scroll history
        const r = el.getBoundingClientRect();
        const d = Math.max(-1, Math.min(1, (r.top + r.height / 2 - h / 2) / (h / 2)));
        el.style.scale = 1 - 0.12 * d * d;
      }
    };
    const queue = () => raf || (raf = requestAnimationFrame(apply));
    apply();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => { removeEventListener("scroll", queue); removeEventListener("resize", queue); cancelAnimationFrame(raf); };
  }, [hash]);

  if (hash === "#/admin-LFG") {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  return (
    <>
      <a className="skip" href="#top">Skip to content</a>
      <Background />
      <Dock />
      <ProgressBar />
      <ThemeToggle />
      <Windows />
      <main id="top">
        <Hero />
        <Experience />
        <Projects />
        <Experience id="education" title="Training" sub="Education" items={site.education} />
        <About />
      </main>
      <footer>
        © {new Date().getFullYear()} {site.profile.name}
      </footer>
    </>
  );
}
