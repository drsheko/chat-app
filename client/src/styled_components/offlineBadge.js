import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

const OfflineBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "red",
      color:'red',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        
        border: "1px solid currentColor",
        content: '""',
      },
    }
  }));

  export default OfflineBadge ;