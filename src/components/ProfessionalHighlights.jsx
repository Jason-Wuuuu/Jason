import {
  Grid,
  Box,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
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

              <Typography
                variant="body1"
                color="lightgray"
                align="justify"
                sx={{ py: { xs: 1 } }}
              >
                NextJS, TypeScript, GraphQL, React Hooks, Git, Agile/Scrum
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
              <ListItemButton>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Responsive UI Development for Web3 Platform"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Developed and optimized responsive UI components using NextJS, TypeScript, and GraphQL. Translated Figma designs into functional interfaces and enhanced rendering performance with React hooks like useMemo."
                  secondaryTypographyProps={{
                    variant: "body2",
                    // align: "justify",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Component Development and Quality Assurance"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Utilized Storybook for efficient component development, testing, and documentation. Improved development workflow and maintained high code quality standards through comprehensive component library management."
                  secondaryTypographyProps={{
                    variant: "body2",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon sx={{ display: { xs: "none", sm: "block" } }}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Team Collaboration and Knowledge Sharing"
                  primaryTypographyProps={{
                    fontSize: { xs: 16, sm: 18 },
                    fontWeight: "bold",
                    mb: 1,
                  }}
                  secondary="Presented advanced Git techniques in weekly dev meetings and actively participated in Scrum ceremonies. Fostered collaboration and knowledge sharing in a remote work environment, enhancing team proficiency in version control and agile methodologies."
                  secondaryTypographyProps={{
                    variant: "body2",
                    // align: "justify",
                    // display: { xs: "none", sm: "block" },
                  }}
                />
              </ListItemButton>
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
            <Typography variant="h5" fontWeight="bold">
              🤖 Senior Project
            </Typography>

            <Typography
              variant="body2"
              color="lightgray"
              // align="justify"
              sx={{ py: { xs: 1 } }}
            >
              Pitched and led the backend development of “Memory Maker”, an iOS
              app created with 5 teammates, featuring machine learning for
              photography guidance and virtual postcard creation, earning
              multiple awards.
            </Typography>

            <List>
              <ListItemButton>
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
              </ListItemButton>
              <ListItemButton>
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
              </ListItemButton>
              <ListItemButton>
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
              </ListItemButton>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
export default ProfessionalHighlights;
