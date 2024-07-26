import React, { memo } from "react";

import {
  Grid,
  Typography,
  Box,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";

import {
  School as SchoolIcon,
  Business as BusinessIcon,
  CalendarMonth as CalendarMonthIcon,
  Grade as GradeIcon,
  Place as PlaceIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";

import Resume from "./Resume";

const InfoListItem = memo(({ icon: Icon, primary, secondary }) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{
        fontSize: 16,
        fontWeight: "bold",
      }}
    />
  </ListItem>
));

const SocialLinks = memo(() => (
  <Box display="flex" alignItems="center" gap={2}>
    <Box>
      <Tooltip title="LinkedIn" placement="bottom">
        <IconButton
          href="http://www.linkedin.com/in/chia-hsiang-jason-wu"
          target="_blank"
          size="large"
        >
          <LinkedInIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="GitHub" placement="bottom">
        <IconButton
          href="https://github.com/Jason-Wuuuu"
          target="_blank"
          size="large"
        >
          <GitHubIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
    <Resume />
  </Box>
));

const ProfileSection = memo(() => (
  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
    gap={3}
  >
    <Grid item>
      <Tooltip title="Hi! 👋" arrow placement="top">
        <Box
          component="img"
          sx={{
            height: 300,
            width: 300,
            borderRadius: "50%",
            boxShadow: 10,
            mb: 2,
          }}
          alt="memoji"
          src="./images/Memoji.png"
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
  </Grid>
));

const InfoSection = memo(({ title, items }) => (
  <Grid item>
    <Typography variant="h6" fontWeight="bold">
      {title}
    </Typography>
    <List dense>
      {items.map((item, index) => (
        <InfoListItem key={index} {...item} />
      ))}
    </List>
  </Grid>
));

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
      secondary: "Web3 Frontend Intern",
    },
    { icon: PlaceIcon, primary: "Location", secondary: "Remote" },
    {
      icon: CalendarMonthIcon,
      primary: "Date",
      secondary: "May 2024 - Present",
    },
  ];

  return (
    <Grid container alignItems="center" justifyContent="center" spacing={10}>
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
