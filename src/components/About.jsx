import { asset } from "../App";

const blocks = [
  {
    title: "Who I am",
    image: "me_1",
    text: "Hey! I'm Jason, a software engineer from Taiwan. I finished my Master's in CS at Stevens Institute of Technology in 2024. I love web development and digging into AI/ML, and building projects with new tech.",
  },
  {
    title: "Things I like",
    image: "me_2",
    text: "Away from the keyboard you'll find me snowboarding or binge-watching anime. Programming isn't just a job for me — it's what keeps my curiosity going.",
  },
  {
    title: "I'm good at",
    image: "me_3",
    text: "Python, Java, JavaScript/TypeScript and the frameworks around them — from web apps to machine learning. I learn fast and adapt to whatever the team needs.",
  },
];

export default function About() {
  return (
    <section id="about">
      <h2>About me</h2>
      <div className="grid three">
        {blocks.map((b) => (
          <article className="card" key={b.title}>
            <img src={asset(`images/me/${b.image}.png`)} alt={b.title} loading="lazy" />
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
