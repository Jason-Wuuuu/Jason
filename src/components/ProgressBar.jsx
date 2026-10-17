import { useEffect, useRef, useState } from "react";

const SPEEDS = { slow: 80, normal: 150, fast: 260 }; // px per second of the auto-scroll; Settings sets data-speed on <html>
// Scroll progress: a dashed lane at the bottom of the screen with an accent fill.
export default function ProgressBar() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  // Play = a slow auto-scroll tour of the page; any wheel, touch, key or click stops it, as does the end of the page (press play there to go again from the top).
  useEffect(() => {
    if (!playing) return;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    let raf, last = performance.now(), y = scrollY >= max() - 1 ? 0 : scrollY; // pressed at the end of the page: the tour starts over from the top
    const step = (t) => {
      y += ((t - last) * (SPEEDS[document.documentElement.dataset.speed] || SPEEDS.normal)) / 1000; last = t;
      scrollTo({ top: y, behavior: "instant" });
      if (y >= max() - 1) setPlaying(false);
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const stop = (e) => e.target.closest?.(".play, .win") || setPlaying(false);
    const evs = ["wheel", "touchstart", "keydown", "pointerdown"];
    evs.forEach((n) => addEventListener(n, stop, { passive: true }));
    return () => { cancelAnimationFrame(raf); evs.forEach((n) => removeEventListener(n, stop)); };
  }, [playing]);
  useEffect(() => {
    const secs = [...document.querySelectorAll("main > section")];
    const at = () => secs.filter((s) => s.getBoundingClientRect().top < innerHeight / 2).length; // sections whose top has passed mid-screen
    let seen = at();
    const update = () => {
      const now = at();
      if (now !== seen) { seen = now; const g = ref.current.lastChild; g.classList.remove("pop"); void g.offsetWidth; g.classList.add("pop"); } // reached a new section: the arrow hops and spins (restarted if already going)
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current.style.setProperty("--p", max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);
  // Dragging the arrow scrubs the page (the native scrollbar is hidden); the position follows the pointer along the lane.
  const drag = (e) => {
    if (e.type === "pointerdown") { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); }
    else if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const r = ref.current.getBoundingClientRect();
    scrollTo({ top: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (document.documentElement.scrollHeight - innerHeight), behavior: "instant" });
  };
  return (
    <>
      <button className="play" data-on={playing} aria-pressed={playing} aria-label="Auto-scroll the page" onClick={() => setPlaying((p) => !p)} />
      <div ref={ref} className="track" aria-hidden="true">
        <span className="fill" />
        <span className="grip" onAnimationEnd={(e) => e.currentTarget.classList.remove("pop")} onPointerDown={drag} onPointerMove={drag} />
      </div>
    </>
  );
}
