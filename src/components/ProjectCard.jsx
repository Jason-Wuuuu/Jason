import { useState } from "react";
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
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import Carousel from "react-material-ui-carousel";

import GitHubIcon from "@mui/icons-material/GitHub";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item width={{ xs: "90vw", sm: "60vw" }} mb={3}>
      <Card sx={{ boxShadow: 10 }}>
        <CardHeader
          avatar={<Avatar alt="memoji" src="./images/Memoji.png" />}
          // avatar={
          //   <Tooltip title="Repo" placement="top">
          //     <IconButton
          //       aria-label="github"
          //       href={project.githubUrl}
          //       target="_blank"
          //     >
          //       <GitHubIcon fontSize="large" />
          //     </IconButton>
          //   </Tooltip>
          // }
          title={project.title}
          titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
          subheader={project.tech_stack}
        />

        <Box display="flex" justifyContent="center">
          {
            project.screenshots.length > 0 ? (
              <Box width={{ xs: "95%", sm: "80%" }}>
                <Carousel
                  autoPlay={false}
                  cycleNavigation={false}
                  swipe={false}
                  animation="slide"
                  navButtonsAlwaysVisible
                >
                  {project.screenshots.map((image, i) => (
                    <CardMedia
                      key={i}
                      component="img"
                      image={`./images/${image}`}
                      alt="project_thumbnail"
                    />
                  ))}
                </Carousel>
              </Box>
            ) : null
            // (
            //   <Skeleton
            //     variant="rectangular"
            //     width="70%"
            //     height={200}
            //     animation={false}
            //   />
            // )
          }
        </Box>

        <CardContent>
          <Typography align="center" variant="body2" color="text.secondary">
            {project.description}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <Tooltip title="Repo" placement="top">
            <IconButton
              aria-label="github"
              href={project.githubUrl}
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Demo" placement="top">
            <IconButton
              aria-label="demo"
              href={project.demoUrl}
              target="_blank"
            >
              <OndemandVideoIcon />
            </IconButton>
          </Tooltip>

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Tooltip title="Expand" placement="top">
              <ExpandMoreIcon />
            </Tooltip>
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography align="center" variant="body2" color="text.secondary">
              More info ...
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
}
export default ProjectCard;
