import { Fragment, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";

import ProjectCard from "./ProjectCard";

const projects = [
  // {
  //   title: "Visual Board",
  //   year: "2024",
  //   description: "Interactive data visualization / dashboard",
  //   tech_stack: "React, FastAPI",
  //   githubUrl: "",
  //   demoUrl: "",
  //   screenshots: [],
  // },
  {
    title: "Stevens Marketplace",
    year: "2023",
    description:
      "A community-centric platform featuring pre-owned items discovery/management and secure direct messaging.",
    tech_stack: "React, GraphQL, MongoDB, Firebase, Redis, S3, Docker, Git",
    githubUrl: "https://github.com/Jason-Wuuuu/CS554-GroupVVIV",
    demoUrl: "",
    screenshots: ["stevens_marketplace/home.png"],
  },
  {
    title: "EventMaster",
    year: "2023",
    description:
      "Full-stack web app utilizing Eventbrite & Ticketmaster APIs, featuring seamless event discovery, interactive voting, and personalized schedule planning.",
    tech_stack:
      "React, Node.js, Express.js, Python, MongoDB, Jira, Docker, Git",
    githubUrl: "https://github.com/Jason-Wuuuu/CS555A-Team19-Project",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Marvel Comic App",
    year: "2023",
    description:
      "Full-stack web application integrating Marvel API for comic discovery and collection.",
    tech_stack: "Node.js, React, Apollo, GraphQL, Redis, Redux",
    githubUrl: "https://github.com/Jason-Wuuuu/Marvel-Comic-Web-App",
    demoUrl: "https://www.youtube.com/watch?v=rKfUaeMGa3w",
    screenshots: [
      "marvel_app/home.png",
      "marvel_app/list.png",
      "marvel_app/detail.png",
      "marvel_app/collection.png",
    ],
  },
  {
    title: "Breast Cancer Detection/Prediction",
    year: "2022",
    description:
      "Logistic regression classifier fully coded from scratch with Python to detect/predict breast cancer.",
    tech_stack: "Python, NumPy",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Memory Maker",
    year: "2019",
    description:
      "iOS app for composition suggestions in mobile photography and virtual postcard sharing.",
    tech_stack: "Python, TensorFlow, Firebase, Swift, Sketch, Core ML",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
];

function Projects() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Fragment>
      <Fade in>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          mt={10}
          mb={2}
        >
          Projects
        </Typography>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1000 }}>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          direction="column"
        >
          {projects.map((project, i) => {
            return <ProjectCard key={i} project={project} />;
          })}
        </Grid>
      </Fade>
    </Fragment>
  );
}
export default Projects;
