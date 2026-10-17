import { useLayoutEffect, useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { asset } from "../App";
import site, { Md } from "../content";
import Lightbox from "./Lightbox";
import Shot from "./Shot";
import drawTree from "../treeLines";

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
  const sliding = useRef(0); // until when (ms) a slide is under way
  const go = (i) => {
    sliding.current = Date.now() + 600;
    ref.current.children[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };
  // The peeking neighbour slides into view; the current photo opens at full size. Mid-slide the target already counts as current, so a quick second click on the same spot must not open it.
  const onPick = (i) => (i === at || n === 1 ? !touch && Date.now() > sliding.current && setBig(i) : go(i));
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
      {p.screenshots[at].endsWith(".mp4") && <span className="vtag" aria-hidden="true" />}
      </div>
      {big !== null && <Lightbox shots={p.screenshots} captions={p.captions} title={p.title} at={big} onAt={view} onClose={() => setBig(null)} />}
      {p.captions?.[at] && <p className="cap">{p.captions[at]}</p>}
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

// "Name: note" starts a skill; "- text" lines hang under the skill above, like the experience bullets.
const parseSkills = (lines) =>
  lines.reduce((out, l) => {
    if (l.startsWith("- ")) out.at(-1)?.subs.push(l.slice(2));
    else {
      const [name, ...note] = l.split(": ");
      out.push({ name, note: note.join(": "), subs: [] });
    }
    return out;
  }, []);

function SkillRow({ s, i }) {
  const [open, setOpen] = useState(i === 0); // phones open a skill by tap; wider screens always show everything (CSS)
  return (
    <div className="row" data-open={open}>
      <button className="n" aria-expanded={open} onClick={() => setOpen(!open)}>{s.name}</button>
      <div className="kid">
        {s.note && <p className="leaf">{s.note}</p>}
        {s.subs.length > 0 && (
          <div className="subs">
            {s.subs.map((t) => {
              const [head, ...rest] = t.split(": "); // "Title: text" gives the sub-skill a title
              return (
                <p className="leaf k" key={t}>
                  {rest.length ? <><b>{head}</b>{rest.join(": ")}</> : t}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillTree({ lines }) {
  const ref = useRef(null);
  useLayoutEffect(() => { // the lines follow the boxes: drawn once the boxes are placed, and again whenever the tree's size changes (App.jsx redraws them on scroll)
    const redraw = () => drawTree(ref.current);
    redraw();
    const ro = new ResizeObserver(redraw);
    ro.observe(ref.current);
    return () => ro.disconnect();
  });
  const skills = parseSkills(lines);
  return (
    <div className="tree" ref={ref}>
      <svg className="lines" aria-hidden="true">
        <path className="lr" />
        <path className="lv" />
        {skills.map((s) => <path key={s.name} className="lt" />)}
      </svg>
      <span className="root">What I learned</span>
      <div className="kids">
        {skills.map((s, i) => (
          <SkillRow key={s.name} s={s} i={i} />
        ))}
      </div>
    </div>
  );
}

function Row({ p, open }) {
  const demo = /^(https?:|www)/.test(p.demoUrl)
    ? p.demoUrl
    : asset(p.demoUrl || "");
  const stack = [p.year, ...(p.tech_stack?.split(/,\s*/) ?? [])].filter(Boolean).join(" · "); // the year leads the stack line
  const video = /youtu\.?be|vimeo|\.mp4$/i.test(p.demoUrl); // a video is a "Demo"; anything else is the live site
  const actions = ( // the live site first, as a button; shown above the screenshots on desktop and below them on phones
    <div className="social">
      {p.demoUrl && (
        <a className="cta" href={demo} target="_blank" rel="noopener noreferrer">
          {video ? <PlayCircleOutlineIcon fontSize="small" /> : <OpenInNewIcon fontSize="small" />}{" "}
          {video ? "Watch demo" : "Try it live"}
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
          <GitHubIcon fontSize="small" /> Source
        </a>
      )}
    </div>
  );
  return (
    <details className="proj" open={open}>
      <summary>
        <span className="ti">{p.title}</span>
        {p.demoUrl && <span className={video ? "live demo" : "live"}>{video ? "demo" : "live"}</span>}
        {stack && <span className="sub">{stack}</span>}
      </summary>
      <div className="body">
        <Md text={p.description} />
        <div className="links">
          {stack && <p className="stack">{stack}</p>}
          {actions}
        </div>
        {p.skills?.length > 0 && <SkillTree lines={p.skills} />}
        {p.screenshots.length > 0 && <Gallery p={p} />}
        <div className="links after">{actions}</div>
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
            open={shown.length <= 3 || ((!grouped || cat === "Featured") && i === 0)} // a short list is all open; a long one opens just the first
          />
        ))}
      </div>
    </section>
  );
}
