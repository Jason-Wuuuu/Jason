import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import NearMeIcon from "@mui/icons-material/NearMe";

import MainPage from "./MainPage";
import AboutPage from "./AboutPage";

function Home() {
  const navigate = useNavigate();

  return (
    <Box py={12}>
      <MainPage />

      <Grow in timeout={1000}>
        <Box
          display="flex"
          justifyContent="center"
          alignContent="center"
          my={5}
          sx={{
            position: "sticky",
            top: 20,
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

      <Typography align="center" variant="h4" fontWeight="bold" py={5}>
        More About Me
      </Typography>

      <AboutPage />
    </Box>
  );
}
export default Home;
