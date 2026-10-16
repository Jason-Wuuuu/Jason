import { asset } from "../App";

export default function About() {
  return (
    <section id="about">
      <h2>About</h2>
      <div className="about">
        <div className="prose">
          <p>
            I'm from Taiwan and moved to New York for a CS master's at Stevens.
            I like web development, and I like digging into AI and machine
            learning. Building a project with unfamiliar tech is how I learn
            fastest.
          </p>
          <p>
            Away from the keyboard I'm usually snowboarding or catching up on
            anime. I also type fast: 118 WPM at 100% accuracy on a 15-second{" "}
            <a href="https://monkeytype.com/" target="_blank" rel="noopener noreferrer">
              MonkeyType
            </a>{" "}
            test, which puts me in the top 26%.
          </p>
        </div>
        <img src={asset("images/me/me_2.png")} alt="Jason" loading="lazy" />
      </div>
    </section>
  );
}
