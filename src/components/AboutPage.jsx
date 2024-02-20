import { useState, useEffect, useMemo } from "react";
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
import Button from "@mui/material/Button";

import FaceIcon from "@mui/icons-material/Face";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import NearMeIcon from "@mui/icons-material/NearMe";

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
    if (aboutRef.current)
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeStep]);

  const preloadImages = () => {
    const images = [
      "./images/me/me_1.png",
      "./images/me/me_2.png",
      "./images/me/me_3.png",
      // Add paths to all images used in AboutPage
    ];

    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  };

  useEffect(() => {
    preloadImages();
  }, []);

  const steps = useMemo(
    () => [
      {
        icon_on: <FaceIcon />,
        icon_off: <FaceOutlinedIcon />,
        title: "Who I am",
        image: "me_1",
        content: [
          "👋 Hi! My name is Jason.",
          "🏫 A CS grad from Taiwan currently pursuing my master's at Stevens Institute of Technology.",
          "💻 I'm all about cracking codes and building cool stuff",
        ],
      },
      {
        icon_on: <FavoriteIcon />,
        icon_off: <FavoriteBorderIcon />,
        title: "Things I Like",
        image: "me_2",
        content: [
          "💭 When I'm not coding...",
          "🏂 You'll probably find me shredding the slopes on my snowboard or binge-watching my favorite anime series.",
          "💡 Programming isn't just a job for me; it's a passion that fuels my creativity and keeps me hooked on the endless possibilities of tech.",
        ],
      },
      {
        icon_on: <ThumbUpAltIcon />,
        icon_off: <ThumbUpOffAltIcon />,
        title: "I'm Good at",
        image: "me_3",
        content: [
          "📚 I've got skills and experience in Python, Java, JavaScript, and various frameworks.",
          "🤖 From crafting web apps to delving into machine learning, I love putting my technical know-how to work.",
          "🚀 Plus, I'm adaptable and thrive on learning, making me versatile in any software role.",
        ],
      },
    ],
    []
  );

  return (
    <Fade in timeout={{ appear: 500, enter: 2000 }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="column"
        minHeight="100vh"
      >
        <Grid item width={{ xs: "80vw", md: "70vw", lg: "50vw" }}>
          <Divider sx={{ my: 3 }} ref={aboutRef} />

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={`step_${index}`}>
                <StepLabel
                  sx={{ fontWeight: "bold" }}
                  icon={index === activeStep ? step.icon_on : step.icon_off}
                  onClick={() => setActiveStep(index)}
                  // ref={activeStep === index ? aboutRef : null}
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
                        width: {
                          xs: "100%",
                          sm: "60%",
                        },
                        // height: { xs: "50%", sm: "100%" },
                        borderRadius: 1,
                        boxShadow: 10,
                      }}
                      image={`./images/me/${step.image}.png`}
                      alt={step.image}
                      // loading="lazy"
                    />

                    <CardContent>
                      <Box display="flex" flexDirection="column" height="100%">
                        {step.content.map((line, i) => {
                          return (
                            <Typography
                              // align="center"
                              key={`step_${index}_line_${i}`}
                              variant="body2"
                              m={1}
                            >
                              {line}
                            </Typography>
                          );
                        })}
                      </Box>
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

        <Divider sx={{ my: 3 }} />

        <Grid item mb={3}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="subtitle2"
              // sx={{ fontWeight: "bold" }}
              mb={1}
            >
              Got a glimpse of who I am?
            </Typography>

            <Button
              size="small"
              color="inherit"
              variant="contained"
              startIcon={<NearMeIcon />}
              onClick={() => navigate("/projects")}
              sx={{
                borderRadius: 100,
                boxShadow: 10,
                fontSize: 12,
              }}
            >
              Check out my projects!
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Fade>
  );
}
export default AboutPage;
