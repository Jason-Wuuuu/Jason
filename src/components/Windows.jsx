import { useEffect, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import site from "../content";
import { front } from "../hoverRing";

const root = document.documentElement;
const OPTIONS = {
  theme: ["system", "light", "dark"],
  accent: ["blue", "green", "orange", "red", "purple"],
  speed: ["slow", "normal", "fast"], // auto-scroll (ProgressBar.jsx)
  cursor: ["pixel", "system"],
};
const dflt = (k) => (k === "speed" ? "normal" : OPTIONS[k][0]); // the first option is the default, except for speed (listed slow, normal, fast)
const get = (k) => root.dataset[k] || dflt(k);
const set = (k, v) => {
  const reset = v === dflt(k);
  if (reset) delete root.dataset[k]; else root.dataset[k] = v;
  try { reset ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {}
};

export function Win({ cls, title, onClose, top, children }) {
  const box = useRef(null);
  useEffect(() => front(box.current), []); // a newly opened window is on top of the others
  const [closing, setClosing] = useState(false); // shrinks away like the player card, then unmounts
  const close = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? onClose() : setClosing(true));
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  });
  return (
    <div ref={box} className={`win ${cls}`} style={top ? { top } : undefined} role="dialog" aria-label={title} data-state={closing ? "closing" : "open"} onAnimationEnd={(e) => e.animationName === "poof" && onClose()}>
      <span className="bar">
        {title.toUpperCase()}
        <span className="wm"><button onClick={close} aria-label="Close">×</button></span>
      </span>
      {children}
    </div>
  );
}

function Settings({ onClose, top }) {
  const [, redraw] = useState(0);
  useEffect(() => { // the sun/moon toggle changes the theme too
    const o = new MutationObserver(() => redraw((n) => n + 1));
    o.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => o.disconnect();
  }, []);
  return (
    <Win cls="settings" title="Settings" onClose={onClose} top={top}>
      {Object.keys(OPTIONS).filter((k) => k !== "cursor" || matchMedia("(hover: hover) and (pointer: fine)").matches).map((k) => ( // no custom cursor on touch screens
        <div key={k} className="opt" role="group" aria-label={k}>
          <span>{k === "speed" ? "Auto Scroll" : k}</span>
          {OPTIONS[k].map((v) => (
            <button
              key={v}
              aria-pressed={get(k) === v}
              aria-label={k === "accent" ? v : undefined}
              style={k === "accent" ? { "--sw": `var(--k-${v})` } : undefined} // the swatch is the accent as the current theme shows it
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

function Contact({ onClose, top }) {
  const { email } = site.profile;
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  return (
    <Win cls="contact" title="Contact" onClose={onClose} top={top}>
      <p>Say hi, or ask me anything.</p>
      <a className="addr" href={`mailto:${email}`}>{email}</a>
      <div className="opt end">
        <button onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
        <a className="btn" href={`mailto:${email}`}>Open Mail</a>
      </div>
    </Win>
  );
}

export default function Windows() {
  const [open, setOpen] = useState({}); // which windows are showing: { settings, contact }
  const dropdown = () => matchMedia("(hover: none)").matches; // touch: one at a time, and a tap elsewhere closes it
  const [tops, setTops] = useState({}); // where a second window opens: under the first (clearing its 6px shadow and the same .6rem gap as under the top buttons), wherever that has been dragged to
  const toggle = (w) => {
    const other = document.querySelector(`.win.${w === "settings" ? "contact" : "settings"}`);
    setTops((t) => ({ ...t, [w]: !dropdown() && other ? other.getBoundingClientRect().bottom + 6 + parseFloat(getComputedStyle(root).fontSize) * 0.6 : undefined }));
    setOpen((o) => (dropdown() ? { [w]: !o[w] } : { ...o, [w]: !o[w] }));
  };
  useEffect(() => {
    if (!dropdown() || !(open.settings || open.contact)) return;
    const away = (e) => !e.target.closest(".win, .opener") && setOpen({});
    addEventListener("pointerdown", away);
    return () => removeEventListener("pointerdown", away);
  }, [open]);
  const close = (w) => () => setOpen((o) => ({ ...o, [w]: false }));
  const { email } = site.profile;
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
      {open.settings && <Settings onClose={close("settings")} top={tops.settings} />}
      {open.contact && <Contact onClose={close("contact")} top={tops.contact} />}
    </>
  );
}
