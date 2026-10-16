import { useRef, useState } from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PixelAvatar from "./PixelAvatar";
import site, { withLinks } from "../content";

const icons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  resume: DescriptionIcon,
};

export default function Hero() {
  const { name, tagline, links, class: cls, stats = [] } = site.profile;
  const [state, setState] = useState("open"); // open | closing | closed
  const card = useRef(null);
  const close = () => setState(matchMedia("(prefers-reduced-motion: reduce)").matches ? "closed" : "closing");
  if (state === "closed")
    return (
      <section className="hero">
        <p className="respawn">
          PLAYER 1 has left the game. <button onClick={() => setState("open")}>Respawn</button>
        </p>
      </section>
    );
  return (
    <section className="hero">
      <div className="card" ref={card} data-state={state} onAnimationEnd={(e) => e.animationName === "poof" && setState("closed")}>
        <span className="bar">
          PLAYER 1
          <span className="wm">
            <button onClick={close} aria-label="Close">×</button>
          </span>
        </span>
        <PixelAvatar />
        <div className="who">
          <h1 aria-label={name}>
            {name.split(" ").map((word, w, words) => (
              <span key={w} aria-hidden="true">
                {w > 0 && <br />}
                {[...word].map((ch, i) => (
                  <span
                    key={i}
                    className="ch"
                    style={{ "--i": i + words.slice(0, w).join("").length }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          {cls && <p className="cls">{cls}</p>}
          <p className="lead">{withLinks(tagline)}</p>
          <div className="social">
            {links.map(({ href, label, icon }) => {
              const Icon = icons[icon] || OpenInNewIcon;
              return (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  <Icon fontSize="small" /> {label}
                </a>
              );
            })}
          </div>
        </div>
        {stats.length > 0 && (
          <ul className="stats" aria-label="Skills">
            {stats.map((t) => {
              const m = t.match(/^(.*?)\s+(\d+)$/);
              return (
                <li key={t}>
                  {m ? m[1] : t}
                  {m && <span className="pips" style={{ "--n": Math.min(+m[2], 10), "--h": Math.ceil(Math.min(+m[2], 10) / 2) }} />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
