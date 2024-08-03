import React, {
  memo,
  useState,
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
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
import { keyframes, styled } from "@mui/system";

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

const floatAnimation = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
   100% { transform: translate(10px, -30px) scale(1.5); opacity: 0; }
`;

const FloatingEmoji = styled("span")(({ theme, index }) => ({
  position: "absolute",
  top: -20,
  left: -20,
  animation: `${floatAnimation} 1s ease-out forwards`,
  animationDelay: `${index * 0.15}s`,
  pointerEvents: "none",
  fontSize: "32px",
  zIndex: 1000,
}));

const FirstClickContext = createContext();

const ProfileSection = memo(() => {
  const baseGreetings = [
    "Click me for some easter eggs! 🥚✨",
    "Hover again for more messages! 😉",
    // "Behold, the digital me! 🧙‍♂️",
    // "Code wizard at your service! 🧙‍♂️",
    // "Warning: Awesome developer detected! 🚀",
    "Hello, world! Always wanted to say that 😄",
    "Powered by coffee and curiosity 💡",
    // "Turning caffeine into code since 2018 ⚡️",
    "That's me! Nice to meet you! 😊",
  ];

  const [greetings, setGreetings] = useState(baseGreetings);
  const [currentGreeting, setCurrentGreeting] = useState(baseGreetings[0]);
  const [highScore, setHighScore] = useState(0);

  const [chipHoverStates, setChipHoverStates] = useState({});
  const [chipExpandStates, setChipExpandStates] = useState({});
  const chipTimeouts = useRef({});

  useEffect(() => {
    if (highScore > 0) {
      setGreetings((prevGreetings) => [
        `High score: ${highScore}! Can you beat it? 🏆`,
        ...baseGreetings.slice(1),
      ]);
      setCurrentGreeting(`High score: ${highScore}! Can you beat it? 🏆`);
    } else {
      setGreetings(baseGreetings);
      setCurrentGreeting(baseGreetings[0]);
    }
  }, [highScore]);

  const changeGreeting = useCallback(() => {
    if (highScore === 0) {
      setCurrentGreeting(baseGreetings[0]);
    } else {
      setCurrentGreeting((prevGreeting) => {
        const currentIndex = greetings.indexOf(prevGreeting);
        const nextIndex = (currentIndex + 1) % greetings.length;
        return greetings[nextIndex];
      });
    }
  }, [greetings, highScore]);

  const handleMemojiMouseEnter = useCallback(() => {
    changeGreeting();
  }, [changeGreeting]);

  const handleChipHover = useCallback((index, isHovered) => {
    if (!skillChips[index].isHighScore) {
      setChipHoverStates((prev) => ({ ...prev, [index]: isHovered }));
      if (isHovered) {
        // Clear any existing timeout when hovering
        if (chipTimeouts.current[index]) {
          clearTimeout(chipTimeouts.current[index]);
        }
        setChipExpandStates((prev) => ({ ...prev, [index]: true }));
      } else {
        // Set a timeout to remove the expand state after 2 seconds
        chipTimeouts.current[index] = setTimeout(() => {
          setChipExpandStates((prev) => ({ ...prev, [index]: false }));
        }, 2000);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(chipTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
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

  const [isClosing, setIsClosing] = useState(false);

  const handleCloseGame = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsGameOpen(false);
      setIsClosing(false);
    }, 1000); // Adjust this delay as needed
  }, []);

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

  const [chipEmojis, setChipEmojis] = useState({});
  const { hasClickedAny, setHasClickedAny } = useContext(FirstClickContext);

  const handleChipClick = useCallback(
    (index) => {
      if (!skillChips[index].isHighScore) {
        const newEmoji = (() => {
          switch (skillChips[index].label) {
            case "AI & ML":
              return "🤖";
            case "Web Dev":
              return "🕸️";
            case "JS/TS":
              return "🚀";
            case "Python":
              return "🐍";
            case "Java":
              return "🍵";
            default:
              return "✨";
          }
        })();
        setChipEmojis((prev) => ({ ...prev, [index]: [newEmoji] }));
        setHasClickedAny(true);
        setTimeout(() => {
          setChipEmojis((prev) => ({ ...prev, [index]: [] }));
        }, 1000);
      }
    },
    [skillChips, setHasClickedAny]
  );

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
            !isXsScreen && !isGameOpen ? handleMemojiMouseEnter : undefined
          }
          onClick={handleImageClick}
        >
          <Tooltip title={!isGameOpen && currentGreeting} arrow placement="top">
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
                    cursor:
                      chip.isHighScore || (isGameOpen && !chip.isHighScore)
                        ? "default"
                        : "pointer",
                  }}
                  onMouseEnter={() => handleChipHover(index, true)}
                  onMouseLeave={() => handleChipHover(index, false)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChipClick(index);
                  }}
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
                          transition: "all 0.3s ease",
                        }}
                      >
                        {!chip.isHighScore &&
                          !isGameOpen &&
                          (chipHoverStates[index] ||
                            chipExpandStates[index]) && (
                            <Grow
                              in={
                                chipHoverStates[index] ||
                                chipExpandStates[index]
                              }
                              timeout={{
                                enter: 300,
                                exit: 200,
                              }}
                              style={{ transformOrigin: "center right" }}
                            >
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
                                    transition: "transform 0.3s ease",
                                    transform:
                                      chipHoverStates[index] ||
                                      chipExpandStates[index]
                                        ? "scale(1)"
                                        : "scale(0.8)",
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
                      transition: "all 0.3s ease",
                      transformOrigin: "right center",
                      transform: chipExpandStates[index]
                        ? "scale(1.1)"
                        : "scale(1)",
                      "& .MuiChip-label": {
                        padding: "0 8px",
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        transition: "all 0.3s ease",
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
                  {chipEmojis[index] &&
                    chipEmojis[index].map((emoji, emojiIndex) => (
                      <FloatingEmoji key={emojiIndex} index={emojiIndex}>
                        {emoji}
                      </FloatingEmoji>
                    ))}
                </Box>
              );

              return isGameOpen ? (
                <Grow
                  in={isGameOpen && !isClosing}
                  timeout={{
                    enter: (index + 1) * 500,
                    exit: (allChips.length - index) * 300,
                  }}
                  key={index}
                >
                  {chipElement}
                </Grow>
              ) : (
                <Fade
                  in={!isGameOpen}
                  timeout={{ enter: 500, exit: 300 }}
                  key={index}
                >
                  {chipElement}
                </Fade>
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
              transitionDuration: 1000,
            },
          }}
        >
          <Fade
            in={isGameOpen && !isClosing}
            timeout={{ enter: 2500, exit: 1000 }}
          >
            <Box
              sx={{
                zIndex: (theme) => theme.zIndex.modal + 1,
                position: "relative",
              }}
            >
              <MiniGame
                open={isGameOpen}
                onClose={handleCloseGame}
                memojiRef={memojiRef}
                onHighScoreUpdate={handleHighScoreUpdate}
                isClosing={isClosing}
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

  const [hasClickedAny, setHasClickedAny] = useState(false);

  return (
    <FirstClickContext.Provider value={{ hasClickedAny, setHasClickedAny }}>
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
    </FirstClickContext.Provider>
  );
}

export default memo(MainPage);
