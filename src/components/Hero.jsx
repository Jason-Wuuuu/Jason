import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import TypeTest from "./TypeTest";
import PixelAvatar from "./PixelAvatar";

const links = [
  { href: "https://github.com/Jason-Wuuuu", label: "GitHub", Icon: GitHubIcon },
  {
    href: "https://www.linkedin.com/in/chia-hsiang-jason-wu",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "https://drive.google.com/file/d/1NHWFbXm8ztQXxG5Xjcbhuh9pe662B21A/view",
    label: "Resume",
    Icon: DescriptionIcon,
  },
];

export default function Hero() {
  return (
    <section className="hero">
      <h1>
        Jason
        <br />
        Wu
        <PixelAvatar />
      </h1>
      <p className="lead">
        Full stack engineer in New York City. Next.js, TypeScript, FastAPI, and
        a soft spot for machine learning.
      </p>
      <TypeTest />
      <div className="social">
        {links.map(({ href, label, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">
            <Icon fontSize="small" /> {label}
          </a>
        ))}
      </div>
    </section>
  );
}
