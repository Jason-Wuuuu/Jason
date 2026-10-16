import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["about", "About"],
];

// Floating navigation. The link for the section you're in is highlighted.
export default function Dock() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const update = () => {
      const line = innerHeight * 0.4;
      let current = "";
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < line) current = id;
      }
      setActive(current);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <nav className="dock" aria-label="Sections">
      {LINKS.map(([id, label]) => (
        <a key={id} href={`#${id}`} aria-current={active === id}>
          {label}
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
