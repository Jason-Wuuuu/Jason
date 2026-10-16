import { useEffect, useRef } from "react";

// A fixed, low-res canvas scaled up with image-rendering: pixelated, so everything on it is chunky.
// Sky: a dithered blue gradient that slowly drifts, a glow that follows the cursor, stars + moon (dark)
// or clouds + sun (light), rising fireflies, an occasional shooting star, and sparkles on click.
const PX = 6; // CSS pixels per canvas pixel
const BANDS = 8;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const THEMES = {
  dark: { top: rgb("#1c1c1e"), bottom: rgb("#1c3358"), glow: rgb("#5aa2ff"), sprite: ["#9cc9ff", "#eeebe6", "#5aa2ff"], cloud: "#27406b" },
  light: { top: rgb("#f4f2ee"), bottom: rgb("#cde1fa"), glow: rgb("#8cc4ff"), sprite: ["#2f6fdb", "#8cc4ff", "#1b4f9c"], cloud: "#ffffff" },
};
const CLOUD = [[2, 0, 7, 2], [0, 2, 13, 3], [3, 5, 8, 1]]; // [x, y, w, h] rects
const rand = (seed) => { const x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); };
const isDark = () =>
  (document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";

export default function Background() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W, H, img, raf, last = 0, k = 1; // k: particle density, 1 at desktop size
    const ptr = { x: -999, y: -999, tx: -999, ty: -999 };
    const bursts = [];
    const flies = Array.from({ length: 24 }, (_, i) => ({ x: rand(i + 1), y: rand(i + 50), s: 0.01 + rand(i + 9) * 0.02, p: rand(i + 3) * 6 }));
    let shoot = null, nextShoot = 4;

    const resize = () => {
      W = Math.ceil(innerWidth / PX);
      H = Math.ceil(innerHeight / PX);
      canvas.width = W;
      canvas.height = H;
      img = ctx.createImageData(W, H);
      k = Math.min(1, Math.max(0.35, (W * H) / 30000)); // fewer stars and fireflies on small screens
    };

    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };

    const draw = (t, dt) => {
      const th = THEMES[isDark() ? "dark" : "light"];
      const dark = isDark();
      const oy = -(scrollY / PX) * 0.12; // objects drift up slightly as you scroll
      ptr.x += (ptr.tx - ptr.x) * 0.15;
      ptr.y += (ptr.ty - ptr.y) * 0.15;

      // dithered, drifting gradient + cursor glow
      const R = 28, d = img.data;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const b = BAYER[(y & 3) * 4 + (x & 3)];
          let g = (y / H) * 0.9 + 0.06 * Math.sin(x * 0.045 + t * 0.35) + 0.05 * Math.sin(y * 0.07 - t * 0.25 + x * 0.02);
          g = Math.min(1, Math.max(0, g));
          const level = Math.floor(g * BANDS + b) / BANDS;
          const dx = x - ptr.x, dy = y - ptr.y;
          const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R);
          const glow = (Math.floor(near * 4 + b) / 4) * 0.4;
          const i = (y * W + x) * 4;
          for (let c = 0; c < 3; c++) {
            const base = th.top[c] + (th.bottom[c] - th.top[c]) * level;
            d[i + c] = base + (th.glow[c] - base) * glow;
          }
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      if (dark) {
        for (let i = 0; i < 70 * k; i++) { // stars twinkle in steps
          if (Math.floor(t * 1.5 + rand(i + 200) * 9) % 4 === 0) continue;
          const x = rand(i + 1) * W, y = rand(i + 90) * H * 0.75 + oy * 0.5;
          rect(x, y, 1, 1, th.sprite[i % 3]);
          if (i % 9 === 0) { rect(x - 1, y, 3, 1, th.sprite[0]); rect(x, y - 1, 1, 3, th.sprite[0]); }
        }
        const mx = W * 0.82, my = H * 0.18 + oy; // moon with craters
        for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) if (x * x + y * y <= 64 && (x + 3) * (x + 3) + y * y > 40) rect(mx + x, my + y, 1, 1, "#eeebe6");
        rect(mx - 1, my - 3, 2, 2, "#c9c6c0"); rect(mx + 2, my + 2, 2, 2, "#c9c6c0");
        nextShoot -= dt;
        if (!shoot && nextShoot < 0) { shoot = { x: rand(t) * W * 0.6, y: rand(t + 1) * H * 0.3, a: 0 }; nextShoot = 8 + rand(t + 2) * 8; }
        if (shoot) {
          shoot.a += dt;
          for (let k = 0; k < 10; k++) rect(shoot.x + shoot.a * 70 - k * 1.5, shoot.y + shoot.a * 35 - k * 0.75, 2, 1, k < 2 ? "#eeebe6" : "#5aa2ff");
          if (shoot.a > 1.2) shoot = null;
        }
      } else {
        const sx = W * 0.82, sy = H * 0.18 + oy; // sun: disc with a pixel ring
        for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) { const r2 = x * x + y * y; if (r2 <= 36) rect(sx + x, sy + y, 1, 1, "#ffffff"); else if (r2 <= 49) rect(sx + x, sy + y, 1, 1, "#8cc4ff"); }
      }
      // clouds drift right and wrap
      for (let c = 0; c < 4; c++) {
        const cx = ((t * (1.5 + c * 0.7) + c * W * 0.31) % (W + 30)) - 15, cy = H * (0.12 + c * 0.17) + oy;
        ctx.globalAlpha = dark ? 0.55 : 0.85;
        for (const [x, y, w, h] of CLOUD) rect(cx + x, cy + y, w, h, th.cloud);
        ctx.globalAlpha = 1;
      }
      // fireflies rise and wobble, blinking
      flies.forEach((f, i) => {
        if (i >= flies.length * k) return;
        f.y -= f.s * dt; if (f.y < -0.05) f.y = 1.05;
        if (Math.floor(t * 2 + f.p) % 3 === 0) return;
        rect(f.x * W + Math.sin(t + f.p) * 3, f.y * H, 1, 1, th.sprite[i % 3]);
      });
      // click sparkles
      for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.life -= dt; p.vy += 40 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.life <= 0) bursts.splice(i, 1);
        else rect(p.x, p.y, 1, 1, th.sprite[i % 3]);
      }
    };

    const frame = (ms) => {
      raf = requestAnimationFrame(frame);
      if (ms - last < 45) return; // ~22 fps: chunky on purpose, and cheap
      const dt = Math.min(0.1, (ms - last) / 1000);
      last = ms;
      draw(ms / 1000, dt);
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      if (ptr.tx < -900) { ptr.x = e.clientX / PX; ptr.y = e.clientY / PX; } // first move: no glide in from off-screen
      ptr.tx = e.clientX / PX;
      ptr.ty = e.clientY / PX;
    };
    const onDown = (e) => {
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        bursts.push({ x: e.clientX / PX, y: e.clientY / PX, vx: Math.cos(a) * (14 + rand(i) * 14), vy: Math.sin(a) * (14 + rand(i) * 14) - 12, life: 0.7 + rand(i + 5) * 0.4 });
      }
    };

    const onResize = () => { resize(); if (still) draw(0, 0); }; // resizing clears the canvas; iOS fires it as the toolbar collapses on scroll
    resize();
    addEventListener("resize", onResize);
    if (still) draw(0, 0);
    else {
      raf = requestAnimationFrame(frame);
      addEventListener("pointermove", onMove);
      addEventListener("pointerdown", onDown);
    }
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} className="bg" aria-hidden="true" />;
}
