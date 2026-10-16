// Hobbies as a quest board: a notice pinned up for each one.
export default function Hobbies({ items }) {
  if (!items.length) return null;
  return (
    <div className="quests">
      <h3 className="hb">Side Quests</h3>
      <ul className="board">
        {items.map((h, i) => (
          <li key={i} className="notice">
            <span className="pin" aria-hidden="true" />
            <h4>{h.name}</h4>
            <p>{h.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
