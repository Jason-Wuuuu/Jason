import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { projects } from "../projectsData";
import { asset } from "../App";

const categories = ["All", ...new Set(projects.map((p) => p.category))];

function Card({ p }) {
  const demo = /^(https?:|www)/.test(p.demoUrl) ? p.demoUrl : asset(p.demoUrl);
  return (
    <article className="card">
      <h3>{p.title}</h3>
      <p className="muted small">
        {p.course} · {p.year} · {p.tech_stack}
      </p>
      {p.screenshots.length > 0 && (
        <div className="gallery" tabIndex={0} aria-label={`${p.title} screenshots`}>
          {p.screenshots.map((s) => (
            <img key={s} src={asset(`images/${s}`)} alt={`${p.title} screenshot`} loading="lazy" />
          ))}
        </div>
      )}
      <p>{p.description}</p>
      <div className="row">
        {p.githubUrl && (
          <a className="btn" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
            <GitHubIcon fontSize="small" /> Code
          </a>
        )}
        {p.demoUrl && (
          <a className="btn" href={demo} target="_blank" rel="noopener noreferrer">
            <PlayCircleOutlineIcon fontSize="small" /> Demo
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="row tabs" role="tablist">
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={c === cat} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((p) => (
          <Card key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}
