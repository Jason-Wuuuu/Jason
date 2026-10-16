import { useState } from "react";
import { image } from "../App";
import site, { withLinks } from "../content";
import TypeTest from "./TypeTest";

export default function About() {
  const { paragraphs, image: img } = site.about;
  const [egg, setEgg] = useState(false);
  return (
    <section id="about">
      <h2>About</h2>
      <div className="about">
        <div className="prose">
          {paragraphs.map((p, i) => (
            <p key={i}>{withLinks(p, { onEgg: () => setEgg((v) => !v), eggOpen: egg })}</p>
          ))}
        </div>
        {img && <img src={image(img)} alt="Jason" loading="lazy" />}
      </div>
      {egg && <TypeTest autoFocus />}
    </section>
  );
}
