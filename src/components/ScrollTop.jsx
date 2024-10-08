import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollTop() {
  const location = useLocation();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    // threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={trigger} timeout={{ appear: 500, enter: 1000, exit: 500 }}>
      <Box
        display="flex"
        role="presentation"
        sx={{
          position: "fixed",
          bottom: location.pathname === "/projects" ? 112 : 16,
          right: 16,
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <Tooltip title="Back to Top" placement="left">
          <Fab
            size="small"
            sx={{
              boxShadow: 10,
              opacity: 0.9,
            }}
            onClick={handleClick}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Fade>
  );
}
