import React, { memo, useState, createContext, useContext } from "react";

import {
  Grid,
  Box,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import SpeedIcon from "@mui/icons-material/Speed";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Added this import for the ranking icon

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

const shakeAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-10deg) scale(1.2); }
  50% { transform: rotate(10deg) scale(1.2); }
  75% { transform: rotate(-10deg) scale(1.2); }
  100% { transform: rotate(0deg) scale(1); }
`;

const ShakingIcon = styled("div")(({ theme, isShaking }) => ({
  display: "inline-block",
  animation: isShaking ? `${shakeAnimation} 0.5s ease-in-out` : "none",
  transformOrigin: "center",
}));

const floatAnimation = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
   100% { transform: translate(10px, -30px) scale(1.5); opacity: 0; }
`;

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.03)",
  },
}));

const FloatingEmoji = styled("span")(({ theme, index }) => ({
  position: "absolute",
  top: "10px",
  right: `${10 + index * 30}px`,
  animation: `${floatAnimation} 1s ease-out forwards`,
  animationDelay: `${index * 0.15}s`,
  pointerEvents: "none",
  fontSize: "28px",
  color: "#FF69B4",
}));

const emojis = ["💗", "👍", "👏", "🔥", "⭐", "🚀", "💯"];

// Create a context to share the first click state
const FirstClickContext = createContext();

const AnimatedListItemButton = memo(({ children, onClick, ...props }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const { hasClickedAny, setHasClickedAny } = useContext(FirstClickContext);

  const handleClick = (event) => {
    const newEmojis = Array(3)
      .fill()
      .map(() => emojis[Math.floor(Math.random() * emojis.length)]);
    setSelectedEmojis(newEmojis);
    setShowEmojis(true);
    setHasClickedAny(true);
    setTimeout(() => setShowEmojis(false), 1000);
    if (onClick) onClick(event);
  };

  const button = (
    <StyledListItemButton {...props} onClick={handleClick}>
      {children}
      {showEmojis &&
        selectedEmojis.map((emoji, index) => (
          <FloatingEmoji key={index} index={index}>
            {emoji}
          </FloatingEmoji>
        ))}
    </StyledListItemButton>
  );

  return hasClickedAny ? (
    button
  ) : (
    <Tooltip title="Click to give reactions! 🎉" placement="bottom-end">
      {button}
    </Tooltip>
  );
});

