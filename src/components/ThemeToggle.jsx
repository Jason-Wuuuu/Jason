import { useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
const current = () => document.documentElement.dataset.theme || (systemDark() ? "dark" : "light");

export default function ThemeToggle() {
  const [theme, setTheme] = useState(current);
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  };
  return (
    <button className="theme-toggle" onClick={flip} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  );
}
