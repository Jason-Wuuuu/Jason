import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GradeIcon from "@mui/icons-material/Grade";
import PlaceIcon from "@mui/icons-material/Place";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

function MainPage() {
  return (
    <Fade in timeout={{ appear: 500, enter: 2000 }}>
      <Grid
        container
        minHeight="70vh"
        alignItems="center"
        justifyContent="center"
      >
        {/* Left */}
        <Grid item xs={12} sm={6} md={6}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Tooltip title="Hi! 👋" placement="top" arrow>
              <Box
                component="img"
                sx={{
                  height: 300,
                  width: 300,
                  borderRadius: 100,
                  boxShadow: 10,
                  mb: 5,
                }}
                alt="memoji"
                src="./images/Memoji.png"
              />
            </Tooltip>

            <Typography align="center" variant="h5" fontWeight="bold" mb={2}>
              Chia-Hsiang(Jason) Wu
            </Typography>

            <Typography align="center" variant="body1">
              Software Engineer / Web Developer
            </Typography>

            <Box my={4}>
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
          </Grid>
        </Grid>

        {/* Right */}
        <Grid item xs={12} sm={6} md={6}>
          <Grid container direction="column">
            {/* Education Section */}
            <Grid item>
              <Typography variant="h6" fontWeight="bold">
                Education
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Stevens Institute of Technology"
                    secondary="Computer Science, M.S."
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GradeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="GPA"
                    secondary="3.87 / 4.0"
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary="Sep 2022 - May 2024"
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </List>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Experience Section */}
            <Grid item>
              <Typography variant="h6" fontWeight="bold">
                Experience
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Crypto-Arsenal"
                    secondary="Web3 Frontend Intern"
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PlaceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary="Remote"
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary="May 2024 - Present"
                    primaryTypographyProps={{
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fade>
  );
}
export default MainPage;
