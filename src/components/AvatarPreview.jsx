import { useEffect, useRef } from "react";
import { avatarCanvas, SIZE, SPRITES } from "../avatar";

// Temporary: #/avatars shows each candidate on dark and light, at the size it has on the site.
function One({ name }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.getContext("2d").drawImage(avatarCanvas(name), 0, 0);
  }, [name]);
  return <canvas ref={ref} width={SIZE} height={SIZE} className="pixel-avatar" style={{ position: "static" }} />;
}

export default function AvatarPreview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      {["dark", "light"].map((theme) => (
        <div key={theme} data-theme={theme} style={{ background: theme === "dark" ? "#1c1c1e" : "#f4f2ee", color: theme === "dark" ? "#eeebe6" : "#1f1f21", padding: "2rem", display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          {Object.keys(SPRITES).map((name) => (
            <figure key={name} style={{ margin: 0, textAlign: "center", ["--ink"]: theme === "dark" ? "#eeebe6" : "#1f1f21" }}>
              <One name={name} />
              <figcaption style={{ marginTop: ".8rem" }}>{name === "memoji" ? "A: cap & laptop" : "B: cat & hoodie"}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
