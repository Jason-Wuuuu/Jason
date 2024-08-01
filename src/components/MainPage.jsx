import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

import {
  Grid,
  Typography,
  Box,
  Tooltip,
  Divider,
  Modal,
  Backdrop,
  Chip,
} from "@mui/material";

import {
  School as SchoolIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarMonthIcon,
  Grade as GradeIcon,
  Place as PlaceIcon,
} from "@mui/icons-material";

import SocialLinks from "./SocialLinks";
import InfoSection from "./InfoSection";
import MiniGame from "./MiniGame";

const ProfileSection = memo(() => {
  const baseGreetings = [
    "Click me for some easter eggs! 🥚✨",
    "Hover again for more messages! 😉",
    "Behold, the digital me! 🧙‍♂️",
    "Code wizard at your service! 🧙‍♂️",
    "Warning: Awesome developer detected! 🚀",
    "Hello, world! Always wanted to say that 😄",
    "Powered by coffee and curiosity 💡",
    "Turning caffeine into code since 2018 ⚡️",
    "That's me! Nice to meet you! 😊",
  ];

  const [greetings, setGreetings] = useState(baseGreetings);
  const [currentGreeting, setCurrentGreeting] = useState("");
  const [hoverCount, setHoverCount] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (highScore > 0) {
      setGreetings((prevGreetings) => [
        `High score: ${highScore}! Can you beat it? 🏆`,
        ...prevGreetings.slice(1),
      ]);
      setHoverCount(0);
    }
  }, [highScore]);

  const changeGreeting = useCallback(() => {
    setHoverCount((prevCount) => prevCount + 1);
    setCurrentGreeting((prevGreeting) => {
      if (hoverCount === 0) return greetings[0];
      if (hoverCount === 1) return greetings[1];
      return greetings[Math.floor(Math.random() * (greetings.length - 2)) + 2];
    });
  }, [hoverCount, greetings]);

  const handleMouseEnter = useCallback(() => {
    changeGreeting();
  }, [changeGreeting]);

  const [isGameOpen, setIsGameOpen] = useState(false);
  const memojiRef = useRef(null);

  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.only("xs"));

  const handleImageClick = () => {
    if (!isXsScreen) {
      setIsGameOpen(true);
    }
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
  };

  const handleHighScoreUpdate = (newHighScore) => {
    setHighScore(newHighScore);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
      <Grid item>
        <Tooltip title={!isGameOpen && currentGreeting} placement="top">
          <Box
            sx={{
              width: 300,
              height: 300,
              cursor: isXsScreen ? "default" : "pointer",
              position: "relative",
              zIndex: (theme) => theme.zIndex.modal + 2,
            }}
            onMouseEnter={!isXsScreen ? handleMouseEnter : undefined}
            onClick={handleImageClick}
          >
            <Box
              component="img"
              ref={memojiRef}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "50%",
                boxShadow: 10,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: isGameOpen ? "scale(1.03)" : "none",
                  transition: "transform 0.3s ease-in-out",
                },
              }}
              alt="memoji"
              src="./images/Memoji_1.png"
            />
            {highScore > 0 && (
              <Chip
                label={`🏆 ${highScore}`}
                size="small"
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  fontWeight: "bold",
                  fontSize: 14,
                  padding: "0 4px",
                  backgroundColor: "gold",
                  color: "black",
                  boxShadow: 10,
                }}
              />
            )}
          </Box>
        </Tooltip>
      </Grid>

      <Grid item>
        <Typography variant="h5" fontWeight="bold" align="center" mt={2}>
          Chia-Hsiang(Jason) Wu
        </Typography>
        <Typography variant="body1" align="center" mt={2}>
          Software Engineer / Web Developer
        </Typography>
      </Grid>

      <Grid item>
        <SocialLinks />
      </Grid>
      {!isXsScreen && (
        <Modal
          open={isGameOpen}
          onClose={handleCloseGame}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              sx: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(5px)",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              },
              transitionDuration: 300,
            },
          }}
        >
          <Box sx={{ zIndex: (theme) => theme.zIndex.modal + 3 }}>
            <MiniGame
              onClose={handleCloseGame}
              memojiRef={memojiRef}
              onHighScoreUpdate={handleHighScoreUpdate}
            />
          </Box>
        </Modal>
      )}
    </Grid>
  );
});

function MainPage() {
  const educationItems = [
    {
      icon: SchoolIcon,
      primary: "Stevens Institute of Technology",
      secondary: "Computer Science, M.S.",
    },
    { icon: GradeIcon, primary: "GPA", secondary: "3.87 / 4.0" },
    {
      icon: CalendarMonthIcon,
      primary: "Date",
      secondary: "Sep 2022 - May 2024",
    },
  ];

  const experienceItems = [
    {
      icon: BusinessIcon,
      primary: "Crypto-Arsenal",
      secondary: "Web3 SWE Intern (Frontend)",
    },
    { icon: PlaceIcon, primary: "Location", secondary: "Remote" },
    {
      icon: CalendarMonthIcon,
      primary: "Date",
      secondary: "May 2024 - Present",
    },
  ];

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 5, sm: 10 }}
    >
      <Grid item xs={12} sm={6} md={6}>
        <ProfileSection />
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
        <Grid container direction="column" spacing={4}>
          <InfoSection title="Education" items={educationItems} />
          <Grid item>
            <Divider />
          </Grid>
          <InfoSection title="Recent Experience" items={experienceItems} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(MainPage);
