import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import ArticleIcon from "@mui/icons-material/Article";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const disableHysteresis = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );

  const trigger = useScrollTrigger({
    disableHysteresis: disableHysteresis,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      <AppBar
        position="fixed"
        sx={{
          opacity: 0.9,
          // backdropFilter: "blur(5px)",
          boxShadow: 10,
        }}
        // color="transparent"
      >
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <Box alignItems="center" sx={{ flexGrow: 1 }}>
              <Chip
                avatar={<Avatar alt="memoji" src="./images/Memoji.png" />}
                label="Jason"
                sx={{ fontWeight: "bold", boxShadow: 10 }}
                variant={location.pathname === "/" ? "filled" : "outlined"}
                onClick={() => navigate("/")}
                clickable={location.pathname !== "/"}
              />
            </Box>

            <Box display="flex">
              <Chip
                icon={<LaptopChromebookIcon sx={{ pl: 1 }} />}
                label="Projects"
                sx={{ fontWeight: "bold", boxShadow: 10, mr: 1 }}
                variant={
                  location.pathname === "/projects" ? "filled" : "outlined"
                }
                onClick={() => navigate(`/projects`)}
                clickable={location.pathname !== "/projects"}
              />

              <Chip
                icon={<ArticleIcon sx={{ pl: 1 }} />}
                label="Resume"
                sx={{ fontWeight: "bold", boxShadow: 10 }}
                variant={
                  location.pathname === "/resume" ? "filled" : "outlined"
                }
                onClick={() => navigate(`/resume`)}
                clickable={location.pathname !== "/resume"}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
}
export default Header;
