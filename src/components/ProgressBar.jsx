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
  return (
    <div ref={ref} className="track" aria-hidden="true">
      <span className="fill" />
    </div>
  );
}
