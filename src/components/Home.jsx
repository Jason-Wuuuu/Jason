import React, { lazy, Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Grow,
  Typography,
  Button,
  Divider,
  Fade,
  CircularProgress,
} from "@mui/material";

import NearMeIcon from "@mui/icons-material/NearMe";

const MainPage = lazy(() => import("./MainPage"));
const ProfessionalHighlights = lazy(() => import("./ProfessionalHighlights"));
const AboutPage = lazy(() => import("./AboutPage"));

const SectionTitle = React.memo(({ children }) => (
  <Typography
    variant="h4"
    align="center"
    fontWeight="bold"
    mb={5}
    sx={{ display: { xs: "none", sm: "block" } }}
  >
    {children}
  </Typography>
));

const ProjectButton = React.memo(({ navigate, visible }) => (
  <Grow in={visible} timeout={250}>
    <Box
      display="flex"
      justifyContent="center"
      alignContent="center"
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 32 },
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      <Button
        size="large"
        color="inherit"
        variant="contained"
        startIcon={<NearMeIcon />}
        sx={{
          borderRadius: 100,
          boxShadow: 10,
          fontSize: 12,
          backgroundColor: "#fffafa",
          color: "#242424",
          ":hover": {
            color: "#fffafa",
          },
        }}
        onClick={() => navigate("/projects")}
      >
        Check Out My Projects!
      </Button>
    </Box>
  </Grow>
));

const Section = React.memo(
  ({ children, minHeight = "75vh", centerContent = false }) => (
    <Box
      minHeight={minHeight}
      sx={{
        width: { xs: "95%", sm: "80%" },
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        ...(centerContent && {
          justifyContent: "center",
          alignItems: "center",
        }),
      }}
    >
      {children}
    </Box>
  )
);

function Home() {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsButtonVisible(false);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      const timeout = setTimeout(() => {
        setIsButtonVisible(true);
      }, 250); // Show button after 1 second of inactivity

      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <Fade in timeout={{ appear: 500, enter: 1000 }}>
      <Box py={{ xs: 12, sm: 10 }} sx={{ width: "85%", margin: "auto" }}>
        <Section minHeight="85vh" centerContent>
          <SectionTitle>Jason's Portfolio</SectionTitle>
          <Suspense fallback={<CircularProgress color="inherit" />}>
            <MainPage />
          </Suspense>
        </Section>

        <ProjectButton navigate={navigate} visible={isButtonVisible} />

        <Divider sx={{ my: 5 }} />

        <Section centerContent>
          <SectionTitle>Professional Highlights</SectionTitle>
          <Suspense fallback={<CircularProgress color="inherit" />}>
            <ProfessionalHighlights />
          </Suspense>
        </Section>

        <Divider sx={{ my: 5 }} />

        <Section centerContent>
          <SectionTitle>More About Me</SectionTitle>
          <Suspense fallback={<CircularProgress color="inherit" />}>
            <AboutPage />
          </Suspense>
        </Section>
      </Box>
    </Fade>
  );
}

export default React.memo(Home);
