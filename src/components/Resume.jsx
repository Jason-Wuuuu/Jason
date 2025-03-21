import React from "react";
import { Chip } from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";

const Resume = () => {
  const resumeUrl =
    "https://drive.google.com/file/d/1NHWFbXm8ztQXxG5Xjcbhuh9pe662B21A/view";

  const handleOpenResume = () => {
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Chip
      icon={<OpenInNewIcon sx={{ pl: 1 }} />}
      label="Resume"
      sx={{ fontWeight: "bold", boxShadow: 10 }}
      variant="outlined"
      onClick={handleOpenResume}
    />
  );
};

export default Resume;
