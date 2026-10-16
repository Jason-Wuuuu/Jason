import { image } from "../App";
import site, { withLinks } from "../content";

export default function About() {
  const { paragraphs, image: img } = site.about;
  return (
    <section id="about">
      <h2>About</h2>
      <div className="about">
        <div className="prose">
          {paragraphs.map((p, i) => (
            <p key={i}>{withLinks(p)}</p>
          ))}
        </div>
        {img && <img src={image(img)} alt="Jason" loading="lazy" />}
      </div>
    </section>
  );
}
