import { useEffect, useRef } from "react";
import { AVATAR_STYLES, DEFAULT_STYLE, pixelate } from "../avatar";
import { image } from "../App";
import site from "../content";

// The profile picture from the admin, pixelated. It "resolves" from chunky blocks on load; clicking replays that.
export default function PixelAvatar() {
  const { avatar, avatarStyle, avatarFrame } = site.profile;
  const style = AVATAR_STYLES[avatarStyle] || AVATAR_STYLES[DEFAULT_STYLE];
  const { n, crop, width } = style;
  const ref = useRef(null);
  const replay = useRef(() => {});

  useEffect(() => {
    if (!avatar) return;
    let timer, gone = false;
    const ctx = ref.current.getContext("2d");
    const img = new Image();
    img.onload = () => {
      if (gone) return;
      const steps = [3, 5, 8, 12, 18, 26, 36].filter((k) => k < n).concat(n);
      const draw = (k) => {
        ctx.clearRect(0, 0, n, n);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pixelate(img, k, crop), 0, 0, k, k, 0, 0, n, n);
      };
      const play = (delay) => {
        clearTimeout(timer);
        let i = 0;
        const tick = () => {
          draw(steps[i++]);
          if (i < steps.length) timer = setTimeout(tick, 110);
        };
        timer = setTimeout(tick, delay);
      };
      replay.current = () => play(0);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) draw(n);
      else play(500); // first time: after the name has dropped in
    };
    img.src = image(avatar);
    return () => {
      gone = true;
      clearTimeout(timer);
    };
  }, [avatar, n, crop]);

  if (!avatar) return null;
  return (
    <canvas
      ref={ref}
      width={n}
      height={n}
      className="pixel-avatar"
      data-frame={avatarFrame === "none" ? "none" : "round"}
      style={{ "--w": `${width[0]}px`, "--wt": `${width[1]}px`, "--wm": `${width[2]}px` }}
      role="img"
      aria-label="Profile picture of Jason (click to re-render)"
      onClick={() => replay.current()}
    />
  );
}
