import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      bigMobile: 350,
      tablet: 650,
      desktop: 900,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#7b1fa2",
    },
    grey: {
      100: "#616161",
    },
    warning: {
      main: "#fff176",
    },
    background: {
      default: "#212121",
    },
  },
});

export default darkTheme;
