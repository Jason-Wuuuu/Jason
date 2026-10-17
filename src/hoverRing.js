// Pixel corner brackets that step out around the hovered clickable thing, then step back in on leave.
const SEL = 'a, button, summary, [role="button"], .egg, .pixel-avatar, .gallery > :not(.prev, .next)'; // the last: a project's current screenshot (it opens the viewer; its peeking neighbours slide instead)
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
// A pixel shockwave where the bouncing card hits a wall: two square rings step outwards from the contact point and fade.
function thud(x, y) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  [0, 90].forEach((d) => {
    const el = Object.assign(document.createElement("i"), { className: "thud", onanimationend: () => el.remove() });
    Object.assign(el.style, { left: x + "px", top: y + "px", animationDelay: d + "ms" });
    document.body.append(el);
  });
}
// Easter egg: the card's ▶ button sends it bouncing around the window like an old DVD screensaver (each bounce pulses the accent shadow). Any click, Esc, scroll or resize stops it; so does closing the card.
const PAD = 12; // the bouncing card turns round this far inside its range, leaving room to draw the wall it hit
const HITS = [6, 12]; // each run aims for a corner on a random wall hit in this range
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
// A card bouncing in a W×H box moves in a straight line through a grid of mirrored copies of the box, so it reaches a corner exactly when that line passes through a grid corner: after crossing `a` vertical and `b` horizontal walls, which is hit number a + b - 1 when a and b share no factor. Pick the pair giving the most diagonal line (not a near-vertical crawl), and aim at it. `free`: start in a random direction (otherwise towards the farther wall, e.g. when leaving a corner); `want`: a thrown card's velocity, whose direction wins.
function aim(x, y, lo, hi, speed, free, want) {
  const W = hi[0] - lo[0], H = hi[1] - lo[1], n = HITS[0] + Math.floor(Math.random() * (HITS[1] - HITS[0] + 1));
  const pick = (v, l, h) => { const far = v - l < h - v ? 1 : -1, s = free && Math.random() < .5 ? -far : far; return (s > 0 ? h - v : v - l) < 40 ? far : s; }; // never a random direction straight into a wall
  const sx = want ? (want[0] < 0 ? -1 : 1) : pick(x, lo[0], hi[0]), sy = want ? (want[1] < 0 ? -1 : 1) : pick(y, lo[1], hi[1]);
  const fx = sx > 0 ? hi[0] - x : x - lo[0], fy = sy > 0 ? hi[1] - y : y - lo[1]; // distance to the first wall each way
  let best;
  for (let a = 1; a <= n; a++) {
    const b = n + 1 - a, dx = fx + (a - 1) * W, dy = fy + (b - 1) * H, skew = want ? Math.abs(Math.atan2(dy, dx) - Math.atan2(Math.abs(want[1]), Math.abs(want[0]))) : Math.abs(Math.log(dy / dx)); // the closest to the thrown direction, else the most diagonal
    if (gcd(a, b) === 1 && dx > 0 && dy > 0 && (!best || skew < best.skew)) best = { dx, dy, skew };
  }
  if (!best || W < 8 || H < 8) return [W < 8 ? 0 : sx * 200, H < 8 ? 0 : sy * 160]; // no room to plan with
  const L = Math.hypot(best.dx, best.dy);
  return [sx * speed * best.dx / L, sy * speed * best.dy / L];
}
// The wall the bouncing card just hit lights up for a moment: a dashed line just outside the card along that edge of its range.
function edge(left, top, width, height, dir) {
  const el = Object.assign(document.createElement("i"), { className: "wall", onanimationend: () => el.remove() });
  Object.assign(el.style, { left: left + "px", top: top + "px", width: width + "px", height: height + "px" });
  el.style.setProperty("--d", dir); // dashes run along the line
  document.body.append(el);
}
// A corner hit: the whole page shakes, the profile picture shouts it from its speech bubble and pixel confetti bursts out of the picture, on top of the usual shockwave.
function celebrate() {
  const pic = document.querySelector(".card .pixel-avatar");
  if (!pic) return;
  pic.dispatchEvent(new CustomEvent("say", { detail: "CORNER!" }));
  const root = document.documentElement; // the whole page shakes for half a second
  root.classList.remove("quake"); void root.offsetWidth; root.classList.add("quake");
  setTimeout(() => root.classList.remove("quake"), 500);
  for (let i = 0; i < 36; i++) {
    const a = Math.random() * 2 * Math.PI, d = 70 + Math.random() * 190; // flies out in every direction
    const c = Object.assign(document.createElement("i"), { className: "conf", onanimationend: () => c.remove() });
    c.style.cssText = `left:50%;top:50%;--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px;--c:${['var(--accent)', 'var(--ink)', '#ffc861', '#ff8a7a'][i % 4]};animation-delay:${Math.round(Math.random() * 120)}ms`;
    pic.parentElement.append(c); // inside the picture's wrapper, so it travels with the bouncing card
  }
}
let stopDvd = null;
function dvd(card, btn, want) {
  if (stopDvd) return stopDvd();
  const out = (v, lo, hi) => v < lo || v > hi, near = (v, lo, hi) => Math.min(v - lo, hi - v) < 20;
  const box = () => {
    const r = card.getBoundingClientRect(), h = { top: 0, bottom: innerHeight, height: innerHeight };
    const bx = r.left - (+card.dataset.x || 0), by = r.top - (+card.dataset.y || 0); // where the card rests at 0,0
    const lo = [PAD - bx, h.top + PAD - by], hi = [innerWidth - PAD - r.width - bx, h.bottom - PAD - r.height - by]; // the whole window, less the padding; it passes under the dock and the other controls (dragging stays inside the hero)
    [0, 1].forEach((k) => { if (hi[k] < lo[k]) lo[k] = hi[k] = (lo[k] + hi[k]) / 2; }); // a window too small for the card: it just doesn't move that way
    return { r, h, lo, hi };
  };
  let { lo, hi, h: hr } = box();
  const field = Object.assign(document.createElement("div"), { className: "field", innerHTML: "<i class=tl></i><i class=tr></i><i class=bl></i><i class=br></i>" }); // corner brackets marking the card's whole range (4px outside it, where the wall lines are drawn), for as long as it bounces
  Object.assign(field.style, { left: PAD - 4 + "px", top: hr.top + PAD - 4 + "px", width: innerWidth - 2 * PAD + 8 + "px", height: hr.height - 2 * PAD + 8 + "px" });
  document.body.append(field);
  let x = Math.min(hi[0], Math.max(lo[0], +card.dataset.x || 0)), y = Math.min(hi[1], Math.max(lo[1], +card.dataset.y || 0)), last = 0, raf = 0, pulse = 0, cheered = 0, hits = 0;
  let [vx, vy] = aim(x, y, lo, hi, 260, true, want); // px per second
  const untrail = trail(card, card.getBoundingClientRect(), +card.dataset.x || 0, +card.dataset.y || 0, [.12, .07, .04]); // the shadow clones that trail a dragged card follow the bouncing one too, further back since it moves slowly
  const frame = (t) => {
    if (!card.isConnected) return stopDvd();
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    ({ lo, hi, h: hr } = box());
    x += vx * dt; y += vy * dt;
    const hitX = out(x, lo[0], hi[0]), hitY = out(y, lo[1], hi[1]);
    const corner = (hitX && near(y, lo[1], hi[1])) || (hitY && near(x, lo[0], hi[0]));
    if (hitX) { x = x < lo[0] ? 2 * lo[0] - x : 2 * hi[0] - x; vx = -vx; } // mirror the overshoot rather than clamp, so the aimed path stays exact
    if (hitY) { y = y < lo[1] ? 2 * lo[1] - y : 2 * hi[1] - y; vy = -vy; }
    place(card, Math.round(x / SNAP) * SNAP, Math.round(y / SNAP) * SNAP);
    if (hitX || hitY) {
      if (++hits % 5 === 0) card.querySelector(".pixel-avatar")?.click(); // every fifth bounce the profile picture gets "clicked": it flips and says hi
      card.classList.add("lifted"); clearTimeout(pulse); pulse = setTimeout(() => card.classList.remove("lifted"), 150);
      const q = card.getBoundingClientRect(); // the shockwave starts on the edge that hit (vx/vy have just flipped), at the card's middle along it
      if (hitX) edge(vx < 0 ? innerWidth - PAD : PAD - 4, hr.top + PAD, 4, hr.height - 2 * PAD, "180deg"); // vx has just flipped: moving left now means it hit the right wall
      if (hitY) edge(PAD, vy < 0 ? hr.bottom - PAD : hr.top + PAD - 4, innerWidth - 2 * PAD, 4, "90deg");
      thud(hitX ? (vx < 0 ? q.right : q.left) : q.left + q.width / 2, hitY ? (vy < 0 ? q.bottom : q.top) : q.top + q.height / 2);
      if (!corner) knock(card); // a corner gets the full shake-off instead
      if (corner && t - cheered > 800) { // one cheer per corner: the second wall of a corner hit also counts as "near"
        cheered = t;
        celebrate(); shakeOff(card);
        const lit = field.querySelector("." + ((hitY ? vy < 0 : y - lo[1] > hi[1] - y) ? "b" : "t") + ((hitX ? vx < 0 : x - lo[0] > hi[0] - x) ? "r" : "l")); // the bracket of the corner it reached (vx/vy have just flipped): bigger, in the accent, for a while
        lit.classList.add("hit"); setTimeout(() => lit.classList.remove("hit"), 3000);
        [vx, vy] = aim(x, y, lo, hi, 260); // and a new random corner is lined up
      }
    }
    raf = requestAnimationFrame(frame);
  };
  const off = (e) => (e.type !== "keydown" || e.key === "Escape") && !e.target.closest?.(".bounce") && stopDvd(); // the button itself toggles, on click
  const evs = ["pointerdown", "keydown", "scroll", "resize"];
  stopDvd = () => {
    cancelAnimationFrame(raf); clearTimeout(pulse); field.remove(); untrail();
    card.classList.remove("dvd", "lifted"); btn?.setAttribute("aria-pressed", "false");
    evs.forEach((e) => removeEventListener(e, off));
    stopDvd = null;
  };
  card.classList.add("dvd"); btn?.setAttribute("aria-pressed", "true");
  evs.forEach((e) => addEventListener(e, off));
  raf = requestAnimationFrame(frame);
}
document.addEventListener("click", (e) => { const b = e.target.closest?.(".card .bounce"); if (b) dvd(b.closest(".card"), b); });
// Let go of the player card mid-flick (over 900px/s, still moving as the button comes up) and it is thrown: it bounces off from there, roughly the way it was thrown.
function fling(card, trace) {
  const a = trace[0], z = trace.at(-1);
  if (!a || a === z || card.matches(".shaken, .back") || performance.now() - z[0] > 60 || z[0] <= a[0] || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const dt = (z[0] - a[0]) / 1000, v = [(z[1] - a[1]) / dt, (z[2] - a[2]) / dt];
  if (Math.hypot(...v) <= 900) return;
  document.querySelectorAll(".ghost").forEach((g) => g.remove()); // the drag's clones are still catching up: the bounce brings its own three
  dvd(card, card.querySelector(".bounce"), v);
}
// A bounce knocks a couple of small pieces off the card (a letter, a skill row, a link): they tumble down like in the shake-off and climb back after a moment, so the card is never left broken.
function knock(card) {
  if (card.matches(".shaken, .back") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const free = [...card.querySelectorAll(".ch, .stats li, .social a")].filter((el) => !el.matches(".fall, .refit"));
  for (let i = 0; i < 2 && free.length; i++) {
    const el = free.splice(Math.floor(Math.random() * free.length), 1)[0];
    el.style.setProperty("--fx", Math.round(Math.random() * 240 - 120) + "px");
    el.style.setProperty("--fr", Math.round(Math.random() * 360 - 180) + "deg");
    el.classList.add("fall");
    setTimeout(() => {
      el.classList.remove("fall");
      if (!el.matches(".ch")) { el.classList.add("refit"); setTimeout(() => el.classList.remove("refit"), 400); } // letters restore through their own intro animation
    }, 1500);
  }
}
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
function trail(card, r, x0, y0, ks = [.35, .22, .12]) { // ks: how fast each clone closes the gap per frame (slower = a longer trail)
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const gs = ks.map((k) => { const el = document.createElement("div"); el.className = "ghost"; Object.assign(el.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" }); card.before(el); return { el, k, x: x0, y: y0 }; });
  let live = true;
  const tick = () => {
    const tx = +card.dataset.x || 0, ty = +card.dataset.y || 0;
    gs.forEach((g) => { g.x += (tx - g.x) * g.k; g.y += (ty - g.y) * g.k; g.el.style.transform = `translate(${Math.round((g.x - x0) / SNAP) * SNAP}px, ${Math.round((g.y - y0) / SNAP) * SNAP}px)`; });
    if (live || gs.some((g) => Math.abs(tx - g.x) + Math.abs(ty - g.y) > 1)) requestAnimationFrame(tick); else gs.forEach((g) => g.el.remove());
  };
  requestAnimationFrame(tick);
  return () => { live = false; };
}
let top = 25; // windows come to the front when touched, and when they open
export const front = (w) => { w.style.zIndex = ++top; };
document.addEventListener("pointerdown", (e) => { const w = e.target.closest?.(".win"); if (w) front(w); });
document.addEventListener("pointerdown", (e) => {
  const bar = e.target.closest?.(BAR);
  if (!bar || e.target.closest("button") || e.button || !matchMedia("(min-width: 701px) and (hover: hover)").matches) return; // phones scroll instead
  e.preventDefault(); // no text selection while dragging
  const card = bar.parentElement, r = card.getBoundingClientRect(), x0 = +card.dataset.x || 0, y0 = +card.dataset.y || 0;
  const h = card.parentElement.matches(".hero") ? card.parentElement.getBoundingClientRect() : { top: 0, bottom: innerHeight };
  const b = { left: 0, right: innerWidth, top: h.top, bottom: h.bottom }; // free across the screen; the card stays within the hero's height (never over other sections), the window within the screen
  let dir = 0, ext = e.clientX, turns = []; // the card's own shake detector: direction changes of 40px or more
  const trace = []; // the pointer's last 100ms, to tell a throw
  const move = (m) => {
    const now = performance.now(); trace.push([now, m.clientX, m.clientY]); while (trace[0][0] < now - 100) trace.shift();
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
  const drop = (u) => { stop(); card.classList.remove("lifted"); bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", drop); bar.removeEventListener("pointercancel", drop); if (u.type === "pointerup" && card.matches(".card")) fling(card, trace); };
  card.classList.add("lifted");
  bar.setPointerCapture(e.pointerId);
  bar.addEventListener("pointermove", move);
  bar.addEventListener("pointerup", drop);
  bar.addEventListener("pointercancel", drop);
});
// Scrolled right past the hero, the player card goes home unseen (a bounce has already stopped on the scroll).
addEventListener("scroll", () => {
  const card = document.querySelector(".hero > .card");
  if (card && (+card.dataset.x || +card.dataset.y) && card.parentElement.getBoundingClientRect().bottom < 0) place(card, 0, 0);
}, { passive: true });
document.addEventListener("dblclick", (e) => {
  const bar = e.target.closest?.(BAR);
  if (bar) place(bar.parentElement, 0, 0);
});
