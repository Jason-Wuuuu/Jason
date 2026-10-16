import site, { withLinks } from "../content";
import PixelIcon from "./PixelIcon";

// A point starting with "- " becomes a sub-bullet of the point above it.
const nest = (points) =>
  points.reduce((out, p) => {
    if (/^- /.test(p) && out.length) out.at(-1)[1].push(p.slice(2));
    else out.push([p, []]);
    return out;
  }, []);

export default function Experience({ id = "experience", title = "Quests", sub = "Experience", icon = "sword", items = site.experience }) {
  return (
    <section id={id}>
      <h2 aria-label={`${title}, ${sub}`}><PixelIcon name={icon} />{title}<small>{sub}</small></h2>
      <ol className="timeline">
        {items.map((j, i) => (
          <li key={i}>
            <p className="when">
              {j.date}
              {j.place && <span className="dot"> · </span>}
              <br />
              {j.place}
            </p>
            <div>
              <h3>{j.role}</h3>
              <p className="org">{j.company}</p>
              <ul>
                {nest(j.points).map(([p, sub], k) => (
                  <li key={k}>
                    {withLinks(p)}
                    {sub.length > 0 && (
                      <ul>
                        {sub.map((q, n) => (
                          <li key={n}>{withLinks(q)}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
