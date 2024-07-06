import { useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import Carousel from "react-material-ui-carousel";

import GitHubIcon from "@mui/icons-material/GitHub";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = () => setExpanded(!expanded);

  const carouselItems = useMemo(() => {
    return project.screenshots.map((image, i) => (
      <CardMedia
        key={i}
        component="img"
        image={`./images/${image}`}
        alt={image.split(".")[0]}
        sx={{ boxShadow: 10 }}
        loading="lazy"
      />
    ));
  }, [project.screenshots]);

  return (
    <Grid
      item
      width={{ xs: "90vw", sm: "80vw", md: "70vw", lg: "50vw" }}
      mb={3}
    >
      <Card sx={{ boxShadow: 10, backgroundColor: "#202020" }}>
        <CardHeader
          avatar={
            <Avatar
              alt="memoji"
              src="./images/Memoji.png"
              sx={{ boxShadow: 10 }}
            />
          }
          title={project.title}
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
          subheader={project.tech_stack}
        />

        <Collapse in={expanded} timeout="auto">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {project.screenshots.length > 0 && (
              <Box width={{ xs: "95%", sm: "70%" }}>
                <Carousel
                  autoPlay={false}
                  cycleNavigation={false}
                  swipe={false}
                  animation="slide"
                  navButtonsAlwaysVisible
                >
                  {carouselItems}
                </Carousel>
              </Box>
            )}
          </Box>

          <CardContent sx={{ mx: { xs: 1, sm: 10 } }}>
            <Typography align="center" variant="h6" sx={{ fontWeight: "bold" }}>
              {`${project.course} Project (${project.year})`}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              align="center"
              lineHeight={2}
              // color="text.secondary"
              mx={1}
              sx={{ fontSize: 16 }}
            >
              {project.description}
            </Typography>
          </CardContent>
        </Collapse>

        <CardActions disableSpacing>
          {project.githubUrl && (
            <Tooltip title="Repo" placement="top">
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
              >
                <OndemandVideoIcon />
              </IconButton>
            </Tooltip>
          )}

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
          >
            <Tooltip title="Expand" placement="top">
              <ExpandMoreIcon />
            </Tooltip>
          </ExpandMore>
        </CardActions>
      </Card>
    </Grid>
  );
}
export default ProjectCard;
