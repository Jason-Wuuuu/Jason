import { useEffect, useRef } from "react";
import { image } from "../App";
import site from "../content";

const N = 44; // drawn at 44×44, shown larger with image-rendering: pixelated
const STEPS = [3, 5, 8, 12, 20, 30, N]; // the avatar "resolves" through these resolutions on load

export default function PixelAvatar() {
  const ref = useRef(null);
  const replay = useRef(() => {});
  useEffect(() => {
    let timer;
    const img = new Image();
    img.onload = () => {
      const ctx = ref.current.getContext("2d");
      const tmp = document.createElement("canvas");
      const draw = (n) => {
        tmp.width = tmp.height = n;
        tmp.getContext("2d").drawImage(img, 0, 0, n, n);
        ctx.clearRect(0, 0, N, N);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmp, 0, 0, n, n, 0, 0, N, N);
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return draw(N);
      const play = (delay) => {
        clearTimeout(timer);
        let i = 0;
        const tick = () => {
          draw(STEPS[i++]);
          if (i < STEPS.length) timer = setTimeout(tick, 110);
        };
        timer = setTimeout(tick, delay);
      };
      replay.current = () => play(0); // clicking the avatar re-renders it
      play(500); // first time: after the name has dropped in
    };
    img.src = image(site.profile.avatar);
    return () => clearTimeout(timer);
  }, []);
  return <canvas ref={ref} width={N} height={N} className="pixel-avatar" role="img" aria-label="Pixelated memoji of Jason (click to re-render)" onClick={() => replay.current()} />;
}
