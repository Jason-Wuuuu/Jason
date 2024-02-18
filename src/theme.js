import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "monospace",
    button: {
      fontWeight: "bold",
      letterSpacing: ".1rem",
    },
  },
});
