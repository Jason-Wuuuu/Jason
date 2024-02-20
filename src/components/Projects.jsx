import { Fragment, useEffect, useMemo } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Visual Board",
    year: "2024 Personal Project",
    description: "Interactive data visualization / dashboard",
    tech_stack: "React, MUI, Python, FastAPI, yfinance, Redis",
    githubUrl: "https://github.com/Jason-Wuuuu/VisualBoard",
    demoUrl: "",
    screenshots: ["visual_board/stock.png"],
  },
  {
    title: "Stevens Marketplace",
    year: "2023 Group Project",
    description:
      "A community-centric platform featuring pre-owned items discovery/management and secure direct messaging.",
    tech_stack: "React, GraphQL, MongoDB, Firebase, Redux, Redis, S3",
    githubUrl: "https://github.com/Jason-Wuuuu/CS554-GroupVVIV",
    demoUrl: "",
    screenshots: [
      "stevens_marketplace/demo.gif",
      "stevens_marketplace/chat.gif",
    ],
  },
  {
    title: "EventMaster",
    year: "2023 Group Project",
    description:
      "Full-stack web app utilizing Eventbrite & Ticketmaster APIs, featuring seamless event discovery, interactive voting, and personalized schedule planning.",
    tech_stack: "React, Node.js, Express.js, Python, MongoDB, Jira",
    githubUrl: "https://github.com/Jason-Wuuuu/CS555A-Team19-Project",
    demoUrl: "",
    screenshots: [
      "event_master/home.png",
      "event_master/profile.png",
      "event_master/eventlist.png",
      "event_master/eventdetail.png",
      "event_master/eventpoll.png",
    ],
  },
  {
    title: "Marvel Comic App",
    year: "2023 Course Project",
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
    year: "2022 Course Project",
    description:
      "Logistic regression classifier fully coded from scratch with Python to detect/predict breast cancer.",
    tech_stack: "Python, NumPy",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Memory Maker",
    year: "2019 Undergrad Senior Project",
    description:
      "iOS app for composition suggestions in mobile photography and virtual postcard sharing. Achieved 2nd place in the competition for International ICT Innovative Services Awards.",
    tech_stack: "Python, TensorFlow, Firebase, Swift, Sketch, Core ML",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["memory_maker/demo.gif"],
  },
];

function Projects() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projectCards = useMemo(() => {
    return projects.map((project) => (
      <ProjectCard key={project.title} project={project} />
    ));
  }, []);

  return (
    <Fragment>
      <Fade in>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt={10}
          mb={2}
        >
          <Typography variant="h4" fontWeight="bold" align="center">
            Projects
          </Typography>

          <Typography
            variant="caption"
            align="center"
            color="text.secondary"
            my={1}
          >
            I'm constantly updating and adding to my selected projects page, so
            stay tuned for more!
          </Typography>
        </Box>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          direction="column"
        >
          {projectCards}
        </Grid>
      </Fade>
    </Fragment>
  );
}
export default Projects;
