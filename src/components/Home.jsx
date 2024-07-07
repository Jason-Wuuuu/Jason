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
import ProfessionalHighlights from "./ProfessionalHighlights";

function Home() {
  const navigate = useNavigate();

  return (
    <Fade in timeout={{ appear: 500, enter: 1000 }}>
      <Box py={10} sx={{ width: "85%", margin: "auto" }}>
        <Box alignContent="center" minHeight="85vh">
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            mb={{ sm: 10 }}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Jason's Portfolio
          </Typography>

          <MainPage />
        </Box>

        <Grow in timeout={1000}>
          <Box
            display="flex"
            justifyContent="center"
            alignContent="center"
            // my={{ xs: 3, sx: 6 }}
            sx={{
              position: "fixed",
              // top: { xs: 16, sm: 30 },
              bottom: { xs: 16, sm: 30 },
              left: 0,
              right: 0,
              zIndex: 20,
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
              Check Out My Projects!
            </Button>
          </Box>
        </Grow>

        <Divider sx={{ my: 5 }} />

        <Box
          minHeight="75vh"
          sx={{ width: { xs: "95%", sm: "80%" }, margin: "auto" }}
        >
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            mb={8}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Professional Highlights
          </Typography>

          <ProfessionalHighlights />
        </Box>

        <Divider sx={{ my: 5 }} />

        <Box minHeight="75vh">
          <Typography
            variant="h4"
            align="center"
            fontWeight="bold"
            mb={5}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            More About Me
          </Typography>

          <AboutPage />
        </Box>
      </Box>
    </Fade>
  );
}
export default Home;
