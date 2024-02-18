import { Fragment, useState } from "react";

import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

function Resume() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Fragment>
      {!loaded && (
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          height="90vh"
          // mt={10}
        >
          <CircularProgress color="inherit" />
        </Grid>
      )}

      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="column"
        height={loaded ? "90vh" : 0}
        mt={10}
        visibility={loaded ? "visible" : "hidden"}
      >
        <iframe
          src="https://drive.google.com/file/d/1FKR9qUmrn8i25gw1AKYR2qbbY3XB3m0l/view?usp=sharing"
          width="90%"
          height="100%"
          allow="autoplay"
          onLoad={() => setLoaded(true)}
        />
      </Grid>
    </Fragment>
  );
}
export default Resume;
