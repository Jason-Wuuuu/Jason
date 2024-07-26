import React, { memo } from "react";

import {
  Grid,
  Box,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ExperienceItem = memo(
  ({ title, date, company, location, responsibilities }) => (
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
              {location}
            </Typography>
          </Box>
          <List>
            {responsibilities.map((resp, index) => (
              <StyledListItemButton key={index}>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={resp.title}
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary={resp.description}
                  secondaryTypographyProps={{
                    variant: "body2",
                  }}
                />
              </StyledListItemButton>
            ))}
          </List>
        </Box>
      </Grid>
    </Grid>
  )
);

const CompetitionItem = memo(
  ({ title, date, projectName, description, awards, imageSrc }) => (
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
            <img src={imageSrc} alt="Award Image" loading="lazy" width="100%" />
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
              <StyledListItemButton key={index}>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary={award.title}
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary={award.description}
                  secondaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              </StyledListItemButton>
            ))}
          </List>
        </Box>
      </Grid>
    </Grid>
  )
);

function ProfessionalHighlights() {
  const experienceData = {
    title: "Web3 Software Engineer Intern (Frontend)",
    date: "May 2024 − Present",
    company: "🧑‍💻 Crypto-Arsena",
    location: "📍 Taipei, Taiwan (Remote)",
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

  return (
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
    </Box>
  );
}

export default memo(ProfessionalHighlights);
