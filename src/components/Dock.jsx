import { useEffect, useRef, useState } from "react";

const LINKS = [
  ["player", "Player", "Top"], // hidden below 1280px (the bottom dock keeps its four)
  ["experience", "Quests", "Experience"],
  ["projects", "Inventory", "Projects"],
  ["education", "Training", "Education"],
  ["about", "Player Log", "About"],
];

// Floating navigation. The link for the section you're in is highlighted; after scrolling it moves to the right edge.
export default function Dock() {
  const [active, setActive] = useState("");
  const nav = useRef(null);
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
      // fill each button (0..1, in 8 steps) as the section it links to scrolls past the line; everything is full at the page end
      const end = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      let c = -0.5; // fisheye focus: sections passed, so it glides button to button with the scroll (--d: distance from it; --i: its index, to centre it in the side column)
      LINKS.forEach(([id], i) => {
        const el = document.getElementById(id);
        const f = el ? (end ? 1 : Math.min(1, Math.max(0, (line - el.getBoundingClientRect().top) / el.offsetHeight))) : 0;
        c += f;
        nav.current.children[i].style.setProperty("--f", Math.round(f * 8) / 8);
      });
      c = Math.min(LINKS.length - 1, Math.max(0, c));
      nav.current.style.setProperty("--i", c);
      LINKS.forEach((_, i) => { nav.current.children[i].style.setProperty("--d", Math.abs(i - c)); nav.current.children[i].style.setProperty("--s", i - c); });
      setSide(scrollY > 120);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <nav ref={nav} className="dock" data-pos={side ? "side" : "bottom"} aria-label="Sections">
      {LINKS.map(([id, label, plain]) => (
        <a key={id} href={`#${id}`} title={plain} aria-current={active === id}>
          <span className="lb" data-t={label}>
            <span>{label}</span>
          </span>
        </a>
      ))}
    </nav>
  );
}
