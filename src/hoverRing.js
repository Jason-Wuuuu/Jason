// Pixel corner brackets that step out around the hovered clickable thing, then step back in on leave.
const SEL = 'a, button, summary, [role="button"], .egg, .pixel-avatar';
const GAP = 8; // px between the target (shadow included) and the brackets, once fully out
const STEP = matchMedia("(prefers-reduced-motion: reduce)").matches ? GAP : 2; // px per tick, one tick every 45ms
const ring = Object.assign(document.createElement("div"), { className: "ring" });
document.body.append(ring);

let target = null, shown = null, pad = 0, last = 0, raf = 0;

function frame(t) {
  if (t - last > 45) { last = t; pad = target ? Math.min(GAP, pad + STEP) : Math.max(0, pad - STEP); }
  if (!target && !pad || !shown?.isConnected) { ring.style.display = "none"; shown = null; raf = 0; return; }
  const r = shown.getBoundingClientRect();
  const [sx = 0, sy = 0] = (getComputedStyle(shown).boxShadow.match(/-?[\d.]+px/g) || []).map(parseFloat); // the hard pixel shadow counts as part of the target
  const left = r.left - pad - Math.max(0, -sx), top = r.top - pad - Math.max(0, -sy);
  const right = r.right + pad + Math.max(0, sx), bottom = r.bottom + pad + Math.max(0, sy);
  Object.assign(ring.style, { display: "block", left: Math.round(left) + "px", top: Math.round(top) + "px", width: Math.round(right - left) + "px", height: Math.round(bottom - top) + "px" });
  raf = requestAnimationFrame(frame);
}

function set(el) {
  target = el;
  if (el) shown = el;
  if (shown && !raf) raf = requestAnimationFrame(frame);
}

document.addEventListener("pointerover", (e) => {
  if (e.pointerType === "touch") return;
  const el = e.target.closest?.(SEL);
  set(el && !el.disabled ? el : null);
});
document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) set(null); });

// The cursor itself is a DOM element (a native cursor image can't be translucent); an arrow, or an I-beam over text.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const TEXT = "input, textarea, [contenteditable], .tt-line";
  const cur = Object.assign(document.createElement("div"), { className: "pxcur", hidden: true }); // shown on the first move
  cur.append(document.createElement("i"));
  document.body.append(cur);
  document.documentElement.classList.add("pxcur-on");
  document.addEventListener("pointermove", (e) => {
    cur.hidden = false;
    cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cur.classList.toggle("txt", !!e.target.closest?.(TEXT));
  });
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) cur.hidden = true; });
}
