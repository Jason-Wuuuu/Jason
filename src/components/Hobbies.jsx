import { useState } from "react";
import PixelIcon from "./PixelIcon";

// Two takes on the same list, to compare: "Bag" (pick an item, a dialog box describes it) and "Side Quests" (a log).
function Bag({ items }) {
  const [sel, setSel] = useState(0);
  const cur = items[Math.min(sel, items.length - 1)];
  return (
    <div className="bag">
      <h3 className="hb">Bag</h3>
      <div className="slots" role="group" aria-label="Hobbies">
        {items.map((h, i) => (
          <button key={i} className="slot" aria-pressed={i === sel} aria-label={h.name} title={h.name} onClick={() => setSel(i)}>
            <PixelIcon name={h.icon} />
          </button>
        ))}
      </div>
      <div className="dialog" aria-live="polite">
        <b>{cur.name}</b>
        <p key={sel}>{cur.line}</p>
      </div>
    </div>
  );
}

function Quests({ items }) {
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

export default function Hobbies({ items }) {
  if (!items.length) return null;
  return (
    <div className="hobbies">
      <Bag items={items} />
      <Quests items={items} />
    </div>
  );
}
