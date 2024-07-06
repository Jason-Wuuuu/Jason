import { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import FaceIcon from "@mui/icons-material/Face";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";

import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const steps = [
  {
    icon_on: <FaceIcon />,
    icon_off: <FaceOutlinedIcon />,
    title: "Who I am",
    image: "me_1",
    content: [
      "👋 Hey there! My name is Jason, a software engineer from Taiwan.",
      "🏫 Just wrapped up my Master's in CS at Stevens Institute of Technology, class of 2024!",
      "💻 I'm totally into web development and diving deep into AI/ML/DL. Love coding up cool projects and exploring new tech trends!",
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
];

function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => activeStep !== 0 && prevActiveStep - 1);
  }, [activeStep]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
  }, []);

  useEffect(() => {
    // Preload images
    steps.forEach((step) => {
      const img = new Image();
      img.src = `./images/me/${step.image}.png`;
    });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      direction="column"
    >
      <Grid item width={{ xs: "90vw", md: "70vw", lg: "60vw" }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={`step_${index}`}>
              <StepLabel
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

              <StepContent
                TransitionProps={{
                  unmountOnExit: false,
                  timeout: 500,
                }}
              >
                <Card
                  sx={{
                    display: { sm: "flex" },
                    boxShadow: 10,
                    p: 1,
                    backgroundColor: "#202020",
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
                    <Box
                      display="flex"
                      flexDirection="column"
                      height="100%"
                      gap={3}
                      px={1}
                      pt={{ xs: 1 }}
                      pl={{ sm: 1 }}
                    >
                      {step.content.map((line, i) => {
                        return (
                          <Typography
                            // align="center"
                            key={`step_${index}_line_${i}`}
                            fontWeight="bold"
                            lineHeight={2}
                            sx={{ fontSize: 16 }}
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
                    label={index === 2 ? "Back to Start" : "Continue"}
                    icon={
                      index === 2 ? <RestartAltIcon /> : <ArrowCircleDownIcon />
                    }
                    sx={{ fontWeight: "bold", boxShadow: 10, border: 1 }}
                    variant="outlined"
                    onClick={index === 2 ? handleReset : handleNext}
                  />
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
}
export default AboutPage;