const ExperienceItem = memo(
  ({ title, date, company, location, responsibilities }) => {
    const [shakingIcons, setShakingIcons] = useState({});

    const handleIconShake = (index) => {
      setShakingIcons((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setShakingIcons((prev) => ({ ...prev, [index]: false }));
      }, 500);
    };

    return (
      <Grid
        container
        py={3}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            p={{ sm: 3 }}
            borderRight={{ sm: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {title}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.secondary"
                my={{ xs: 1, sm: 2 }}
              >
                {date}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} pt={{ xs: 3 }}>
          <Box pl={{ sm: 5 }} mb={1}>
            <Box
              display="flex"
              justifyContent={{ xs: "block", sm: "space-between" }}
              alignItems="baseline"
            >
              <Typography variant="h5" fontWeight="bold">
                {company}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="bold"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                📍 {location}
              </Typography>
            </Box>

            <List sx={{ mt: 1 }}>
              {responsibilities.map((resp, index) => (
                <AnimatedListItemButton
                  key={index}
                  onClick={() => handleIconShake(index)}
                >
                  <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                    <ShakingIcon isShaking={shakingIcons[index]}>
                      <LaptopMacIcon />
                    </ShakingIcon>
                  </ListItemIcon>

                  <ListItemText
                    primary={resp.title}
                    primaryTypographyProps={{
                      fontSize: { xs: 16, sm: 18 },
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                    secondary={resp.description}
                    secondaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
                </AnimatedListItemButton>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    );
  }
);

const CompetitionItem = memo(
  ({ title, date, projectName, description, awards, imageSrc }) => {
    const [shakingIcons, setShakingIcons] = useState({});

    const handleIconShake = (index) => {
      setShakingIcons((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setShakingIcons((prev) => ({ ...prev, [index]: false }));
      }, 500);
    };

    return (
      <Grid
        container
        py={3}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="space-between"
            p={{ sm: 3 }}
            borderRight={{ sm: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {title}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.secondary"
                my={{ xs: 1, sm: 2 }}
              >
                {date}
              </Typography>
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              <img
                src={imageSrc}
                alt="Award Image"
                loading="lazy"
                width="100%"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} pt={{ xs: 3 }}>
          <Box pl={{ sm: 5 }} mb={1}>
            <Typography variant="h5" fontWeight="bold">
              {projectName}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ py: { xs: 1 } }}
            >
              {description}
            </Typography>
            <List>
              {awards.map((award, index) => (
                <AnimatedListItemButton
                  key={index}
                  onClick={() => handleIconShake(index)}
                >
                  <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                    <ShakingIcon isShaking={shakingIcons[index]}>
                      <EmojiEventsOutlinedIcon />
                    </ShakingIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={award.title}
                    primaryTypographyProps={{
                      fontSize: { xs: 16, sm: 18 },
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                    secondary={award.description}
                    secondaryTypographyProps={{
                      fontSize: 14,
                    }}
                  />
                </AnimatedListItemButton>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    );
  }
);

function ProfessionalHighlights() {
  const [hasClickedAny, setHasClickedAny] = useState(false);

  const experienceData = {
    title: "Web3 Software Engineer Intern (Frontend)",
    date: "May 2024 − Present",
    company: "🧑‍💻 Crypto-Arsena",
    location: "Taipei, Taiwan (Remote)",
    responsibilities: [
      {
        title: "Responsive UI Development",
        description:
          "Leveraged Next.js, TypeScript, and GraphQL to create dynamic and responsive UI components for the company website, ensuring a seamless user experience across devices.",
      },
      {
        title: "Storybook Implementation",
        description:
          "Integrated Storybook into the development workflow, facilitating isolated component development and testing. This enhancement significantly improved development efficiency and overall code quality.",
      },
      {
        title: "Legacy Code Modernization",
        description:
          "Spearheaded the transition from legacy v1 codebase to v2, aligning with the latest Next.js best practices. Utilized React hooks to optimize performance and improve code maintainability.",
      },
      {
        title: "Knowledge Sharing and Agile Practices",
        description:
          "Actively contributed to the team's growth by presenting Git techniques and participating in Scrum meetings, fostering a collaborative and efficient development environment.",
      },
    ],
  };

  const competitionData = {
    title: "Memory Maker",
    date: "Mar 2019 − Aug 2019",
    projectName: "🤖 Senior Project",
    description:
      'Pitched and led the backend development of "Memory Maker", an iOS app created with 5 teammates, featuring machine learning for photography guidance and virtual postcard creation, earning multiple awards.',
    awards: [
      {
        title: "🥈 2nd Place",
        description: "International ICT Innovative Services Competition",
      },
      {
        title: "🥈 2nd Place",
        description: "TKU iOS APP Competition",
      },
      {
        title: "🏅 Excellence Award",
        description:
          "TKU Department of Information Management Project Competition",
      },
    ],
    imageSrc: "./images/Award.png",
  };

  const typingSpeedData = {
    title: "Fast Typer",
    date: "Oct 2022",
    subtitle: "🤘 I can type fast!",
    description:
      "This has nothing to do with the rest of my portfolio, but it's a fun skill I'm proud of!",
    icon: <SpeedIcon />,
    imageSrc: "./images/TypingSpeed.png",
    achievements: [
      {
        title: "118 WPM with 100% Accuracy",
        description: "Achieved in a 15-second typing test",
        icon: <SpeedIcon />,
      },
      {
        title: "Top 26.24% on MonkeyType",
        description: "Ranked among the fastest typists globally",
        icon: <EmojiEventsIcon />,
      },
    ],
  };

  return (
    <FirstClickContext.Provider value={{ hasClickedAny, setHasClickedAny }}>
      <Box display="flex" flexDirection="column">
        <Typography variant="h4" fontWeight="bold">
          💼 Experience
        </Typography>
        <ExperienceItem {...experienceData} />
        <Divider sx={{ my: 5 }} flexItem />
        <Typography variant="h4" fontWeight="bold">
          🏆 Competitions
        </Typography>
        <CompetitionItem {...competitionData} />
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Divider sx={{ my: 5 }} flexItem />
          <Typography variant="h4" fontWeight="bold">
            🎨 Random Fun Fact
          </Typography>
          <Grid
            container
            py={3}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                height="100%"
                flexDirection="column"
                justifyContent="space-between"
                p={{ sm: 3 }}
                borderRight={{ sm: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {typingSpeedData.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.secondary"
                    my={{ xs: 1, sm: 2 }}
                  >
                    {typingSpeedData.date} (118 WPM Record)
                  </Typography>
                </Box>
                <Box width="100%" display="flex" justifyContent="center">
                  <img
                    src={typingSpeedData.imageSrc}
                    alt="Typing Speed Test Results"
                    loading="lazy"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8} pt={{ xs: 3 }}>
              <Box pl={{ sm: 5 }} mb={1}>
                <Typography variant="h5" fontWeight="bold">
                  {typingSpeedData.subtitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: { xs: 1 } }}
                >
                  {typingSpeedData.description}
                </Typography>
                <List>
                  {typingSpeedData.achievements.map((achievement, index) => (
                    <AnimatedListItemButton key={index}>
                      <ListItemIcon
                        sx={{ display: { xs: "none", sm: "block" } }}
                      >
                        {achievement.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.title}
                        secondary={achievement.description}
                        primaryTypographyProps={{
                          fontSize: 18,
                          fontWeight: "bold",
                          mb: 0.5,
                        }}
                        secondaryTypographyProps={{
                          fontSize: 14,
                        }}
                      />
                    </AnimatedListItemButton>
                  ))}
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </FirstClickContext.Provider>
  );
}

export default memo(ProfessionalHighlights);
