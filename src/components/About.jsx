import { useRef, useState } from "react";
import { image } from "../App";
import site, { Md } from "../content";
import TypeTest from "./TypeTest";
import Hobbies from "./Hobbies";

const STEPS = [64, 32, 16, 8]; // mosaic blocks across the photo, fine to coarse
const TICK = 70; // ms per frame: choppy on purpose, like the rest of the site

export default function About() {
  const { paragraphs, images = [], hobbies = [], funFact = "" } = site.about;
  const [egg, setEgg] = useState(false);
  const [top, setTop] = useState(0); // which photo is on top of the stack
  const photos = useRef([]);
  const mosaic = useRef(null); // canvas laid over the front photo while it transforms
  const busy = useRef(false);

  // The front photo breaks into bigger and bigger blocks, becomes the next photo, then sharpens again (a Pokémon "transform").
  const next = () => {
    const n = images.length;
    if (n < 2 || busy.current) return;
    const from = photos.current[top], to = photos.current[(top + 1) % n];
    const swap = () => setTop((top + 1) % n);
    if (!to.naturalWidth || !from.naturalWidth || matchMedia("(prefers-reduced-motion: reduce)").matches) return swap();
    busy.current = true;
    const c = mosaic.current, W = from.clientWidth, H = from.clientHeight;
    Object.assign(c.style, { display: "block", left: `${from.offsetLeft + from.clientLeft}px`, top: `${from.offsetTop + from.clientTop}px`, width: `${W}px`, height: `${H}px` });
    const paint = (src, res) => {
      c.width = res;
      c.height = Math.max(1, Math.round((res * H) / W));
      const k = Math.max(c.width / src.naturalWidth, c.height / src.naturalHeight); // same centre-crop as object-fit: cover
      const sw = c.width / k, sh = c.height / k;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(src, (src.naturalWidth - sw) / 2, (src.naturalHeight - sh) / 2, sw, sh, 0, 0, c.width, c.height);
    };
    const frames = [...STEPS.map((r) => [from, r]), ...[...STEPS].reverse().map((r) => [to, r])];
    frames.forEach(([src, r], i) =>
      setTimeout(() => {
        paint(src, r);
        if (i === STEPS.length) swap(); // at the coarsest frame the next photo takes the front
      }, i * TICK),
    );
    setTimeout(() => {
      c.style.display = "none";
      busy.current = false;
    }, frames.length * TICK);
  };
  return (
    <section id="about">
      <h2 aria-label="Player Log, About">Player Log<small>About</small></h2>
      <div className="about">
        <div className="prose">
          {paragraphs.map((p, i) => (
            <Md key={i} text={p} onEgg={() => setEgg((v) => !v)} eggOpen={egg} />
          ))}
        </div>
        {images.length > 0 && (
          <div className="photos" data-stack={images.length > 1} style={{ "--n": images.length }}>
            {images.map((img, i) => {
              const depth = (i - top + images.length) % images.length; // 0 = front
              return (
                <img
                  key={img}
                  src={image(img)}
                  alt="Jason"
                  loading="lazy"
                  ref={(el) => (photos.current[i] = el)}
                  style={{ "--d": depth, zIndex: images.length - depth }}
                  onClick={next}
                  title={images.length > 1 ? "Click for the next photo" : undefined}
                  {...(images.length > 1 && { role: "button", tabIndex: depth === 0 ? 0 : -1, onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), next()) })} /* the focused photo goes to the back when pressed, so every photo handles the key */
                />
              );
            })}
            <canvas ref={mosaic} className="mosaic" aria-hidden="true" />
          </div>
        )}
      </div>
      <Hobbies items={hobbies} />
      {funFact && (
        <div className="funfact">
          <Md text={funFact} onEgg={() => setEgg((v) => !v)} eggOpen={egg} />
        </div>
      )}
      {egg && <TypeTest autoFocus />}
    </section>
  );
}
