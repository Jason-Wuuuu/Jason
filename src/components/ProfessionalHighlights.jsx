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

      <Grid container py={3}>
        <Grid item xs={12} md={4} borderRight={2}>
          <Box display="flex" height="100%" flexDirection="column" p={3}>
            <div>
              <Typography variant="h4" fontWeight="bold">
                Web3 Software Engineer Intern (Frontend)
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="GrayText"
                mt={2}
              >
                May 2024 − Present
              </Typography>
            </div>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box pl={5}>
            <Typography variant="h5" fontWeight="bold">
              Crypto-Arsena
            </Typography>

            <Typography variant="h6" color="GrayText" fontWeight="bold">
              Taipei, Taiwan (Remote)
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Implemented responsive UI components for the Strategy page"
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Using NextJS and TypeScript, translating Figma designs from the UI/UX team and integrating GraphQL for efficient data fetching and management."
                  secondaryTypographyProps={{
                    fontSize: 16,
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Optimized the Strategy page and its containing components"
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Utilizing useMemo hook, resulting in improved rendering performance and reduced re-computations, enhancing overall responsiveness and user experience."
                  secondaryTypographyProps={{
                    fontSize: 16,
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Participated in weekly Scrum meetings and utilized Storybook"
                  primaryTypographyProps={{
                    fontSize: 18,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="For component development and documentation, contributing to team collaboration and maintaining code quality in a remote work environment."
                  secondaryTypographyProps={{
                    fontSize: 16,
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h4" fontWeight="bold">
        🏆 Competitions
      </Typography>

      <Grid container py={3}>
        <Grid item xs={12} md={4} borderRight={2}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            justifyContent="space-between"
            p={3}
          >
            <div>
              <Typography variant="h4" fontWeight="bold">
                Memory Maker
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="GrayText"
                mt={2}
              >
                Mar 2019 − Aug 2019
              </Typography>
            </div>

            <img src="./images/Award.png" alt="Award Image" loading="lazy" />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box pl={5}>
            <Typography variant="h5" fontWeight="bold">
              Bachelor’s Thesis Project
            </Typography>
            <Typography variant="body1" fontWeight="bold" my={2}>
              Pitched and led the backend development of “Memory Maker,” an iOS
              app created with 5 teammates, featuring machine learning for
              photography guidance and virtual postcard creation, earning
              multiple awards.
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🥈 2nd Place"
                  primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="International ICT Innovative Services Competition"
                  secondaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🥈 2nd Place"
                  primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="TKU iOS APP Competition"
                  secondaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="🏅 Excellence Award"
                  primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="TKU Department of Information Management Project Competition"
                  secondaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: "bold",
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
