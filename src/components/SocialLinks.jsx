import React, { memo } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import Resume from "./Resume";

const SocialLinks = memo(() => (
  <Box display="flex" alignItems="center" gap={2}>
    <Box>
      <Tooltip title="LinkedIn" placement="bottom">
        <IconButton
          href="http://www.linkedin.com/in/chia-hsiang-jason-wu"
          target="_blank"
          size="large"
        >
          <LinkedInIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="GitHub" placement="bottom">
        <IconButton
          href="https://github.com/Jason-Wuuuu"
          target="_blank"
          size="large"
        >
          <GitHubIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
    <Resume />
  </Box>
));

export default SocialLinks;
