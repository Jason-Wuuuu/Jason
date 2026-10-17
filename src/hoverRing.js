// Pixel corner brackets that step out around the hovered clickable thing, then step back in on leave.
const SEL = 'a, button, summary, [role="button"], .egg, .pixel-avatar';
const GAP = 8; // px between the target (shadow included) and the brackets, once fully out
const STEP = matchMedia("(prefers-reduced-motion: reduce)").matches ? GAP : 2; // px per tick, one tick every 45ms
const ring = Object.assign(document.createElement("div"), { className: "ring" });
document.body.append(ring);

let target = null, shown = null, pad = 0, last = 0, raf = 0;

// A photo in the About pile is bracketed together with the whole pile: brackets round just one under-photo would be drawn across the photos on top of it.
function rect(el) {
  const pile = el.closest('.photos[data-stack="true"]');
  if (!pile) return el.getBoundingClientRect();
  const rs = [...pile.querySelectorAll("img")].map((i) => i.getBoundingClientRect());
  const left = Math.min(...rs.map((b) => b.left)), top = Math.min(...rs.map((b) => b.top));
  return { left, top, right: Math.max(...rs.map((b) => b.right)), bottom: Math.max(...rs.map((b) => b.bottom)) };
}

function frame(t) {
  if (t - last > 45) { last = t; pad = target ? Math.min(GAP, pad + STEP) : Math.max(0, pad - STEP); }
  if (!target && !pad || !shown?.isConnected) { ring.style.display = "none"; shown = null; raf = 0; return; }
  const r = rect(shown);
  const [sx = 0, sy = 0] = (getComputedStyle(shown).boxShadow.match(/-?[\d.]+px/g) || []).map(parseFloat); // the hard pixel shadow counts as part of the target
  const ox = shown.tagName === "SUMMARY" ? pad - GAP : pad; // an accordion row steps out to flush with its (padded) edges, and stays 4px under the dashed rule so the top brackets don't sit on it
  const oy = shown.tagName === "SUMMARY" ? ox - 4 : pad;
  const left = r.left - ox - Math.max(0, -sx), top = r.top - oy - Math.max(0, -sy);
  const right = r.right + ox + Math.max(0, sx), bottom = r.bottom + oy + Math.max(0, sy);
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
  set(el && !el.disabled && !el.closest(".zoom") ? el : null); // the full-size viewer's buttons get no brackets, and must not push the screenshot around
});
document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) set(null); });

// The cursor itself is a DOM element (a native cursor image can't be translucent); an arrow, or an I-beam over text.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const TEXT = "input, textarea, [contenteditable], .tt-line";
  let over = null, flips = 0;
  const cur = Object.assign(document.createElement("div"), { className: "pxcur", hidden: true }); // shown on the first move
  cur.append(document.createElement("i"));
  document.body.append(cur);
  document.documentElement.classList.add("pxcur-on");
  document.addEventListener("pointermove", (e) => {
    cur.hidden = false;
    cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cur.classList.toggle("txt", !!e.target.closest?.(TEXT));
    const el = e.target.closest?.(SEL + ", .grip, .bar, .gallery img"); // the progress arrow and the title bars count for the cursor, but gets no brackets
    cur.classList.toggle("hot", !!el); // over something clickable: the arrow grows a step
    if (el && el !== over) cur.firstChild.style.setProperty("--r", ++flips * 180 + "deg"); // and flips another half turn, so sliding between neighbours flips each time
    over = el;
  });
  document.addEventListener("pointerdown", () => cur.classList.add("down"));
  document.addEventListener("pointerup", () => cur.classList.remove("down"));
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) cur.hidden = true; });
}

