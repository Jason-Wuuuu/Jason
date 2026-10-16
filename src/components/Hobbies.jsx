import PixelIcon from "./PixelIcon";

// Hobbies as a quest log: an icon, a name and one line each.
export default function Hobbies({ items }) {
  if (!items.length) return null;
  return (
    <div className="quests">
      <h3 className="hb">Side Quests</h3>
      <ol className="timeline">
        {items.map((h, i) => (
          <li key={i}>
            <div className="q-icon">
              <PixelIcon name={h.icon} />
            </div>
            <div>
              <h3>{h.name}</h3>
              <p>{h.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
