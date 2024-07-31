import React, { useState } from "react";

import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Grid,
  Tooltip,
  Box,
  Divider,
  Link,
} from "@mui/material";

import Carousel from "react-material-ui-carousel";

import {
  GitHub as GitHubIcon,
  OndemandVideo as OndemandVideoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const ExpandMore = styled(({ expand, onClick, ...other }) => {
  return (
    <Link
      component="button"
      onClick={onClick}
      underline="hover"
      sx={{
        display: "flex",
        alignItems: "center",
        ml: "auto",
        color: "inherit",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      {...other}
    >
      <Typography variant="body2" fontWeight="bold">
        {expand ? "Collapse" : "Expand"}
      </Typography>
      <ExpandMoreIcon
        sx={{
          m: 1,
          transform: expand ? "rotate(180deg)" : "rotate(0deg)",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.short,
            }),
        }}
      />
    </Link>
  );
})(() => ({}));
const ProjectDescription = React.memo(({ description }) => (
  <Typography
    align="center"
    lineHeight={1.5}
    mx={1}
    sx={{
      fontSize: { xs: 14, sm: 15 },
      fontWeight: "bold",
      whiteSpace: "pre-line",
      width: { xs: "90%", sm: "80%" },
      margin: "0 auto",
      hyphens: { xs: "auto", sm: "none" },
    }}
  >
    {description.split(". ").map((sentence, index) => (
      <span key={index} style={{ display: "block", marginBottom: "16px" }}>
        {sentence}
        {index < description.split(". ").length - 1 && <br />}
      </span>
    ))}
  </Typography>
));

const ProjectCarousel = React.memo(({ screenshots }) => (
  <Box width={{ xs: "90%", sm: "85%" }}>
    <Carousel
      autoPlay={false}
      cycleNavigation={false}
      swipe={false}
      animation="slide"
      navButtonsAlwaysVisible
      fullHeightHover
    >
      {screenshots.map((image, i) => (
        <Box
          key={i}
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9 Aspect Ratio
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={`./images/${image}`}
            alt={image.split(".")[0]}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            loading="lazy"
          />
        </Box>
      ))}
    </Carousel>
  </Box>
));

const ProjectCard = React.memo(({ project }) => {
  const [expanded, setExpanded] = useState(project.screenshots.length === 0);

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Grid
      item
      width={{ xs: "95vw", sm: "80vw", md: "70vw", lg: "55vw" }}
      mb={3}
    >
      <Card sx={{ boxShadow: 10, backgroundColor: "#202020" }}>
        <CardHeader
          avatar={
            <Avatar
              alt="memoji"
              src="./images/Memoji_2.png"
              sx={{ boxShadow: 10 }}
            />
          }
          title={project.title}
          titleTypographyProps={{
            fontSize: { xs: 18, sm: 20 },
            fontWeight: "bold",
          }}
          subheader={project.tech_stack}
          subheaderTypographyProps={{
            fontSize: { xs: 11, sm: 13 },
            fontWeight: "bold",
          }}
        />

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {project.screenshots.length > 0 && (
            <ProjectCarousel screenshots={project.screenshots} />
          )}
        </Box>

        <CardContent>
          <Typography
            align="center"
            sx={{ fontWeight: "bold", fontSize: { xs: 16, sm: 18 } }}
          >
            {`${project.course} Project (${project.year})`}
          </Typography>

          <Collapse in={expanded} timeout="auto">
            <Divider sx={{ m: 2 }} />
            <ProjectDescription description={project.description} />

            {project.githubUrl && (
              <Typography
                fontSize={{ xs: 12, sm: 14 }}
                align="center"
                color="lightgray"
                mt={5}
              >
                See full project details in the{" "}
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="always"
                >
                  README
                </Link>
              </Typography>
            )}
          </Collapse>
        </CardContent>

        <CardActions disableSpacing>
          {project.githubUrl && (
            <Tooltip title="GitHub Repo" placement="top">
              <IconButton
                aria-label="github"
                href={project.githubUrl}
                target="_blank"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}

          {project.demoUrl && (
            <Tooltip title="Demo" placement="top">
              <IconButton
                aria-label="demo"
                href={project.demoUrl}
                target="_blank"
                sx={{ marginLeft: 1 }}
              >
                <OndemandVideoIcon />
              </IconButton>
            </Tooltip>
          )}

          {project.screenshots.length > 0 && (
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
});

export default ProjectCard;
