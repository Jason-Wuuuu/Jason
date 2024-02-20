import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#242424",
    },
    text: {
      primary: "#fffafa",
    },
  },
  typography: {
    fontFamily: "monospace",
    button: {
      fontWeight: "bold",
      letterSpacing: ".1rem",
    },
  },
});
