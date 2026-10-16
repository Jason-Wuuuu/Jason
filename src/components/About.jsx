import { useState } from "react";
import { image } from "../App";
import site, { Md } from "../content";
import TypeTest from "./TypeTest";

export default function About() {
  const { paragraphs, images = [] } = site.about;
  const [egg, setEgg] = useState(false);
  const [top, setTop] = useState(0); // which photo is on top of the stack
  const [gone, setGone] = useState(-1); // the photo that was just sent to the back (it animates)
  return (
    <section id="about">
      <h2>About</h2>
      <div className="about">
        <div className="prose">
          {paragraphs.map((p, i) => (
            <Md key={i} text={p} onEgg={() => setEgg((v) => !v)} eggOpen={egg} />
          ))}
        </div>
        {images.length > 0 && (
          <div className="photos" data-stack={images.length > 1}>
            {images.map((img, i) => {
              const depth = (i - top + images.length) % images.length; // 0 = front
              return (
                <img
                  key={img}
                  src={image(img)}
                  alt="Jason"
                  loading="lazy"
                  className={i === gone ? "dealt" : undefined}
                  style={{ "--d": depth, zIndex: images.length - depth }}
                  onClick={() => (setGone(top), setTop((top + 1) % images.length))}
                  title={images.length > 1 ? "Click for the next photo" : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
      {egg && <TypeTest autoFocus />}
    </section>
  );
}
