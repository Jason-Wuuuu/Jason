import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import site from "../content";

const root = document.documentElement;
const OPTIONS = {
  theme: ["system", "light", "dark"],
  accent: ["blue", "green", "orange", "red", "purple"],
  speed: ["slow", "normal", "fast"], // auto-scroll (ProgressBar.jsx)
  cursor: ["pixel", "system"],
};
const SWATCH = { blue: "#2f6fdb", green: "#1f8a4c", orange: "#c4620a", red: "#d03b3b", purple: "#7b4fd1" };
const dflt = (k) => (k === "speed" ? "normal" : OPTIONS[k][0]); // the first option is the default, except for speed (listed slow, normal, fast)
const get = (k) => root.dataset[k] || dflt(k);
const set = (k, v) => {
  const reset = v === dflt(k);
  if (reset) delete root.dataset[k]; else root.dataset[k] = v;
  try { reset ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {}
};

function Win({ cls, title, onClose, children }) {
  const [closing, setClosing] = useState(false); // shrinks away like the player card, then unmounts
  const close = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? onClose() : setClosing(true));
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  });
  return (
    <div className={`win ${cls}`} role="dialog" aria-label={title} data-state={closing ? "closing" : "open"} onAnimationEnd={(e) => e.animationName === "poof" && onClose()}>
      <span className="bar">
        {title.toUpperCase()}
        <span className="wm"><button onClick={close} aria-label="Close">×</button></span>
      </span>
      {children}
    </div>
  );
}

function Settings({ onClose }) {
  const [, redraw] = useState(0);
  return (
    <Win cls="settings" title="Settings" onClose={onClose}>
      {Object.keys(OPTIONS).filter((k) => k !== "cursor" || matchMedia("(hover: hover) and (pointer: fine)").matches).map((k) => ( // no custom cursor on touch screens
        <div key={k} className="opt" role="group" aria-label={k}>
          <span>{k === "speed" ? "Auto Scroll" : k}</span>
          {OPTIONS[k].map((v) => (
            <button
              key={v}
              aria-pressed={get(k) === v}
              aria-label={k === "accent" ? v : undefined}
              style={k === "accent" ? { "--sw": SWATCH[v] } : undefined}
              onClick={() => { set(k, v); redraw((n) => n + 1); }}
            >
              {k === "accent" ? "" : v}
            </button>
          ))}
        </div>
      ))}
      <div className="opt end">
        <button onClick={() => { Object.keys(OPTIONS).forEach((k) => set(k, dflt(k))); redraw((n) => n + 1); }}>Reset</button>
      </div>
    </Win>
  );
}

function Contact({ onClose }) {
  const { email } = site.profile;
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <Win cls="contact" title="Contact" onClose={onClose}>
      <div className="ct">
        <div>
          <p>Say hi, or ask me anything.</p>
          <a className="addr" href={`mailto:${email}`}>{email}</a>
        </div>
        <div className="opt">
          <button onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
          <a className="btn" href={`mailto:${email}`}>Open Mail</a>
        </div>
      </div>
    </Win>
  );
}

export default function Windows() {
  const { email } = site.profile;
  // which windows are showing: { settings, contact }. On a big screen both start open, next to the player card.
  const [open, setOpen] = useState(() => {
    const big = matchMedia("(min-width: 1200px) and (min-height: 720px) and (hover: hover)").matches;
    return { settings: big, contact: big && !!email };
  });
  const toggle = (w) => setOpen((o) => ({ ...o, [w]: !o[w] }));
  const close = (w) => () => setOpen((o) => ({ ...o, [w]: false }));
  return (
    <>
      <button className="theme-toggle opener" style={{ "--n": 1 }} onClick={() => toggle("settings")} aria-label="Settings" aria-expanded={!!open.settings}>
        <SettingsIcon fontSize="small" />
      </button>
      {email && (
        <button className="theme-toggle opener" style={{ "--n": 2 }} onClick={() => toggle("contact")} aria-label="Contact" aria-expanded={!!open.contact}>
          <MailOutlineIcon fontSize="small" />
        </button>
      )}
      {open.settings && <Settings onClose={close("settings")} />}
      {open.contact && <Contact onClose={close("contact")} />}
    </>
  );
}
