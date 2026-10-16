import { ICONS } from "../pixelicons";

const FILL = { "#": "currentColor", a: "var(--accent)", r: "#e5484d", w: "#f4f2ee", k: "#1f1f21" };

export default function PixelIcon({ name }) {
  const rows = ICONS[name] || ICONS.star;
  return (
    <svg className="pxi" viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((c, x) => c !== "." && <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={FILL[c]} />))}
    </svg>
  );
}
