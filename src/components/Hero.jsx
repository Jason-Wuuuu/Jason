import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DescriptionIcon from "@mui/icons-material/Description";
import { asset } from "../App";

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
      <img
        className="avatar"
        src={asset("images/Memoji_1.png")}
        alt="Jason's memoji"
        width="220"
        height="220"
      />
      <div>
        <h1>Chia-Hsiang (Jason) Wu</h1>
        <p className="lead">Software Engineer / Web Developer</p>
        <p className="muted">
          Full Stack Engineer at Blockhouse, New York City · M.S. Computer
          Science, Stevens Institute of Technology (GPA 3.9)
        </p>
        <div className="row">
          {links.map(({ href, label, Icon }) => (
            <a key={label} className="btn" href={href} target="_blank" rel="noopener noreferrer">
              <Icon fontSize="small" /> {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