// The player card and the typing test window drag by their title bars, in whole 4px steps, and stays where it is dropped (double-click the bar to put it back).
const SNAP = 4, BAR = ".card > .bar, .win > .bar";
const place = (card, x, y) => { card.dataset.x = x; card.dataset.y = y; card.style.setProperty("--dx", x + "px"); card.style.setProperty("--dy", y + "px"); };
// Easter egg: shake the player card (five quick turns in one second) and everything on it falls off, then climbs back.
const FALL = ".ch, .pixel-avatar, .cls, .lead, .social a, .stats li";
function shakeOff(card) {
  if (card.matches(".shaken, .back") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  card.querySelectorAll(FALL).forEach((el) => {
    el.style.setProperty("--fx", Math.round(Math.random() * 240 - 120) + "px");
    el.style.setProperty("--fr", Math.round(Math.random() * 360 - 180) + "deg");
    el.style.setProperty("--fd", Math.round(Math.random() * 300) + "ms");
  });
  card.classList.add("shaken");
  setTimeout(() => { card.classList.replace("shaken", "back"); setTimeout(() => card.classList.remove("back"), 500); }, 1800);
}
// Shadow clones: while the card is carried, a few empty frames trail behind it at different speeds and catch up once it's dropped.
function trail(card, r, x0, y0) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const gs = [.35, .22, .12].map((k) => { const el = document.createElement("div"); el.className = "ghost"; Object.assign(el.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" }); card.before(el); return { el, k, x: x0, y: y0 }; });
  let live = true;
  const tick = () => {
    const tx = +card.dataset.x || 0, ty = +card.dataset.y || 0;
    gs.forEach((g) => { g.x += (tx - g.x) * g.k; g.y += (ty - g.y) * g.k; g.el.style.transform = `translate(${Math.round((g.x - x0) / SNAP) * SNAP}px, ${Math.round((g.y - y0) / SNAP) * SNAP}px)`; });
    if (live || gs.some((g) => Math.abs(tx - g.x) + Math.abs(ty - g.y) > 1)) requestAnimationFrame(tick); else gs.forEach((g) => g.el.remove());
  };
  requestAnimationFrame(tick);
  return () => { live = false; };
}
let top = 25; // windows come to the front when touched
document.addEventListener("pointerdown", (e) => { const w = e.target.closest?.(".win"); if (w) w.style.zIndex = ++top; });
document.addEventListener("pointerdown", (e) => {
  const bar = e.target.closest?.(BAR);
  if (!bar || e.target.closest("button") || e.button || !matchMedia("(min-width: 701px) and (hover: hover)").matches) return; // phones scroll instead
  e.preventDefault(); // no text selection while dragging
  const card = bar.parentElement, r = card.getBoundingClientRect(), x0 = +card.dataset.x || 0, y0 = +card.dataset.y || 0;
  const h = card.parentElement.matches(".hero") ? card.parentElement.getBoundingClientRect() : { top: 0, bottom: innerHeight };
  const b = { left: 0, right: innerWidth, top: h.top, bottom: h.bottom }; // free across the screen; the card stays within the hero's height (never over other sections), the window within the screen
  let dir = 0, ext = e.clientX, turns = []; // the card's own shake detector: direction changes of 40px or more
  const move = (m) => {
    if (card.matches(".card")) {
      if ((m.clientX - ext) * dir > 0) ext = m.clientX;
      else if (Math.abs(m.clientX - ext) > 40) {
        dir = m.clientX > ext ? 1 : -1; ext = m.clientX;
        const now = performance.now();
        turns = [...turns.filter((t) => now - t < 1000), now];
        if (turns.length >= 5) { turns = []; shakeOff(card); }
      }
    }
    const x = Math.min(b.right - r.right + x0, Math.max(b.left - r.left + x0, x0 + m.clientX - e.clientX));
    const y = Math.min(b.bottom - r.bottom + y0, Math.max(b.top - r.top + y0, y0 + m.clientY - e.clientY));
    place(card, Math.round(x / SNAP) * SNAP, Math.round(y / SNAP) * SNAP);
  };
  const stop = trail(card, r, x0, y0);
  const drop = () => { stop(); card.classList.remove("lifted"); bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", drop); bar.removeEventListener("pointercancel", drop); };
  card.classList.add("lifted");
  bar.setPointerCapture(e.pointerId);
  bar.addEventListener("pointermove", move);
  bar.addEventListener("pointerup", drop);
  bar.addEventListener("pointercancel", drop);
});
document.addEventListener("dblclick", (e) => {
  const bar = e.target.closest?.(BAR);
  if (bar) place(bar.parentElement, 0, 0);
});

// Windows trail the page a little while it scrolls: nudged against the scroll, in 4px steps, then they settle back (never more than 16px, and never away from where they were put).
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let off = 0, last = scrollY, timer = 0;
  const show = () => document.documentElement.style.setProperty("--py", Math.round(off / SNAP) * SNAP + "px");
  const settle = () => { off = Math.abs(off) < 2 ? 0 : off * 0.6; show(); timer = off ? setTimeout(settle, 45) : 0; };
  addEventListener("scroll", () => {
    off = Math.max(-16, Math.min(16, off - (scrollY - last) * 0.35)); last = scrollY;
    show();
    clearTimeout(timer); timer = setTimeout(settle, 45);
  }, { passive: true });
}
