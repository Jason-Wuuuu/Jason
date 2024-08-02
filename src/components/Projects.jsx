import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  Grid,
  Typography,
  Fade,
  Box,
  Tabs,
  Tab,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  Backdrop,
} from "@mui/material";

import {
  ChevronRight as ChevronRightIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from "@mui/icons-material";

import DynamicTechSkillsShowcase from "./DynamicTechSkillsShowcase";
import ProjectCard from "./ProjectCard";

import { projects } from "../projectsData.js";

const TableOfContentsItem = React.memo(
  ({ project, index, handleClose, handleJump, isLast }) => (
    <MenuItem
      dense
      onClick={() => {
        handleClose();
        handleJump(`project-${index}`);
      }}
      sx={{
        my: 1,
        py: 1,
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
        },
        transition: "background-color 0.3s",
      }}
    >
      <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
        <ChevronRightIcon fontSize="small" />
      </ListItemIcon>
      <Box width="100%">
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }} noWrap>
          {project.title}
        </Typography>
        <Typography variant="subtitle2" color="lightgray" noWrap>
          {project.tech_stack}
        </Typography>
      </Box>
    </MenuItem>
  )
);

const TableOfContents = React.memo(({ projects }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleJump = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -150;
      const elementTop =
        element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: elementTop, behavior: "smooth" });
    }
  }, []);

  const listItems = useMemo(
    () =>
      projects.map((project, index) => (
        <TableOfContentsItem
          key={index}
          project={project}
          index={index}
          handleClose={handleClose}
          handleJump={handleJump}
          isLast={index === projects.length - 1}
        />
      )),
    [projects, handleClose, handleJump]
  );

  return (
    <>
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
        }}
      />
      <Box
        display="flex"
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 64,
          right: 16,
          zIndex: 1300,
        }}
      >
        <Fab
          size="small"
          variant="extended"
          onClick={handleClick}
          color="default"
          sx={{
            boxShadow: 10,
            opacity: 0.9,
          }}
        >
          <FormatListBulletedIcon sx={{ mr: 1 }} />
          Jump To
        </Fab>
      </Box>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "center", horizontal: "right" }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal,
          "& .MuiPaper-root": {
            backgroundColor: "#202020",
            boxShadow: 10,
          },
          maxHeight: { xs: "85vh", sm: "95vh" },
          maxWidth: { xs: "95vw", sm: "60vw" },
        }}
      >
        {listItems}
      </Menu>
    </>
  );
});

const ProjectsList = React.memo(({ filteredProjects }) => (
  <Grid
    container
    justifyContent="center"
    alignContent="center"
    direction="column"
  >
    {filteredProjects.map((project, index) => (
      <Box id={`project-${index}`} key={project.title}>
        <ProjectCard project={project} />
      </Box>
    ))}
  </Grid>
));

function Projects() {
  const [tab, setTab] = useState(0);

  const handleTab = useCallback((event, newValue) => setTab(newValue), []);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category))],
    []
  );

  const filteredProjects = useMemo(
    () =>
      tab === 0
        ? projects
        : projects.filter((project) => project.category === categories[tab]),
    [tab, categories]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [tab]);

  return (
    <Fade in timeout={500}>
      <Grid container width="100%" direction="column">
        <Grid item pt={12}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight="bold" align="center">
              {categories[tab]} ({filteredProjects.length})
            </Typography>
          </Box>
        </Grid>

        <Grid item mt={2} mb={4}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <DynamicTechSkillsShowcase filteredProjects={filteredProjects} />
          </Box>
        </Grid>

        <Grid item>
          <ProjectsList filteredProjects={filteredProjects} />
        </Grid>

        <Grid item mt={2} mb={10} mx={2}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="caption" align="center" color="text.secondary">
              I'm constantly updating and adding to my selected projects page,
              so stay tuned for more!
            </Typography>
          </Box>
        </Grid>

        <Grid item>
          <Box
            display="flex"
            justifyContent="center"
            width="100%"
            bgcolor="#242424"
            position="fixed"
            right={0}
            bottom={0}
            zIndex={1000}
            sx={{
              boxShadow:
                "0px -8px 10px -5px rgba(0,0,0,0.3), 0px -3px 14px 2px rgba(0,0,0,0.2), 0px -5px 5px -3px rgba(0,0,0,0.12)",
            }}
          >
            <Tabs
              textColor="inherit"
              value={tab}
              onChange={handleTab}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                },
              }}
            >
              {categories.map((category, index) => (
                <Tab key={`${category}-${index}`} label={category} />
              ))}
            </Tabs>
          </Box>
        </Grid>

        <TableOfContents projects={filteredProjects} />
      </Grid>
    </Fade>
  );
}

export default React.memo(Projects);
