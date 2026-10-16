import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TypeTest from "./TypeTest";
import PixelAvatar from "./PixelAvatar";
import site from "../content";

const icons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  resume: DescriptionIcon,
};

export default function Hero() {
  const { name, tagline, links } = site.profile;
  return (
    <section className="hero">
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
        <PixelAvatar />
      </h1>
      <p className="lead">{tagline}</p>
      <TypeTest />
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
    </section>
  );
}
