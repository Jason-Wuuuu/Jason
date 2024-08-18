import React, { useState, useEffect } from "react";

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
  Dialog,
  DialogContent,
} from "@mui/material";

import Carousel from "react-material-ui-carousel";

import {
  GitHub as GitHubIcon,
  OndemandVideo as OndemandVideoIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const ExpandMore = ({ expand, onClick, ...other }) => {
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
};

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
              userSelect: "none",
              pointerEvents: "none",
            }}
            loading="lazy"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </Box>
      ))}
    </Carousel>
  </Box>
));

const ProjectCard = React.memo(({ project }) => {
  const [expanded, setExpanded] = useState(project.screenshots.length === 0);
  const [openDialog, setOpenDialog] = useState(false);
  const [demoContent, setDemoContent] = useState("");

  const handleExpandClick = () => setExpanded(!expanded);

  const handleDemoClick = () => {
    if (
      project.demoUrl.startsWith("http") ||
      project.demoUrl.startsWith("www")
    ) {
      window.open(project.demoUrl, "_blank", "noopener,noreferrer");
    } else {
      setOpenDialog(true);
      if (project.demoUrl.endsWith(".html")) {
        fetch(project.demoUrl)
          .then((response) => response.text())
          .then((html) => setDemoContent(html))
          .catch((error) => console.error("Error loading demo:", error));
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    if (openDialog && project.demoUrl.endsWith(".html")) {
      fetch(project.demoUrl)
        .then((response) => response.text())
        .then((html) => {
          setDemoContent(html);
          setTimeout(() => {
            const scripts = document.querySelectorAll(".dialog-content script");
            scripts.forEach((script) => {
              const newScript = document.createElement("script");
              newScript.textContent = script.textContent;
              script.parentNode.replaceChild(newScript, script);
            });
            // Add this line to trigger a resize event
            window.dispatchEvent(new Event("resize"));
          }, 100); // Increase the timeout to 100ms
        })
        .catch((error) => console.error("Error loading demo:", error));
    }
  }, [openDialog, project.demoUrl]);

  return (
    <Grid
      item
      width={{ xs: "95vw", sm: "80vw", md: "70vw", lg: "55vw" }}
      mb={4}
    >
      <Card sx={{ boxShadow: 10, backgroundColor: "#202020" }}>
        <CardHeader
          avatar={
            <Avatar
              alt="memoji"
              src="./images/Memoji_2.png"
              sx={{ boxShadow: 10, userSelect: "none", pointerEvents: "none" }}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            >
              <Box
                component="img"
                src="./images/Memoji_2.png"
                alt="memoji"
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Avatar>
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
            <Tooltip title="GitHub Repo" placement="top-start">
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
            <Tooltip title="Demo" placement="top-start">
              <IconButton
                aria-label="demo"
                onClick={handleDemoClick}
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
            />
          )}
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 1440,
            height: 900,
            maxWidth: "90vw",
            maxHeight: "85vh",
          },
        }}
      >
        <DialogContent sx={{ p: 0, height: "100%", overflow: "auto" }}>
          {project.demoUrl.endsWith(".html") ? (
            <div
              className="dialog-content"
              dangerouslySetInnerHTML={{ __html: demoContent }}
            />
          ) : (
            <iframe
              src={project.demoUrl}
              title="Demo"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
});

export default ProjectCard;
