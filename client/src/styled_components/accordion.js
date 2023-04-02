import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";

export const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={5} square {...props} />
  ))(({ theme }) => ({
    border: `3px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));
  
 export const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<DoubleArrowRoundedIcon sx={{ color: "white" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: "#2196f3",
    color: "white",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));
  
 export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));