import { useEffect, useState } from "react";

const LINKS = [
  ["experience", "Experience"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["about", "About"],
];

// Floating navigation. The link for the section you're in is highlighted; after scrolling it moves to the right edge.
export default function Dock() {
  const [active, setActive] = useState("");
  const [side, setSide] = useState(false); // once you scroll, the dock hops to the right edge (wide screens)
  useEffect(() => {
    const update = () => {
      const line = innerHeight * 0.4;
      let current = "";
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < line) current = id;
      }
      setActive(current);
      setSide(scrollY > 120);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <nav className="dock" data-pos={side ? "side" : "bottom"} aria-label="Sections">
      {LINKS.map(([id, label]) => (
        <a key={id} href={`#${id}`} aria-current={active === id}>
          <span className="lb" data-t={label}>
            <span>{label}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
