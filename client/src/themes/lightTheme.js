import { createTheme } from "@mui/material/styles";
const lightTheme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      bigMobile: 350,
      tablet: 650,
      desktop: 900,
    },
  },
});

export default lightTheme;
