import Fab from "@mui/material/Fab";
import Grow from "@mui/material/Grow";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

export default function SocialLinks() {
  return (
    <Grow in timeout={1000}>
      <Box
        justifyContent="center"
        display="flex"
        role="presentation"
        sx={{
          flexDirection: "column",
          position: "fixed",
          bottom: 16,
          left: 16,
        }}
      >
        {/* <Tooltip title="Email" placement="right">
          <IconButton onClick={() => alert("Copied!")}>
            <Fab size="medium" sx={{ boxShadow: 10 }}>
              <AlternateEmailIcon />
            </Fab>
          </IconButton>
        </Tooltip> */}

        <Tooltip title="Instagram" placement="right">
          <IconButton
            href="https://www.instagram.com/jason_wu.0429/"
            target="_blank"
          >
            <Fab size="medium" sx={{ boxShadow: 10 }}>
              <InstagramIcon />
            </Fab>
          </IconButton>
        </Tooltip>

        <Tooltip title="LinkedIn" placement="right">
          <IconButton
            href="http://www.linkedin.com/in/chia-hsiang-jason-wu"
            target="_blank"
          >
            <Fab size="medium" sx={{ boxShadow: 10 }}>
              <LinkedInIcon />
            </Fab>
          </IconButton>
        </Tooltip>

        <Tooltip title="GitHub" placement="right">
          <IconButton href="https://github.com/Jason-Wuuuu" target="_blank">
            <Fab size="medium" sx={{ boxShadow: 10 }}>
              <GitHubIcon />
            </Fab>
          </IconButton>
        </Tooltip>
      </Box>
    </Grow>
  );
}
