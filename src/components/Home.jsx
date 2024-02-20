import { Fragment, useState, useMemo, useRef } from "react";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import Chip from "@mui/material/Chip";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import MainPage from "./MainPage";
import AboutPage from "./AboutPage";
import SocialLinks from "./SocialLinks";

function Home() {
  const [expand, setExpand] = useState(false);

  const aboutRef = useRef(null);

  function handleExpand() {
    expand
      ? aboutRef.current.scrollIntoView({ behavior: "smooth" })
      : setExpand(true);
  }

  const aboutPage = useMemo(() => {
    return expand ? <AboutPage aboutRef={aboutRef} /> : null;
  }, [expand]);

  return (
    <Fragment>
      <MainPage />

      <Grow in timeout={1000}>
        <Box display="flex" justifyContent="center" alignContent="center">
          <Tooltip title="Click to Expand" placement="top" arrow>
            <Chip
              label="About Me"
              icon={<KeyboardArrowDownIcon />}
              sx={{ fontWeight: "bold", boxShadow: 10, border: 1 }}
              variant="outlined"
              onClick={handleExpand}
            />
          </Tooltip>
        </Box>
      </Grow>

      {aboutPage}

      <SocialLinks />
    </Fragment>
  );
}
export default Home;
