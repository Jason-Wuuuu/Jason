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
  const [hovered, setHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const expandTimeoutRef = useRef(null);

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
    setIsHovered(true);
    changeGreeting();
  }, [changeGreeting]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const [isGameOpen, setIsGameOpen] = useState(false);
  const memojiRef = useRef(null);

  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.only("xs"));

  const handleImageClick = (event) => {
    // Only open the game if clicking on the memoji image
    if (!isXsScreen && event.target.tagName === "IMG") {
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
    { label: "JS/TS", color: "#F7DF1E", rating: 2.8 },
    { label: "Python", color: "#4B8BBE", rating: 2.8 },
    { label: "Java", color: "#f89820", rating: 2.5 },
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

  const handleChipHover = useCallback((index, isHovered) => {
    if (!skillChips[index].isHighScore) {
      setHovered(isHovered);

      if (isHovered) {
        setIsExpanded(true);
        if (expandTimeoutRef.current) {
          clearTimeout(expandTimeoutRef.current);
        }
      } else {
        expandTimeoutRef.current = setTimeout(() => {
          setIsExpanded(false);
        }, 1500);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, []);

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
            cursor: "default",
            position: "relative",
            zIndex: (theme) =>
              isGameOpen ? theme.zIndex.modal + 2 : theme.zIndex.speedDial - 1,
          }}
          onMouseEnter={
            !isXsScreen && !isGameOpen ? handleMouseEnter : undefined
          }
          onMouseLeave={
            !isXsScreen && !isGameOpen ? handleMouseLeave : undefined
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
                cursor: isXsScreen ? "default" : "pointer",
              }}
              alt="memoji"
              src="./images/Memoji_1.png"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </Tooltip>
          {!isXsScreen &&
            allChips.map((chip, index) => {
              let angle,
                radius = isGameOpen ? 200 : 150;

              if (chip.isHighScore) {
                angle = -Math.PI / 6;
              } else {
                const startAngle = (Math.PI * 4.5) / 6;
                const endAngle = (Math.PI * 7.5) / 6;
                const chipCount = skillChips.length;
                angle =
                  startAngle +
                  (endAngle - startAngle) * (index / (chipCount - 1));
              }

              const x = 150 + radius * Math.cos(angle);
              const y = 150 + radius * Math.sin(angle);

              const offset = isGameOpen ? (chip.isHighScore ? 20 : 60) : -25;

              const chipElement = (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    left: x - offset,
                    top: y,
                    transform: "translate(-100%, -50%)",
                    transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    pointerEvents: "auto",
                    cursor: chip.isHighScore ? "default" : "pointer",
                  }}
                  onMouseEnter={() => handleChipHover(index, true)}
                  onMouseLeave={() => handleChipHover(index, false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Chip
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          width: "100%",
                          gap: 1,
                          transition: "all 0.3s ease 0.1s",
                        }}
                      >
                        {!chip.isHighScore &&
                          !isGameOpen &&
                          (isExpanded || hovered) && (
                            <Grow in={isExpanded || hovered} timeout={300}>
                              <Rating
                                name={`rating-${chip.label}`}
                                value={chip.rating}
                                precision={0.1}
                                readOnly
                                size="small"
                                max={3}
                                sx={{
                                  "& .MuiRating-icon": {
                                    color:
                                      chip.label === "JS/TS" ||
                                      chip.label === "Web Dev"
                                        ? "black"
                                        : "white",
                                  },
                                }}
                              />
                            </Grow>
                          )}
                        <span>
                          {isGameOpen && !chip.isHighScore
                            ? gameOpenLabels[index]
                            : chip.label}
                        </span>
                      </Box>
                    }
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 14,
                      backgroundColor: chip.color,
                      color:
                        chip.isHighScore ||
                        chip.label === "JS/TS" ||
                        chip.label === "Web Dev"
                          ? "black"
                          : "white",
                      boxShadow: 10,
                      transition: "all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                      "&:hover": {
                        transform: isExpanded ? "scale(1.1)" : "none",
                        transition: "transform 0.3s ease-in-out",
                      },
                      "& .MuiChip-label": {
                        padding: "0 8px",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                      },
                      ...(chip.isHighScore &&
                        !isGameOpen && {
                          animation: `shakeAndFloat 2s ease-in-out infinite`,
                          "@keyframes shakeAndFloat": {
                            "0%, 100%": {
                              transform: "rotate(0deg) translateY(0)",
                            },
                            "25%": {
                              transform: "rotate(-5deg) translateY(-5px)",
                            },
                            "50%": {
                              transform: "rotate(0deg) translateY(-10px)",
                            },
                            "75%": {
                              transform: "rotate(5deg) translateY(-5px)",
                            },
                          },
                        }),
                      ...(isGameOpen && {
                        animation: `float 3s ease-in-out infinite`,
                        "@keyframes float": {
                          "0%, 100%": { transform: "translateY(0)" },
                          "50%": { transform: "translateY(-10px)" },
                        },
                      }),
                    }}
                  />
                </Box>
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
