import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Fade from "@mui/material/Fade";
import Link from "@mui/material/Link";

import FaceIcon from "@mui/icons-material/Face";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import ArticleIcon from "@mui/icons-material/Article";

const steps = [
  {
    icon_on: <FaceIcon />,
    icon_off: <FaceOutlinedIcon />,
    title: "About Me",
    image: "me_1",
    content: [
      "Hi! My name is Chia-Hsiang(Jason) Wu.",
      "I am currently a graduate CS student at Stevens Institute of Technology.",
    ],
  },
  {
    icon_on: <FavoriteIcon />,
    icon_off: <FavoriteBorderIcon />,
    title: "Things I Like",
    image: "me_2",
    content: ["1. Programming", "2. Snowboarding", "3. Watching Anime"],
  },
  {
    icon_on: <ThumbUpAltIcon />,
    icon_off: <ThumbUpOffAltIcon />,
    title: "I'm Good at",
    image: "me_3",
    content: ["Things I am good at ..."],
  },
];

function AboutPage({ aboutRef }) {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep !== 0) setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    // console.log(aboutRef.current);
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeStep]);

  return (
    <Fade in timeout={{ appear: 500, enter: 2000 }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="column"
        minHeight="100vh"
      >
        <Grid item width={{ xs: "80vw", md: "70vw", lg: "60vw" }}>
          <Divider sx={{ mt: 5, mb: 5 }} />

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step
                key={`step_${index}`}
                ref={index === activeStep ? aboutRef : null}
              >
                <StepLabel
                  sx={{ fontWeight: "bold" }}
                  icon={index === activeStep ? step.icon_on : step.icon_off}
                  onClick={() => setActiveStep(index)}
                >
                  <Typography
                    variant={index === activeStep ? "h5" : "subtitle2"}
                    color={index === activeStep ? "inherit" : "text.secondary"}
                    fontWeight={index === activeStep ? "bold" : ""}
                    ml={index === activeStep && 1}
                  >
                    {step.title}
                  </Typography>
                </StepLabel>

                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  <Card
                    sx={{
                      display: { sm: "flex" },
                      boxShadow: 10,
                      p: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "100%", sm: "60%" },
                        height: { xs: "50%", sm: "100%" },
                        borderRadius: 1,
                        boxShadow: 10,
                      }}
                      image={`/images/me/${step.image}.png`}
                      alt={step.image}
                    />

                    <CardContent>
                      {step.content.map((line, i) => {
                        return (
                          <Typography
                            key={`step_${index}_line_${i}`}
                            variant="body2"
                            paragraph
                          >
                            {line}
                          </Typography>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Box sx={{ mt: 2 }} display="flex" justifyContent="flex-end">
                    {index !== 0 && (
                      <Chip
                        label="Back"
                        icon={<ArrowCircleUpIcon />}
                        sx={{
                          fontWeight: "bold",
                          boxShadow: 10,
                          border: 1,
                          mr: 2,
                        }}
                        variant="outlined"
                        onClick={handleBack}
                      />
                    )}

                    <Chip
                      label={
                        index === steps.length - 1
                          ? "Back to Start"
                          : "Continue"
                      }
                      icon={
                        index === steps.length - 1 ? (
                          <RestartAltIcon />
                        ) : (
                          <ArrowCircleDownIcon />
                        )
                      }
                      sx={{ fontWeight: "bold", boxShadow: 10, border: 1 }}
                      variant="outlined"
                      onClick={
                        index === steps.length - 1 ? handleReset : handleNext
                      }
                    />
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Divider sx={{ mt: 5 }} />
      </Grid>
    </Fade>
  );
}
export default AboutPage;
