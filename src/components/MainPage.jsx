import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

function MainPage() {
  return (
    <Fade in timeout={{ appear: 500, enter: 2000 }}>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        direction="column"
        height="90vh"
      >
        <Tooltip title="Hi! 👋" placement="top" arrow>
          <Box
            component="img"
            sx={{
              height: 300,
              width: 300,
              borderRadius: 100,
              boxShadow: 10,
              mb: 1,
            }}
            alt="memoji"
            src="images/Memoji.jpg"
          />
        </Tooltip>

        <Typography align="center" variant="h3" fontWeight="bold">
          Jason Wu
        </Typography>

        <Typography align="center" variant="h5">
          MSCS @ SIT
        </Typography>

        <Typography mt={5} align="center" variant="body1">
          Hi! 👋
        </Typography>

        <Typography mt={1} align="center" variant="body2">
          This is Chia-Hsiang(Jason) Wu
        </Typography>
      </Grid>
    </Fade>
  );
}
export default MainPage;
