// Tiny pixel-art icons for the RPG look. "#" paints in the current text colour, "a" in the accent colour.
const ICONS = {
  sword: [
    "....##....",
    "...#aa#...",
    "...#aa#...",
    "...#aa#...",
    "...#aa#...",
    "...#aa#...",
    ".########.",
    "....##....",
    "....##....",
    "...####...",
  ],
  chest: [
    ".########.",
    "#aaaaaaaa#",
    "#aaaaaaaa#",
    "##########",
    "#aaa##aaa#",
    "#aaa##aaa#",
    "#aaaaaaaa#",
    "##########",
  ],
  cap: [
    "....##....",
    "..######..",
    "##########",
    ".########.",
    "..#aaaa#..",
    "..#aaaa#..",
    "...####...",
  ],
  heart: [
    ".##..##.",
    "#aa##aa#",
    "#aaaaaa#",
    "#aaaaaa#",
    ".#aaaa#.",
    "..#aa#..",
    "...##...",
  ],
  shield: [
    "#########",
    "#aaaaaaa#",
    "#aaa#aaa#",
    "#aaa#aaa#",
    ".#aaaaa#.",
    "..#aaa#..",
    "...###...",
  ],
};

export default function PixelIcon({ name }) {
  const rows = ICONS[name];
  return (
    <svg className="pxi" viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => c !== "." && <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={c === "a" ? "var(--accent)" : "currentColor"} />),
      )}
    </svg>
  );
}
