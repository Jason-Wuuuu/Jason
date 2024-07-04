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
import ListItemIcon from "@mui/material/ListItemIcon";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Tripper",
    year: "2024",
    course: "Side",
    category: "Full Stack",
    description:
      "A dynamic, user-friendly web app designed to transform the way travelers plan and experience trips.",
    tech_stack:
      "Java, Spring Boot, Maven, Next.js, TypeScript, Tailwind CSS, daisyUI, MongoDB",
    githubUrl: "https://github.com/Jason-Wuuuu/Tripper",
    demoUrl: "",
    screenshots: ["tripper/trips.png", "tripper/trips_2.png"],
  },
  {
    title: "Bank Ledger System",
    year: "2024",
    course: "Interview 2nd Round",
    category: "Backend",
    description:
      "Developed a bank ledger system implementing the Event Sourcing pattern to maintain an immutable transaction history, ensuring auditability and reconstruction of account balances.",
    tech_stack: "Java, Spring Boot, Guava, JUnit",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Seq2Seq Translation Model",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "A seq2seq model to translate French text into English using the iwslt2017 dataset, processing over 50,000 sentence pairs.",
    tech_stack: "Python, TensorFlow, Seq2Seq, GRU, Tokenizer",
    githubUrl: "",
    demoUrl: "",
    screenshots: [
      "seq2seq/model.png",
      "seq2seq/translation_1.png",
      "seq2seq/translation_2.png",
    ],
  },
  {
    title: "Stock Price Forecast",
    year: "2024",
    course: "Side",
    category: "ML/DL",
    description:
      "A LSTM model designed to forecast stock prices based on historical data, trained using a variety of features and technical indicators. It achieves an average R^2 score of 0.96 and an average Mean Absolute Percentage Error of 0.1%.",
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
    title: "Visual Board",
    year: "2024",
    course: "Side",
    category: "Full Stack",
    description:
      "An interactive stock dashboard featuring historical data charts, market recommendations, and stock analysis.",
    tech_stack: "React, MUI, Python, FastAPI, yfinance, Redis",
    githubUrl: "https://github.com/Jason-Wuuuu/VisualBoard",
    demoUrl: "https://youtu.be/hOSht_Mvv34",
    screenshots: ["visual_board/stock1.png", "visual_board/stock2.png"],
  },
  {
    title: "IMDB Movie Review Analysis (Word2Vec)",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "A Word2Vec Skip-Gram model developed with TensorFlow to analyze and generate word embeddings from the IMDB movie review dataset, enhancing understanding of semantic word relationships.",
    tech_stack:
      "Python, NLTK, TensorFlow, NumPy, scikit-learn, Matplotlib, Word2Vec",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["word2vec/word_vec.png"],
  },
  {
    title: "Author Classification (MLP)",
    year: "2024",
    course: "NLP Course",
    category: "ML/DL",
    description:
      "A Multi-Layer Perceptron (MLP) model, fully coded from scratch in Python, to classify sentences by their corresponding authors. It employs tokenization and TF-IDF vectorization with optimization, regularization, and cross-validation.",
    tech_stack: "Python, NLTK, TensorFlow, NumPy, scikit-learn, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["mlp/score.png"],
  },
  {
    title: "Stevens Marketplace",
    year: "2023",
    course: "Web Programming Course Group",
    category: "Full Stack",
    description:
      "A community-centric platform that facilitates the discovery and management of pre-owned items, featuring seamless and secure real-time messaging.",
    tech_stack:
      "React, MUI, GraphQL, MongoDB, Firebase, Redux, Redis, socket.io, S3, Docker, Git",
    githubUrl: "https://github.com/Jason-Wuuuu/CS554-GroupVVIV",
    demoUrl: "",
    screenshots: [
      "stevens_marketplace/demo.gif",
      "stevens_marketplace/chat.gif",
    ],
  },
  {
    title: "Event Master",
    year: "2023",
    course: "Agile Methods for Software Dev Course Group",
    category: "Full Stack",
    description:
      "A full-stack web app that utilizes Eventbrite & Ticketmaster APIs for seamless event discovery, interactive voting, and personalized schedule planning. It implements web scraping to compensate for missing functionality in Eventbrite's API.",
    tech_stack:
      "React, Node.js, Express.js, Python, Web Scraping, MongoDB, Docker, Git, Jira, Mocha, Cypress",
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
    category: "Frontend",
    description:
      "A full-stack web application that integrates the Marvel API for comic discovery and collection.",
    tech_stack: "React, MUI, Node.js, Apollo, GraphQL, Redis, Redux",
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
    title: "Support Vector Machine",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "Coursework that involves deriving the hyperplane equation from given data points and Lagrange multipliers, calculating distances to the hyperplane, and classifying new points.",
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
      "Coursework that includes implementing logistic regression from scratch for breast cancer diagnosis, with a focus on Stochastic and Mini-Batch Gradient Descent optimizations, and model performance evaluation through precision, recall, and accuracy metrics.",
    tech_stack: "Python, NumPy, Pandas, Matplotlib",
    githubUrl: "",
    demoUrl: "",
    screenshots: [],
  },
  {
    title: "Diabetes Detection (PCA)",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "Coursework that involves dimensionality reduction on a diabetes dataset using Principal Component Analysis (PCA), implemented with Python's sklearn library. PCA was applied to reduce the feature space from eight dimensions to two.",
    tech_stack: "Python, NumPy, Pandas, Matplotlib, scikit-learn, PCA",
    githubUrl: "",
    demoUrl: "",
    screenshots: ["pca/principal_components.png"],
  },
  {
    title: "Image Compression (SVD)",
    year: "2022",
    course: "ML Course",
    category: "ML/DL",
    description:
      "Coursework that involves the practical application of Singular Value Decomposition (SVD) to compress images. SVD was used to decompose and reconstruct images at varying levels of compression.",
    tech_stack: "Python, NumPy, Matplotlib, SVD",
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
      "An iOS app for suggesting compositions in mobile photography and for virtual postcard sharing. It achieved 2nd place in the competition for the International ICT Innovative Services Awards.",
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
      const yOffset = -100;
      const elementTop =
        element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: elementTop,
        behavior: "smooth",
      });
    }
  };

  const listItems = useMemo(
    () =>
      projects.map((project, index) => (
        <MenuItem
          dense
          key={index}
          onClick={() => {
            handleClose();
            handleJump(`project-${index}`);
          }}
          sx={{ m: 1 }}
        >
          <ListItemIcon>
            <ChevronRightIcon fontSize="small" />
          </ListItemIcon>

          <Typography variant="body1" sx={{ fontWeight: "bold" }} noWrap>
            {project.title}
          </Typography>
        </MenuItem>
      )),
    [projects]
  );

  return (
    <Fragment>
      <Fade in timeout={1000}>
        <Box
          display="flex"
          role="presentation"
          sx={{
            position: "fixed",
            bottom: 64,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab
            size="small"
            variant="extended"
            onClick={handleClick}
            color="default"
            sx={{
              boxShadow: 10,
              opacity: 0.9,
            }}
          >
            <FormatListBulletedIcon sx={{ mr: 1 }} />
            Contents
          </Fab>
        </Box>
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
        sx={{
          "& .MuiPaper-root": {
            // Targeting the Paper component inside the Menu
            backgroundColor: "#202020",
            boxShadow: 10,
          },
          backdropFilter: "blur(1px)",
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
      <Fade in timeout={{ appear: 500, enter: 1000 }}>
        <Grid item pt={12}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold" align="center">
              {`${tab === 0 ? "All" : categories[tab - 1]} Projects`}
            </Typography>
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
              // defaultExpanded
              sx={{
                width: { xs: "90vw", sm: "80vw", md: "70vw", lg: "50vw" },
                boxShadow: 10,
                backgroundColor: "#202020",
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
                <Typography variant="body2" fontWeight="bold" lineHeight={2}>
                  {techStackUnion.join(", ")}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>
      </Fade>

      <Fade in timeout={{ appear: 500, enter: 1500 }}>
        <Grid item>
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
        <Grid item mt={2} mb={10} mx={2}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="caption" align="center" color="text.secondary">
              I'm constantly updating and adding to my selected projects page,
              so stay tuned for more!
            </Typography>
          </Box>
        </Grid>
      </Fade>

      <Fade in timeout={500}>
        <Grid item>
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            bgcolor="#242424"
            position="fixed"
            right={0}
            bottom={0}
            zIndex={1000}
            sx={{
              // opacity: 0.9,
              boxShadow:
                "0px -8px 10px -5px rgba(0,0,0,0.3), 0px -3px 14px 2px rgba(0,0,0,0.2), 0px -5px 5px -3px rgba(0,0,0,0.12)",
            }}
          >
            <Tabs
              textColor="inherit"
              value={tab}
              onChange={handleTab}
              // centered
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
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
