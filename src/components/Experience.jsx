import site from "../content";

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <ol className="timeline">
        {site.experience.map((j, i) => (
          <li key={i}>
            <p className="when">
              {j.date}
              <br />
              {j.place}
            </p>
            <div>
              <h3>{j.role}</h3>
              <p className="org">{j.company}</p>
              <ul>
                {j.points.map((p, k) => (
                  <li key={k}>{p}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
