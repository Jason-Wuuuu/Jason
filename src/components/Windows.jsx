import { useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import site from "../content";

const root = document.documentElement;
const OPTIONS = {
  theme: ["system", "light", "dark"],
  accent: ["blue", "green", "orange", "red", "purple"],
  font: ["pixel", "mono", "sans"],
};
const SWATCH = { blue: "#2f6fdb", green: "#1f8a4c", orange: "#c4620a", red: "#d03b3b", purple: "#7b4fd1" };
const get = (k) => root.dataset[k] || OPTIONS[k][0];
const set = (k, v) => {
  const dflt = v === OPTIONS[k][0];
  if (dflt) delete root.dataset[k]; else root.dataset[k] = v;
  try { dflt ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {}
};

function Win({ cls, title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className={`win ${cls}`} role="dialog" aria-label={title}>
      <span className="bar">
        {title.toUpperCase()}
        <span className="wm"><button onClick={onClose} aria-label="Close">×</button></span>
      </span>
      {children}
    </div>
  );
}

function Settings({ onClose }) {
  const [, redraw] = useState(0);
  return (
    <Win cls="settings" title="Settings" onClose={onClose}>
      {Object.keys(OPTIONS).map((k) => (
        <div key={k} className="opt" role="group" aria-label={k}>
          <span>{k}</span>
          {OPTIONS[k].map((v) => (
            <button
              key={v}
              aria-pressed={get(k) === v}
              aria-label={k === "accent" ? v : undefined}
              style={k === "accent" ? { "--sw": SWATCH[v] } : k === "font" ? { fontFamily: FONTS[v] } : undefined}
              onClick={() => { set(k, v); redraw((n) => n + 1); }}
            >
              {k === "accent" ? "" : v}
            </button>
          ))}
        </div>
      ))}
    </Win>
  );
}
const FONTS = { pixel: '"Jersey 15"', mono: "ui-monospace, monospace", sans: "system-ui, sans-serif" };

function Contact({ onClose }) {
  const { email } = site.profile;
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <Win cls="contact" title="Contact" onClose={onClose}>
      <p>Say hi, or ask me anything.</p>
      <a className="addr" href={`mailto:${email}`}>{email}</a>
      <div className="opt">
        <button onClick={copy}>{copied ? "copied!" : "copy"}</button>
        <a className="btn" href={`mailto:${email}`}>open mail</a>
      </div>
    </Win>
  );
}

export default function Windows() {
  const [open, setOpen] = useState({}); // which windows are showing: { settings, contact }
  const toggle = (w) => setOpen((o) => ({ ...o, [w]: !o[w] }));
  const close = (w) => () => setOpen((o) => ({ ...o, [w]: false }));
  const { email } = site.profile;
  return (
    <>
      <button className="theme-toggle" style={{ "--n": 1 }} onClick={() => toggle("settings")} aria-label="Settings" aria-expanded={!!open.settings}>
        <SettingsIcon fontSize="small" />
      </button>
      {email && (
        <button className="theme-toggle" style={{ "--n": 2 }} onClick={() => toggle("contact")} aria-label="Contact" aria-expanded={!!open.contact}>
          <MailOutlineIcon fontSize="small" />
        </button>
      )}
      {open.settings && <Settings onClose={close("settings")} />}
      {open.contact && <Contact onClose={close("contact")} />}
    </>
  );
}
