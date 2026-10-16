import { useEffect, useRef } from "react";
import { avatarCanvas, SIZE } from "../avatar";

const STEPS = [3, 4, 6, 8, 12, 18, SIZE]; // the avatar "resolves" through these resolutions on load

export default function PixelAvatar() {
  const ref = useRef(null);
  const replay = useRef(() => {});
  useEffect(() => {
    let timer;
    const ctx = ref.current.getContext("2d");
    const sprite = avatarCanvas();
    const tmp = document.createElement("canvas");
    const draw = (n) => {
      tmp.width = tmp.height = n;
      tmp.getContext("2d").drawImage(sprite, 0, 0, n, n);
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, n, n, 0, 0, SIZE, SIZE);
    };
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
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) draw(SIZE);
    else play(500); // first time: after the name has dropped in
    return () => clearTimeout(timer);
  }, []);
  return (
    <canvas
      ref={ref}
      width={SIZE}
      height={SIZE}
      className="pixel-avatar"
      role="img"
      aria-label="Pixel-art avatar of Jason in a cap and glasses (click to re-render)"
      onClick={() => replay.current()}
    />
  );
}
