import { useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { asset } from "../App";
import site, { Md } from "../content";
import Lightbox from "./Lightbox";
import Shot from "./Shot";

const projects = site.projects;

const cats = [...new Set(projects.map((p) => p.category))];
const categories = ["Featured", "All", ...cats];
const grouped = cats.length > 1; // with a single category (e.g. most projects archived) the filter tabs are pointless

const touch = matchMedia("(hover: none)").matches; // no full-screen viewer on touch screens (iOS Safari left the toolbar see-through after closing it)

function Gallery({ p }) {
  const [at, setAt] = useState(0);
  const [big, setBig] = useState(null); // index of the screenshot open in the lightbox
  const ref = useRef();
  const n = p.screenshots.length;
  const onScroll = ({ currentTarget: g }) =>
    setAt(
      Math.round(
        (g.scrollLeft / (g.scrollWidth - g.clientWidth || 1)) * (n - 1),
      ),
    );
  const go = (i) =>
    ref.current.children[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  // The peeking neighbour slides into view; the current photo opens at full size.
  const onPick = (i) => (i === at || n === 1 ? !touch && setBig(i) : go(i));
  const view = (i) => {
    setBig(i);
    ref.current.children[i]?.scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" }); // keep the gallery behind in step
  };
  return (
    <>
      <div className="gal" data-prev={at > 0} data-next={at < n - 1}>
      <div
        className="gallery"
        ref={ref}
        tabIndex={0}
        aria-label={`${p.title} screenshots`}
        onScroll={onScroll}
        onKeyDown={(e) => e.key === "Enter" && !touch && setBig(at)}
      >
        {p.screenshots.map((s, i) => (
          <Shot
            key={s}
            onClick={() => onPick(i)}
            className={i < at ? "prev" : i > at ? "next" : undefined}
            src={s}
            alt={`${p.title} screenshot`}
            loading="lazy"
          />
        ))}
      </div>
      </div>
      {big !== null && <Lightbox shots={p.screenshots} title={p.title} at={big} onAt={view} onClose={() => setBig(null)} />}
      {n > 1 && (
        <div className="bars">
          {p.screenshots.map((s, i) => (
            <button
              key={s}
              className={i === at ? "on" : ""}
              aria-label={`Show screenshot ${i + 1} of ${n}`}
              aria-current={i === at}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function Row({ p, open }) {
  const demo = /^(https?:|www)/.test(p.demoUrl)
    ? p.demoUrl
    : asset(p.demoUrl || "");
  const video = /youtu\.?be|vimeo|\.mp4$/i.test(p.demoUrl); // a video is a "Demo"; anything else is the live site
  return (
    <details className="proj" open={open}>
      <summary>
        <span className="yr">{p.year}</span>
        <span className="ti">{p.title}</span>
        <span className="st">{p.tech_stack}</span>
      </summary>
      <div className="body">
        <Md text={p.description} />
        {p.screenshots.length > 0 && <Gallery p={p} />}
        <div className="social">
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon fontSize="small" /> Source
            </a>
          )}
          {p.demoUrl && (
            <a href={demo} target="_blank" rel="noopener noreferrer">
              {video ? (
                <PlayCircleOutlineIcon fontSize="small" />
              ) : (
                <OpenInNewIcon fontSize="small" />
              )}{" "}
              {video ? "Demo" : "Live site"}
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

export default function Projects() {
  const [cat, setCat] = useState("Featured");
  const shown =
    !grouped || cat === "All"
      ? projects
      : cat === "Featured"
        ? projects.filter((p) => p.featured)
        : projects.filter((p) => p.category === cat);
  return (
    <section id="projects">
      <h2 aria-label="Inventory, Projects">Inventory<small>Projects</small></h2>
      {grouped && (
        <div className="filters" role="group" aria-label="Filter projects">
          {categories.map((c) => (
            <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      <div>
        {shown.map((p, i) => (
          <Row
            key={i}
            p={p}
            open={(!grouped || cat === "Featured") && i === 0}
          />
        ))}
      </div>
    </section>
  );
}
