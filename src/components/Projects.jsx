import { Fragment, useState, useEffect, useMemo } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Visual Board",
    year: "2024",
    course: "Personal",
    category: "Web APP",
    description: "Interactive data visualization / dashboard",
    tech_stack: "React, MUI, Python, FastAPI, yfinance, Redis",
    githubUrl: "https://github.com/Jason-Wuuuu/VisualBoard",
    demoUrl: "",
    screenshots: ["visual_board/stock.png"],
  },
  {
    title: "Author Classification",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "Multi-class text classifier fully coded from scratch in Python to classify sentences into their corresponding author with optimization, regularization and cross-validation implemented.",
    tech_stack: "Python, NumPy, NLTK",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Stevens Marketplace",
    year: "2023",
    course: "Web Programming",
    category: "Web APP",
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
    year: "2023",
    course: "Agile Methods for Software Dev",
    category: "Web APP",
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
    year: "2023",
    course: "Web Programming",
    category: "Web APP",
    description:
      "Full-stack web application integrating Marvel API for comic discovery and collection.",
    tech_stack: "React, Node.js, Apollo, GraphQL, Redis, Redux",
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
    course: "ML Course",
    category: "ML/DL",
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
    course: "Undergrad Senior",
    category: "iOS APP",
    description:
      "iOS app for composition suggestions in mobile photography and virtual postcard sharing. Achieved 2nd place in the competition for International ICT Innovative Services Awards.",
    tech_stack: "Python, TensorFlow, Firebase, Swift, Sketch, Core ML",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["memory_maker/demo.gif"],
  },
];

function Projects() {
  const [tab, setTab] = useState(0);
  const handleTab = (event, newValue) => setTab(newValue);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(projects.map((project) => project.category)),
    ];
    return uniqueCategories;
  }, []);

  const filteredProjects = useMemo(() => {
    if (tab === 0) {
      return projects; // Show all projects
    } else {
      const selectedCategory = categories[tab - 1]; // -1 to adjust for "All" tab
      return projects.filter(
        (project) => project.category === selectedCategory
      );
    }
  }, [tab]);

  const projectCards = useMemo(() => {
    return filteredProjects.map((project) => (
      <ProjectCard key={project.title} project={project} />
    ));
  }, [filteredProjects]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [tab]);

  return (
    <Grid container width="100%" direction="column">
      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid item mt={10}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold" align="center">
              Projects
            </Typography>

            <Typography
              variant="caption"
              align="center"
              color="text.secondary"
              mt={1}
            >
              I'm constantly updating and adding to my selected projects page,
              so stay tuned for more!
            </Typography>
          </Box>
        </Grid>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid item my={4}>
          <Grid
            container
            justifyContent="center"
            alignContent="center"
            direction="column"
          >
            {projectCards}
          </Grid>
        </Grid>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid item>
          <Box
            width="100%"
            bgcolor="#242424"
            position="fixed"
            right={0}
            bottom={0}
            zIndex={1000}
            sx={{ opacity: 0.95 }}
          >
            <Tabs textColor="inherit" value={tab} onChange={handleTab} centered>
              <Tab key="all" label="All" />
              {categories.map((category, index) => (
                <Tab key={`${category}-${index}`} label={category} />
              ))}
            </Tabs>
          </Box>
        </Grid>
      </Fade>
    </Grid>
  );
}
export default Projects;
