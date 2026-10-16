import { useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { projects } from "../projectsData";
import { asset } from "../App";

const categories = ["All", ...new Set(projects.map((p) => p.category))];

function Row({ p }) {
  const demo = /^(https?:|www)/.test(p.demoUrl) ? p.demoUrl : asset(p.demoUrl);
  return (
    <details className="proj">
      <summary>
        <span className="yr">{p.year}</span>
        <span className="ti">{p.title}</span>
        <span className="st">{p.tech_stack}</span>
      </summary>
      <div className="body">
        <p>{p.description}</p>
        <p className="meta">{p.course} project</p>
        {p.screenshots.length > 0 && (
          <div className="gallery" tabIndex={0} aria-label={`${p.title} screenshots`}>
            {p.screenshots.map((s) => (
              <img key={s} src={asset(`images/${s}`)} alt={`${p.title} screenshot`} loading="lazy" />
            ))}
          </div>
        )}
        <div className="social">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon fontSize="small" /> Source
            </a>
          )}
          {p.demoUrl && (
            <a href={demo} target="_blank" rel="noopener noreferrer">
              <PlayCircleOutlineIcon fontSize="small" /> Demo
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

export default function Projects() {
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? projects : projects.filter((p) => p.category === cat);
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="filters" role="group" aria-label="Filter projects">
        {categories.map((c) => (
          <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div>
        {shown.map((p) => (
          <Row key={p.title} p={p} />
        ))}
      </div>
    </section>
  );
}
