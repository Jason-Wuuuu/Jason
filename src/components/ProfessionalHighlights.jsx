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
  Link,
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
  borderRadius: "5px", // Add rounded corners
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.03)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
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

const EmphasizedWord = styled("strong")(({ theme }) => ({
  color: "#FFFFFF", // White color
  fontSize: "1.05em",
  display: "inline-block",
  textDecoration: "underline", // Add underline
}));

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
        py={5}
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
                {title.split("\n")[0]}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {title.split("\n")[1]}
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
                      fontSize: 18,
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                    secondary={resp.description}
                    secondaryTypographyProps={{
                      fontSize: 15,
                      textAlign: { xs: "left", sm: "justify" },
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

const HighlightItem = memo(
  ({ title, date, subtitle, description, content, imageSrc }) => {
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
              {subtitle}
            </Typography>
            <Typography
              color="text.secondary"
              fontSize={15}
              sx={{ py: { xs: 1 } }}
            >
              {description}
            </Typography>
            <List>
              {content.map((item, index) => (
                <AnimatedListItemButton
                  key={index}
                  onClick={() => handleIconShake(index)}
                >
                  <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                    <ShakingIcon isShaking={shakingIcons[index]}>
                      {item.icon || <EmojiEventsOutlinedIcon />}
                    </ShakingIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: 18,
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                    secondary={item.description}
                    secondaryTypographyProps={{
                      fontSize: 15,
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

  const experienceData = [
    {
      title: "Full Stack Engineer\n(Intern)",
      date: "Aug 2023 − Present",
      company: "🧑‍💻 Blockhouse",
      location: "New York City, USA",
      responsibilities: [
        {
          title: "Full Stack Web App Development",
          description: (
            <>
              Build awesome apps with <EmphasizedWord>Next.js</EmphasizedWord>,{" "}
              <EmphasizedWord>TypeScript</EmphasizedWord>, and{" "}
              <EmphasizedWord>FastAPI</EmphasizedWord>. Turn{" "}
              <EmphasizedWord>Figma</EmphasizedWord> designs into pixel-perfect
              reality.
            </>
          ),
        },
        {
          title: "Mobile & Extension Development",
          description: (
            <>
              Expanded reach by bringing web magic to iOS, Android, and all
              major browsers with <EmphasizedWord>React Native</EmphasizedWord>{" "}
              and <EmphasizedWord>Plasmo</EmphasizedWord>, making sure
              everything works smoothly everywhere.
            </>
          ),
        },
        {
          title: "Interactive Data Visualization",
          description: (
            <>
              Developed interactive <EmphasizedWord>charts</EmphasizedWord> and{" "}
              <EmphasizedWord>dashboards</EmphasizedWord> for financial data,
              enhancing user insight with complex metrics.
            </>
          ),
        },
        {
          title: "Performance Wizard",
          description: (
            <>
              Supercharged app speed by <EmphasizedWord>38%</EmphasizedWord>{" "}
              using <EmphasizedWord>Server-Side Rendering</EmphasizedWord>,{" "}
              efficient data fetching, and React's{" "}
              <EmphasizedWord>useMemo/useCallback</EmphasizedWord> magic.
            </>
          ),
        },
        {
          title: "Testing & CI/CD",
          description: (
            <>
              Slashed testing time by <EmphasizedWord>61%</EmphasizedWord> with{" "}
              <EmphasizedWord>Cypress</EmphasizedWord> tests and built robust{" "}
              <EmphasizedWord>CI/CD</EmphasizedWord> pipelines using{" "}
              <EmphasizedWord>GitHub Actions</EmphasizedWord>. No more sneaky
              bugs in production!
            </>
          ),
        },
      ],
    },
    {
      title: "Web3 Frontend Engineer\n(Intern)",
      date: "May 2024 − Nov 2024",
      company: "🧑‍💻 Crypto-Arsenal",
      location: "Taipei, Taiwan (Remote)",
      responsibilities: [
        {
          title: "UI Development",
          description: (
            <>
              Built responsive UI components with{" "}
              <EmphasizedWord>Next.js</EmphasizedWord>,{" "}
              <EmphasizedWord>TypeScript</EmphasizedWord>, and{" "}
              <EmphasizedWord>GraphQL</EmphasizedWord>, mastering queries and
              mutations along the way.
            </>
          ),
        },
        {
          title: "Component Documentation",
          description: (
            <>
              Implemented <EmphasizedWord>Storybook</EmphasizedWord> to
              streamline component development and testing, making our codebase
              more maintainable and developer-friendly.
            </>
          ),
        },
        {
          title: "Code Upgrade",
          description: (
            <>
              Modernized legacy v1 codebase to v2 with latest{" "}
              <EmphasizedWord>Next.js</EmphasizedWord> practices. Added{" "}
              <EmphasizedWord>React-Aria</EmphasizedWord> and{" "}
              <EmphasizedWord>React-Resizable</EmphasizedWord> for better UX.
            </>
          ),
        },
        {
          title: "Collaboration",
          description: (
            <>
              Shared valuable <EmphasizedWord>Git</EmphasizedWord> knowledge
              while actively participating in{" "}
              <EmphasizedWord>Scrum</EmphasizedWord> meetings to keep projects
              moving forward.
            </>
          ),
        },
      ],
    },
  ];

  const competitionData = {
    title: "Memory Maker",
    date: "Mar 2019 − Aug 2019",
    subtitle: "🤖 Senior Project",
    description:
      'Pitched and led the backend development of "Memory Maker", an iOS app created with 5 teammates, featuring machine learning for photography guidance and virtual postcard creation, earning multiple awards.',
    imageSrc: "./images/Award.png",
    content: [
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
  };

  const typingSpeedData = {
    title: "Fast Typer",
    date: (
      <>
        Tested on{" "}
        <Link
          href="https://monkeytype.com/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "inherit",
            textDecoration: "underline",
            "&:hover": {
              color: "whitesmoke",
            },
          }}
        >
          MonkeyType
        </Link>
      </>
    ),
    subtitle: "🤘 I can type fast!",
    description:
      "This has nothing to do with the rest of my portfolio, but it's a fun skill I'm proud of!",
    imageSrc: "./images/TypingSpeed.png",
    content: [
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
        {experienceData.map((experience, index) => (
          <ExperienceItem key={index} {...experience} />
        ))}

        <Divider sx={{ my: 5 }} flexItem />

        <Typography variant="h4" fontWeight="bold">
          🏆 Competitions
        </Typography>
        <HighlightItem {...competitionData} />

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Divider sx={{ my: 5 }} flexItem />
          <Typography variant="h4" fontWeight="bold">
            🎨 Random Fun Fact
          </Typography>
          <HighlightItem {...typingSpeedData} />
        </Box>
      </Box>
    </FirstClickContext.Provider>
  );
}

export default memo(ProfessionalHighlights);
