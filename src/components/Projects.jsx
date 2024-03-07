import { useState, useEffect, useMemo, Fragment } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Fab from "@mui/material/Fab";
import Accordion from "@mui/material/Accordion";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Stock Price Prediction",
    year: "2024",
    course: "Personal",
    category: "ML/DL",
    description:
      "A LSTM model to predict stock prices based on historical data, trained using a variety of features and technical indicators, results in a R^2 score of 0.96 on average and Mean Absolute Percentage Error of 0.1% on average.",
    tech_stack:
      "Python, TensorFlow, NumPy, Pandas, scikit-learn, Matplotlib, yfinance",
    githubUrl: "https://github.com/Jason-Wuuuu/stock_price_prediction",
    demoUrl: "",
    screenshots: [
      "stock_price_lstm/TSLA.png",
      "stock_price_lstm/NVDA.png",
      "stock_price_lstm/AAPL.png",
      "stock_price_lstm/PLTR.png",
    ],
  },
  {
    title: "Word2Vec Skip-Gram Model",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "Word2Vec Skip-Gram model using TensorFlow to analyze and generate word embeddings from the IMDB movie review dataset, enhancing the understanding of semantic word relationships.",
    tech_stack: "Python, NLTK, TensorFlow, NumPy, scikit-learn, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["word2vec/word_vec.png"],
  },
  {
    title: "Multi-Layer Perceptron Model",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "Multi-Layer Perceptron (MLP) model from scratch in Python, applying concepts of neural networks to perform multi-class text classification on a large dataset, demonstrating deep understanding of foundational machine learning algorithms.",
    tech_stack: "Python, NLTK, TensorFlow, NumPy, scikit-learn, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["mlp/score.png"],
  },
  {
    title: "Visual Board",
    year: "2024",
    course: "Personal",
    category: "Web APP",
    description: "Interactive data visualization / dashboard",
    tech_stack: "React, MUI, Python, FastAPI, yfinance, Redis",
    githubUrl: "https://github.com/Jason-Wuuuu/VisualBoard",
    demoUrl: "https://youtu.be/hOSht_Mvv34",
    screenshots: ["visual_board/stock1.png", "visual_board/stock2.png"],
  },
  {
    title: "Author Classification",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "Multi-class text classifier fully coded from scratch in Python to classify sentences into their corresponding author employing advanced text preprocessing techniques including regular expression-based cleaning, tokenization, and TF-IDF vectorization, with optimization, regularization and cross-validation implemented.",
    tech_stack: "Python, NumPy, NLTK",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Stevens Marketplace",
    year: "2023",
    course: "Web Programming Course",
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
    course: "Agile Methods for Software Dev Course",
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
    course: "Web Programming Course",
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
    title: "SVM (Support Vector Machine)",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "This course work entails deriving the hyperplane equation from given data points and Lagrange multipliers, calculating distances to the hyperplane, and classifying new points, demonstrating key SVM concepts and geometric interpretations.",
    tech_stack: "Python, NumPy, Pandas, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["svm/hyperplane.png"],
  },
  {
    title: "Breast Cancer Detection",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "This course work involves implementing logistic regression from scratch for breast cancer diagnosis, focusing on Stochastic and Mini-Batch Gradient Descent optimizations, and evaluating model performance through precision, recall, and accuracy metrics.",
    tech_stack: "Python, NumPy, Pandas, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "PCA (Principal Component Analysis)",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "This coursework involves dimensionality reduction on a diabetes dataset using Principal Component Analysis (PCA), implemented with Python's sklearn library. It begins by normalizing the dataset, then applies PCA to reduce the feature space from eight dimensions to two.",
    tech_stack: "Python, NumPy, Pandas, Matplotlib, scikit-learn",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["pca/principal_components.png"],
  },
  {
    title: "SVD (Singular Value Decomposition)",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "This coursework entails a practical implementation of SVD to compress images. It includes defining functions for image processing, and applying SVD to decompose and reconstruct images at varying levels of compression.",
    tech_stack: "Python, NumPy, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["svd/image_compression.png"],
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

function TableOfContents({ projects }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleJump = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - 100, // Subtract the offset to the element's top position
        behavior: "smooth",
      });
    }
  };

  const listItems = useMemo(
    () =>
      projects.map((project, index) => (
        <MenuItem
          // dense
          key={index}
          onClick={() => {
            handleClose();
            handleJump(`project-${index}`);
          }}
          sx={{
            fontWeight: "bold",
          }}
        >
          {project.title}
        </MenuItem>
      )),
    [projects]
  );

  return (
    <Fragment>
      <Fade in timeout={500}>
        <Fab
          size="small"
          variant="extended"
          onClick={handleClick}
          color="default"
          sx={{
            position: "fixed",
            bottom: 64,
            right: 16,
            // zIndex: 1000,
            boxShadow: 10,
            opacity: 0.9,
          }}
        >
          <FormatListBulletedIcon sx={{ mr: 1 }} />
          Table of Contents
        </Fab>
      </Fade>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        {listItems}
      </Menu>
    </Fragment>
  );
}

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

  const techStackUnion = useMemo(() => {
    // Flatten the array of tech_stack strings, splitting each by ", "
    const allTechStacks = filteredProjects.flatMap((project) => {
      // Split the tech_stack string into an array of individual techs
      const techs = project.tech_stack.split(", ");
      return techs;
    });
    // Create a Set from the flattened array to remove duplicates, then convert it back to an array
    const uniqueTechStacks = [...new Set(allTechStacks)];
    return uniqueTechStacks;
  }, [filteredProjects]); // Depend on filteredProjects so this recalculates only when filteredProjects changes

  const projectCards = useMemo(() => {
    return filteredProjects.map((project, index) => (
      <Box id={`project-${index}`} key={project.title}>
        <ProjectCard project={project} />
      </Box>
    ));
  }, [filteredProjects]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [tab]);

  return (
    <Grid container width="100%" direction="column">
      <Fade in timeout={500}>
        <Grid item mt={10}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold" align="center">
              {`${tab === 0 ? "All" : categories[tab - 1]} Projects`}
            </Typography>

            {tab === 0 && (
              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
                mt={1}
                mx={2}
              >
                I'm constantly updating and adding to my selected projects page,
                so stay tuned for more!
              </Typography>
            )}
          </Box>
        </Grid>
      </Fade>

      <Fade in timeout={500}>
        <Grid item my={3}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Accordion
              defaultExpanded
              sx={{
                width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "50vw" },
                boxShadow: 10,
                backgroundColor: "#222222",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ fontWeight: "bold" }}
              >
                Technologies / Skills
              </AccordionSummary>

              <Divider sx={{ mx: 1 }} />

              <AccordionDetails sx={{ mx: 1 }}>
                <Typography variant="caption" fontWeight="bold">
                  {techStackUnion.join(", ")}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid item mb={4}>
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

      <Fade in timeout={500}>
        <Grid item>
          <Box
            width="100%"
            bgcolor="#242424"
            position="fixed"
            right={0}
            bottom={0}
            zIndex={1000}
            sx={{ opacity: 0.9 }}
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

      <TableOfContents projects={filteredProjects} />
    </Grid>
  );
}
export default Projects;
