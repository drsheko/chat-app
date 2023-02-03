import { useState } from "react";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

function CallModal(props) {
  const [open, setOpen] =useState(true)
  
  const handleClose = (e) => {
    props.setOpenModal(false);
   
  };

  return (
    <Dialog  
      scroll="paper"
      open={props.openModal}
      onClose={handleClose}
      PaperProps={{ sx: { bgcolor: "transparent" } }}
    >
      <DialogTitle
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : theme.palette.background.paper,
        }}
      >
        Contact {props.friend.username}
      </DialogTitle>
      <Divider />
      <List sx={{ py: 0 }}>
        <ListItem
          disableGutters
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.background.paper,
          }}
        >
          <ListItemButton
            autoFocus
            onClick={() =>{ 
              handleClose();
              props.setCallRecipient([props.friend._id])
              props.makeVideoCall(props.friend._id)}}
          >
            <Typography sx={{ mx: "auto" }} color="primary">
              Video Call
            </Typography>
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem
          disableGutters
          sx={{
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.background.paper,
          }}
        >
          <ListItemButton
            autoFocus
            onClick={() => {
              handleClose();
              props.audioCall(props.friend._id)}}
          >
            <Typography sx={{ mx: "auto" }} color="primary">
              Audio Call
            </Typography>
          </ListItemButton>
        </ListItem>

        <ListItem
          sx={{
            mt: "5px",
            borderRadius: "5px",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : theme.palette.background.paper,
          }}
        >
          <ListItemButton onClick={handleClose}>
            <Typography sx={{ mx: "auto" }} color="primary">
              Cancel
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default CallModal;
