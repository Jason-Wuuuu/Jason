import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import NearMeIcon from "@mui/icons-material/NearMe";

import MainPage from "./MainPage";
import AboutPage from "./AboutPage";
import ExperienceDetails from "./ExperienceDetails";

function Home() {
  const navigate = useNavigate();

  return (
    <Fade in timeout={{ appear: 500, enter: 1000 }}>
      <Box pt={{ xs: 12, sm: 5 }} pb={12} sx={{ width: "85%", margin: "auto" }}>
        <Box flex="column" minHeight="90vh" alignContent="center">
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            mb={{ xs: 5, sm: 10 }}
          >
            Jason's Portfolio
          </Typography>

          <MainPage />
        </Box>

        {/* <Divider sx={{ my: 5 }} />

        <Box flex="column" minHeight="75vh">
          <Typography variant="h4" align="center" fontWeight="bold" mb={5}>
            Exp Details
          </Typography>

          <ExperienceDetails />
        </Box> */}

        <Divider sx={{ my: 5 }} />

        <Box flex="column" minHeight="75vh">
          <Typography variant="h4" align="center" fontWeight="bold" mb={5}>
            More About Me
          </Typography>

          <AboutPage />
        </Box>

        <Grow in timeout={1000}>
          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 30 },
              left: 0,
              right: 0,
            }}
          >
            <Button
              size="large"
              color="inherit"
              variant="contained"
              startIcon={<NearMeIcon />}
              sx={{
                borderRadius: 100,
                boxShadow: 10,
                fontSize: 12,
                border: 2,
              }}
              onClick={() => navigate("/projects")}
            >
              Check out my projects!
            </Button>
          </Box>
        </Grow>
      </Box>
    </Fade>
  );
}
export default Home;
