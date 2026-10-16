import { useEffect, useRef } from "react";

// A pixel cat walking along a lane at the bottom of the screen: your scroll progress. It walks while you scroll
// (facing the way you're going) and sits still otherwise. Drawn as a 2-frame sprite sheet.
const W = 16, H = 10; // sprite size before the 1px outline
const COLORS = { W: "#ffffff", P: "#f0a030", E: "#151517", N: "#f2a6a6", O: "#2b2b2e" };
const BODY = [
  "..........W...W.",
  "..........WWWWW.",
  "..........WWWEW.",
  "PPPPPWWWWWWWWWWN",
  "P.PPWWWWWWWWWWW.",
  "PPWWWWWWWWWWWWW.",
  ".PWWWWWWWWWWWW..",
  "..WWWWWWWWWWWW..",
];
const LEGS = [
  ["...W.W....W.W...", "...W.W....W.W..."],
  ["..W...W..W...W..", "..W...W..W...W.."],
];

function sheet() {
  const fw = W + 2, fh = H + 2;
  const canvas = document.createElement("canvas");
  canvas.width = fw * 2;
  canvas.height = fh;
  const ctx = canvas.getContext("2d");
  LEGS.forEach((legs, f) => {
    const rows = [...BODY, ...legs];
    const at = (x, y) => (rows[y]?.[x] && rows[y][x] !== "." ? rows[y][x] : null);
    for (let y = -1; y <= H; y++)
      for (let x = -1; x <= W; x++) {
        let c = at(x, y);
        if (!c && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => at(x + dx, y + dy))) c = "O"; // outline
        if (!c) continue;
        ctx.fillStyle = COLORS[c];
        ctx.fillRect(f * fw + x + 1, y + 1, 1, 1);
      }
  });
  return canvas.toDataURL();
}

export default function ProgressCat() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.querySelector(".cat").style.backgroundImage = `url(${sheet()})`;
    let last = scrollY, timer;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      el.style.setProperty("--p", max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0);
      if (scrollY !== last) {
        el.dataset.dir = scrollY < last ? "up" : "down";
        el.dataset.moving = "true";
        clearTimeout(timer);
        timer = setTimeout(() => (el.dataset.moving = "false"), 160);
      }
      last = scrollY;
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={ref} className="track" data-dir="down" data-moving="false" aria-hidden="true">
      <span className="fill" />
      <span className="cat" />
    </div>
  );
}
