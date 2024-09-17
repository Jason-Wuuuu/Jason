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
              variant="body2"
              color="text.secondary"
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
                      fontSize: { xs: 16, sm: 18 },
                      fontWeight: "bold",
                      mb: 0.5,
                    }}
                    secondary={item.description}
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

  const experienceData = [
    {
      title: "Full Stack Engineer\n(Part-time)",
      date: "Aug 2023 − Present",
      company: "🧑‍💻 Blockhouse",
      location: "New York City (Remote)",
      responsibilities: [
        {
          title: "Full Stack Development",
          description: (
            <>
              Develop pixel-perfect web applications using{" "}
              <EmphasizedWord>Next.js</EmphasizedWord>,{" "}
              <EmphasizedWord>TypeScript</EmphasizedWord>, and{" "}
              <EmphasizedWord>Python</EmphasizedWord>, meticulously translating{" "}
              <EmphasizedWord>Figma</EmphasizedWord> designs into precise,
              functional interfaces.
            </>
          ),
        },
        {
          title: "Performance Optimization",
          description: (
            <>
              Enhance application speed and visual fidelity by refining{" "}
              <EmphasizedWord>API calls</EmphasizedWord>, implementing{" "}
              <EmphasizedWord>caching strategies</EmphasizedWord>, and
              optimizing <EmphasizedWord>PostgreSQL</EmphasizedWord> queries for
              efficient data retrieval.
            </>
          ),
        },
        {
          title: "Feature Implementation",
          description: (
            <>
              Collaborate with team members to develop and integrate new
              features across the full stack, ensuring pixel-perfect alignment
              with project requirements and design specifications.
            </>
          ),
        },
        {
          title: "Agile Practices",
          description: (
            <>
              Participate in <EmphasizedWord>Agile workflows</EmphasizedWord>{" "}
              and utilize <EmphasizedWord>Posthog</EmphasizedWord> for
              continuous monitoring and improvement of application performance
              and visual consistency.
            </>
          ),
        },
      ],
    },
    {
      title: "Web3 Frontend Engineer\n(Intern)",
      date: "May 2024 − Present",
      company: "🧑‍💻 Crypto-Arsena",
      location: "Taipei, Taiwan (Remote)",
      responsibilities: [
        {
          title: "UI Development",
          description: (
            <>
              Create responsive UI components using{" "}
              <EmphasizedWord>Next.js</EmphasizedWord>,{" "}
              <EmphasizedWord>TypeScript</EmphasizedWord>, and{" "}
              <EmphasizedWord>GraphQL</EmphasizedWord> to enhance the company
              website.
            </>
          ),
        },
        {
          title: "Component Documentation",
          description: (
            <>
              Implement <EmphasizedWord>Storybook</EmphasizedWord> for improved
              component documentation and development efficiency.
            </>
          ),
        },
        {
          title: "Codebase Modernization",
          description: (
            <>
              Assist in transitioning from v1 to v2 codebase, incorporating{" "}
              <EmphasizedWord>Next.js best practices</EmphasizedWord> and{" "}
              <EmphasizedWord>React hooks</EmphasizedWord> for enhanced
              functionality.
            </>
          ),
        },
        {
          title: "Team Collaboration",
          description: (
            <>
              Share <EmphasizedWord>Git</EmphasizedWord> expertise and actively
              participate in <EmphasizedWord>Scrum</EmphasizedWord> meetings to
              foster a collaborative development environment.
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
