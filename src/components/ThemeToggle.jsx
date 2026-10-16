import { useState } from "react";
import { flushSync } from "react-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
const current = () => document.documentElement.dataset.theme || (systemDark() ? "dark" : "light");

export default function ThemeToggle() {
  const [theme, setTheme] = useState(current);
  const flip = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () =>
      flushSync(() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch {}
        setTheme(next);
      });
    // The new theme wipes in from the button in stepped rings (see ::view-transition-new in index.css).
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty("--tx", `${r.left + r.width / 2}px`);
    document.documentElement.style.setProperty("--ty", `${r.top + r.height / 2}px`);
    document.startViewTransition(apply);
  };
  return (
    <button className="theme-toggle" onClick={flip} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  );
}
