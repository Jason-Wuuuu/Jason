import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

function ProfessionalHighlights() {
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h4" fontWeight="bold">
        💼 Experience
      </Typography>

      <Grid
        container
        py={3}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            p={{ sm: 3 }}
            borderRight={{ sm: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Web3 Software Engineer Intern (Frontend)
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                color="lightgray"
                my={{ xs: 1, sm: 2 }}
              >
                May 2024 − Present
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} pt={{ xs: 3 }}>
          <Box pl={{ sm: 5 }} mb={1}>
            <Box
              display="flex"
              justifyContent={{ xs: "block", sm: "space-between" }}
              alignItems="baseline"
            >
              <Typography variant="h5" fontWeight="bold">
                🧑‍💻 Crypto-Arsena
              </Typography>

              <Typography
                variant="body1"
                color="lightgray"
                fontWeight="bold"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                📍 Taipei, Taiwan (Remote)
              </Typography>
            </Box>

            <List>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Implemented responsive UI components for the Strategy page"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Using NextJS and TypeScript, translating Figma designs from the UI/UX team and integrating GraphQL for efficient data fetching and management."
                  secondaryTypographyProps={{
                    fontSize: { xs: 14, sm: 15 },
                    // align: "justify",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Optimized the Strategy page and its containing components"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Utilizing useMemo hook, resulting in improved rendering performance and reduced re-computations, enhancing overall responsiveness and user experience."
                  secondaryTypographyProps={{
                    fontSize: { xs: 14, sm: 15 },
                    // align: "justify",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Participated in weekly Scrum meetings and utilized Storybook"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="For component development and documentation, contributing to team collaboration and maintaining code quality in a remote work environment."
                  secondaryTypographyProps={{
                    fontSize: { xs: 14, sm: 15 },
                    // align: "justify",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} flexItem />

      <Typography variant="h4" fontWeight="bold">
        🏆 Competitions
      </Typography>

      <Grid
        container
        py={3}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="space-between"
            p={{ sm: 3 }}
            borderRight={{ sm: 2 }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Memory Maker
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                color="lightgray"
                my={{ xs: 1, sm: 2 }}
              >
                Mar 2019 − Aug 2019
              </Typography>
            </Box>

            <Box width="100%" display="flex" justifyContent="center">
              <img
                src="./images/Award.png"
                alt="Award Image"
                loading="lazy"
                width="100%"
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} pt={{ xs: 3 }}>
          <Box pl={{ sm: 5 }} mb={1}>
            <Typography
              fontWeight="bold"
              // align="justify"
              sx={{ fontSize: { xs: 15, sm: 18 } }}
              // sx={{ display: { xs: "none", sm: "block" } }}
            >
              Pitched and led the backend development of “Memory Maker,” an iOS
              app created with 5 teammates, featuring machine learning for
              photography guidance and virtual postcard creation, earning
              multiple awards.
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🥈 2nd Place"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="International ICT Innovative Services Competition"
                  secondaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🥈 2nd Place"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="TKU iOS APP Competition"
                  secondaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🏅 Excellence Award"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="TKU Department of Information Management Project Competition"
                  secondaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ProfessionalHighlights;
