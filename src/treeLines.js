// The skill tree's lines between rows (root tap, rail, a tap to each skill) are an SVG redrawn from where the boxes are right now. Rows scale by different amounts as the page scrolls (App.jsx), and CSS lines glued to each row came apart; these follow the boxes instead. Stems and the bar inside a row stay CSS: they scale with their row.
export default function drawTree(tree) {
  const svg = tree.querySelector(".lines");
  const tr = tree.getBoundingClientRect();
  if (!svg || !tr.width) return; // closed project: nothing to draw
  const at = (e) => e.getBoundingClientRect();
  const root = at(tree.querySelector(".root")), kids = at(tree.querySelector(".kids"));
  const x = Math.round(kids.left - tr.left) + 1; // the rail's centre: a 2px line starting at the kids' left edge
  const ry = Math.round((root.top + root.bottom) / 2 - tr.top);
  const taps = [...tree.querySelectorAll(".row > .n")].map((n) => { const b = at(n); return [Math.round((b.top + b.bottom) / 2 - tr.top), Math.round(b.left - tr.left)]; });
  if (!taps.length) return;
  const set = (cls, d) => svg.querySelector("." + cls)?.setAttribute("d", d);
  set("lr", `M${Math.round(root.right - tr.left)} ${ry}H${x}`);
  set("lv", `M${x} ${Math.min(ry, taps[0][0]) - 1}V${taps[taps.length - 1][0] + 1}`); // +1 each end fills the corners
  svg.querySelectorAll(".lt").forEach((p, i) => p.setAttribute("d", `M${x} ${taps[i][0]}H${taps[i][1]}`));
}
