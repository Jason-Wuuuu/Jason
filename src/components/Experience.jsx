const jobs = [
  {
    role: "Full Stack Engineer",
    company: "Blockhouse",
    place: "New York City",
    date: "Aug 2024 – now",
    points: [
      "Build web apps with Next.js, TypeScript and FastAPI; turn Figma designs into pixel-perfect UI.",
      "Brought the product to iOS, Android and major browsers with React Native and Plasmo.",
      "Built interactive charts and dashboards for financial data.",
      "Cut load time by 38% with server-side rendering, efficient data fetching and memoization.",
      "Cut testing time by 61% with Cypress and built CI/CD pipelines on GitHub Actions.",
    ],
  },
  {
    role: "Web3 Frontend Engineer, intern",
    company: "Crypto-Arsenal",
    place: "Taipei, remote",
    date: "May – Oct 2024",
    points: [
      "Built responsive UI components with Next.js, TypeScript and GraphQL.",
      "Introduced Storybook for component development, testing and documentation.",
      "Migrated the v1 codebase to v2 with modern Next.js, React-Aria and React-Resizable.",
      "Shared Git practices and took part in Scrum.",
    ],
  },
  {
    role: "M.S. Computer Science",
    company: "Stevens Institute of Technology",
    place: "Hoboken, NJ",
    date: "Sep 2022 – May 2024",
    points: ["GPA 3.9 / 4.0."],
  },
  {
    role: "Senior project: Memory Maker",
    company: "Tamkang University",
    place: "Taiwan",
    date: "Mar – Aug 2019",
    points: [
      "Pitched and led backend development of an iOS app with ML photography guidance and virtual postcards, built with 5 teammates.",
      "2nd place, International ICT Innovative Services Competition. 2nd place, TKU iOS APP Competition. Excellence Award, TKU Information Management Project Competition.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <ol className="timeline">
        {jobs.map((j) => (
          <li key={j.role}>
            <p className="when">
              {j.date}
              <br />
              {j.place}
            </p>
            <div>
              <h3>{j.role}</h3>
              <p className="org">{j.company}</p>
              <ul>
                {j.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
