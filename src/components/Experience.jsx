const jobs = [
  {
    role: "Full Stack Engineer",
    company: "Blockhouse",
    place: "New York City, USA",
    date: "Aug 2024 – Present",
    points: [
      "Build web apps with Next.js, TypeScript and FastAPI; turn Figma designs into pixel-perfect UI.",
      "Brought the product to iOS, Android and major browsers with React Native and Plasmo.",
      "Built interactive charts and dashboards for financial data.",
      "Cut load time by 38% with server-side rendering, efficient data fetching and memoization.",
      "Cut testing time by 61% with Cypress and built CI/CD pipelines on GitHub Actions.",
    ],
  },
  {
    role: "Web3 Frontend Engineer (Intern)",
    company: "Crypto-Arsenal",
    place: "Taipei, Taiwan (Remote)",
    date: "May 2024 – Oct 2024",
    points: [
      "Built responsive UI components with Next.js, TypeScript and GraphQL.",
      "Introduced Storybook for component development, testing and documentation.",
      "Migrated the v1 codebase to v2 with modern Next.js, React-Aria and React-Resizable.",
      "Shared Git practices and took part in Scrum.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      {jobs.map((j) => (
        <article className="job" key={j.company}>
          <header>
            <h3>{j.role}</h3>
            <p className="muted">
              {j.company} · {j.place} · {j.date}
            </p>
          </header>
          <ul>
            {j.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </article>
      ))}
      <article className="job">
        <header>
          <h3>Memory Maker — Senior Project</h3>
          <p className="muted">Mar 2019 – Aug 2019</p>
        </header>
        <p>
          Pitched and led backend development of an iOS app (5 teammates) with
          ML photography guidance and virtual postcards. 2nd place at the
          International ICT Innovative Services Competition, 2nd place at the
          TKU iOS APP Competition, and Excellence Award at the TKU Information
          Management Project Competition.
        </p>
      </article>
    </section>
  );
}
