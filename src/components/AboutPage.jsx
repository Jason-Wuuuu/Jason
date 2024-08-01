import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";

import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";

import {
  Face as FaceIcon,
  FaceOutlined as FaceOutlinedIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ThumbUpAlt as ThumbUpAltIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
  ArrowCircleDown as ArrowCircleDownIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  RestartAlt as RestartAltIcon,
} from "@mui/icons-material";

const LazyCardMedia = lazy(() => import("@mui/material/CardMedia"));

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

const StepContentCard = React.memo(({ step, index }) => (
  <Card
    sx={{
      display: { sm: "flex" },
      boxShadow: 10,
      p: 1,
      backgroundColor: "#202020",
    }}
  >
    <Suspense fallback={<Box>Loading...</Box>}>
      <LazyCardMedia
        component="img"
        sx={{
          width: { xs: "100%", sm: "60%" },
          borderRadius: 1,
          boxShadow: 10,
          userSelect: "none",
          pointerEvents: "none",
        }}
        image={`./images/me/${step.image}.png`}
        alt={step.title}
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />
    </Suspense>
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
        {step.content.map((line, i) => (
          <Typography
            key={`step_${index}_line_${i}`}
            fontWeight="bold"
            lineHeight={2}
            sx={{ fontSize: { xs: 14, sm: 15 } }}
          >
            {line}
          </Typography>
        ))}
      </Box>
    </CardContent>
  </Card>
));

function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : 0
    );
  }, []);

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

  const stepsContent = useMemo(
    () =>
      steps.map((step, index) => (
        <Step key={`step_${index}`}>
          <StepLabel
            icon={index === activeStep ? step.icon_on : step.icon_off}
            onClick={() => setActiveStep(index)}
            sx={{
              position: { xs: "sticky", sm: "unset" },
              top: 20,
            }}
          >
            <Typography
              variant={index === activeStep ? "h5" : "subtitle2"}
              fontWeight={index === activeStep ? "bold" : "normal"}
              ml={index === activeStep ? 1 : 0}
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
            <StepContentCard step={step} index={index} />

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
      )),
    [activeStep, handleBack, handleNext, handleReset]
  );

  return (
    <Grid
      container
      justifyContent="center"
      alignContent="center"
      direction="column"
    >
      <Grid item width={{ xs: "90vw", md: "70vw", lg: "60vw" }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {stepsContent}
        </Stepper>
      </Grid>
    </Grid>
  );
}

export default React.memo(AboutPage);
