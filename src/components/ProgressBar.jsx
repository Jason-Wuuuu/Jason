import { useEffect, useRef } from "react";

// Scroll progress: a dashed lane at the bottom of the screen with an accent fill.
export default function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => {
    const update = () => {
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
    <div ref={ref} className="track" aria-hidden="true">
      <span className="fill" />
      <span className="grip" onPointerDown={drag} onPointerMove={drag} />
    </div>
  );
}
