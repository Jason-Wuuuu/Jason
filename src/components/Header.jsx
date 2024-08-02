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

import Resume from "./Resume";

import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";

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
          zIndex: (theme) => theme.zIndex.appBar,
          opacity: 0.9,
          // backdropFilter: "blur(5px)",
          boxShadow:
            "0px 8px 10px -5px rgba(0,0,0,0.3), 0px 3px 14px 2px rgba(0,0,0,0.2), 0px 5px 5px -3px rgba(0,0,0,0.12)",
        }}
        // color="transparent"
      >
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <Box alignItems="center" sx={{ flexGrow: 1 }}>
              <Chip
                avatar={
                  <Avatar
                    alt="memoji"
                    src="./images/Memoji_1.png"
                    sx={{ userSelect: "none", pointerEvents: "none" }}
                    draggable="false"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                }
                label="Jason"
                sx={{ fontWeight: "bold", boxShadow: 10 }}
                variant={location.pathname === "/" ? "filled" : "outlined"}
                onClick={() => navigate("/")}
                clickable={location.pathname !== "/"}
              />
            </Box>

            <Box display="flex" gap={{ xs: 1, sm: 2 }}>
              <Box display={location.pathname !== "/projects" && "none"}>
                <Resume />
              </Box>

              <Chip
                icon={<LaptopChromebookIcon sx={{ pl: 1 }} />}
                label="My Projects"
                sx={{ fontWeight: "bold", boxShadow: 10 }}
                variant={
                  location.pathname === "/projects" ? "filled" : "outlined"
                }
                onClick={() => navigate(`/projects`)}
                clickable={location.pathname !== "/projects"}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
}
export default Header;
