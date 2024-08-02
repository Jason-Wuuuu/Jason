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
  Fade,
  Grow,
  Rating,
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

  const skillChips = [
    { label: "AI & ML", color: "#8E44AD", rating: 2 },
    { label: "Web Dev", color: "#61DAFB", rating: 2.5 },
    { label: "JS/TS", color: "#F7DF1E", rating: 2.5 },
    { label: "Python", color: "#4B8BBE", rating: 2.5 },
    { label: "Java", color: "#f89820", rating: 2.3 },
  ];

  const highScoreChip =
    highScore > 0
      ? { label: `🏆 ${highScore}`, color: "gold", isHighScore: true }
      : { label: "🥚?", color: "#FFD700", isHighScore: true };

  const allChips = isXsScreen ? [] : [...skillChips, highScoreChip];

  const gameOpenLabels = [
    "Let's Go!",
    "🎮 Play",
    "🚀 Boost",
    "💥 Smash",
    "🏆 Win!",
  ];

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
      <Grid item>
        <Box
          sx={{
            width: 300,
            height: 300,
            cursor: isXsScreen ? "default" : "pointer",
            position: "relative",
            zIndex: (theme) =>
              isGameOpen ? theme.zIndex.modal + 2 : theme.zIndex.speedDial - 1,
          }}
          onMouseEnter={
            !isXsScreen && !isGameOpen ? handleMouseEnter : undefined
          }
          onClick={handleImageClick}
        >
          <Tooltip title={!isGameOpen && currentGreeting} placement="top">
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
                userSelect: "none",
              }}
              alt="memoji"
              src="./images/Memoji_1.png"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </Tooltip>
          {!isXsScreen &&
            allChips.map((chip, index) => {
              let angle, radius;
              if (isXsScreen) {
                // Distribute chips evenly around the circle for xs screens
                angle = (2 * Math.PI * index) / allChips.length - Math.PI / 2;
                radius = 155;
              } else {
                // Existing positioning logic for larger screens
                if (chip.isHighScore) {
                  angle = -Math.PI / 4;
                  radius = 155; // Adjust this value to change spacing for the high score chip
                } else {
                  // Adjust the density of the chips by changing the angle calculation
                  angle =
                    Math.PI * 0.8 +
                    Math.PI * 0.4 * (index / (skillChips.length - 1)); // Adjust this multiplier to change density
                  radius = isGameOpen && !chip.isHighScore ? 180 : 165; // Adjust this value to change spacing for other chips
                }
              }
              const x =
                (isGameOpen && !chip.isHighScore ? 130 : 150) +
                radius * Math.cos(angle); // Adjust this value to shift left
              const y =
                (isGameOpen && !chip.isHighScore ? 120 : 150) +
                radius * Math.sin(angle);

              const chipElement = (
                <Tooltip
                  key={index}
                  arrow
                  title={
                    !chip.isHighScore &&
                    !isGameOpen && (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Rating
                          name={`rating-${chip.label}`}
                          value={chip.rating}
                          precision={0.1}
                          readOnly
                          size="small"
                          max={3}
                          sx={{ my: -0.1 }}
                        />
                      </Box>
                    )
                  }
                  placement="left"
                >
                  <Chip
                    label={
                      isGameOpen && !chip.isHighScore
                        ? gameOpenLabels[index]
                        : chip.label
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      left: x,
                      top: y,
                      transform: "translate(-50%, -50%)",
                      fontWeight: "bold",
                      fontSize: 14,
                      padding: "0 4px",
                      backgroundColor: chip.color,
                      color:
                        chip.isHighScore ||
                        chip.label === "JS/TS" ||
                        chip.label === "Web Dev"
                          ? "black"
                          : "white",
                      boxShadow: 10,
                      pointerEvents:
                        isGameOpen || chip.isHighScore ? "none" : "auto",
                      ...(chip.isHighScore && {
                        animation: `float 3s ease-in-out infinite`,
                        "@keyframes float": {
                          "0%, 100%": { transform: "translate(-50%, -50%)" },
                          "50%": {
                            transform: "translate(-50%, calc(-50% - 10px))",
                          },
                        },
                      }),
                      ...(isGameOpen &&
                        !chip.isHighScore && {
                          animation: `floatAround 5s infinite`,
                          "@keyframes floatAround": {
                            "0%": {
                              transform: `translate(${x - 20}px, ${y}px)`,
                            },
                            "25%": {
                              transform: `translate(${x - 30}px, ${y - 10}px)`,
                            },
                            "50%": {
                              transform: `translate(${x - 40}px, ${y + 10}px)`,
                            },
                            "75%": {
                              transform: `translate(${x - 30}px, ${y + 10}px)`,
                            },
                            "100%": {
                              transform: `translate(${x - 20}px, ${y}px)`,
                            },
                          },
                        }),
                    }}
                  />
                </Tooltip>
              );

              return isGameOpen ? (
                <Grow in={isGameOpen} timeout={(index + 1) * 500} key={index}>
                  {chipElement}
                </Grow>
              ) : (
                chipElement
              );
            })}
        </Box>
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
          <Fade in={isGameOpen} timeout={{ enter: 2500, exit: 250 }}>
            <Box
              sx={{
                zIndex: (theme) => theme.zIndex.modal + 1,
                position: "relative",
              }}
            >
              <MiniGame
                onClose={handleCloseGame}
                memojiRef={memojiRef}
                onHighScoreUpdate={handleHighScoreUpdate}
              />
            </Box>
          </Fade>
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
