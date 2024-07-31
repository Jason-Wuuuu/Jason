import React, { memo, useState, useCallback, useRef } from "react";

import {
  Grid,
  Typography,
  Box,
  Tooltip,
  Divider,
  Modal,
  Backdrop,
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
  const greetings = [
    "Behold, the digital me! 🧙‍♂️",
    "Code wizard at your service! 🧙‍♂️",
    "Warning: Awesome developer detected! 🚀",
    "Hello, world! ...I always wanted to say that 😄",
    "Powered by coffee and curiosity 💡",
    "Turning caffeine into code since 2018 ⚡️",
    "That's me! Nice to meet you! 😊",
  ];

  const [currentGreeting, setCurrentGreeting] = useState(greetings[0]);

  const changeGreeting = useCallback(() => {
    const newGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setCurrentGreeting(newGreeting);
  }, []);

  const handleMouseEnter = useCallback(() => {
    changeGreeting();
  }, [changeGreeting]);

  const [isGameOpen, setIsGameOpen] = useState(false);
  const memojiRef = useRef(null);

  const handleImageClick = () => {
    setIsGameOpen(true);
  };

  const handleCloseGame = () => {
    setIsGameOpen(false);
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
        <Tooltip title={!isGameOpen ? currentGreeting : ""} placement="top">
          <Box
            component="img"
            ref={memojiRef}
            sx={{
              height: 300,
              width: 300,
              borderRadius: "50%",
              boxShadow: 10,
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: isGameOpen ? "none" : "scale(1.03)",
              },
              position: "relative",
              zIndex: (theme) => theme.zIndex.modal + 1,
            }}
            alt="memoji"
            src="./images/Memoji_1.png"
            onMouseEnter={!isGameOpen ? handleMouseEnter : undefined}
            onClick={handleImageClick}
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <Typography variant="h5" fontWeight="bold" align="center">
          Chia-Hsiang(Jason) Wu
        </Typography>
        <Typography variant="body1" align="center" mt={2}>
          Software Engineer / Web Developer
        </Typography>
      </Grid>
      <Grid item>
        <SocialLinks />
      </Grid>
      <Modal
        open={isGameOpen}
        onClose={handleCloseGame}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            },
          },
        }}
      >
        <Box sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}>
          <MiniGame onClose={handleCloseGame} memojiRef={memojiRef} />
        </Box>
      </Modal>
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
