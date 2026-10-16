import { useEffect, useRef } from "react";
import { image } from "../App";
import site from "../content";

const N = 44; // drawn at 44×44, shown larger with image-rendering: pixelated

export default function PixelAvatar() {
  const ref = useRef(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ctx = ref.current.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, 0, 0, N, N);
    };
    img.src = image(site.profile.avatar);
  }, []);
  return <canvas ref={ref} width={N} height={N} className="pixel-avatar" role="img" aria-label="Pixelated memoji of Jason" />;
}
