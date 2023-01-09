import React, { useState, useContext } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ImageListItem, {
  imageListItemClasses,
} from "@mui/material/ImageListItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
} from "../styled_components/bootstrapDialog";
import { UserContext } from "../App";

function Gallery(props) {
  let { user } = useContext(UserContext);
  const [alignment, setAlignment] = useState("uploads");
  const [photos, setPhotos] = useState(user.pictures.uploads);
  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    let key = event.target.value;
    if (key === "uploads") {
      setPhotos(user.pictures.uploads);
    }
    if (key === "messages") {
      setPhotos(user.pictures.messages);
    }
  };
  const [open, setOpen] = useState(true);
  const theme = createTheme({
    breakpoints: {
      values: {
        mobile: 0,
        bigMobile: 350,
        tablet: 650,
        desktop: 900,
      },
    },
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    props.setIsGalleryOpen(false);
  };
  const StyledImageListItem = styled(({ ...otherProps }) => (
    <ImageListItem {...otherProps} />
  ))`
  &:hover {
    .buttons{
        display:block !important;    
    }
  }  
}`;

  return (
    <BootstrapDialog
      fullScreen
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      scroll="paper"
      open={open}
    >
      <ThemeProvider theme={theme}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          className="text-center"
        >
          <ToggleButtonGroup
            variant="contained"
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Photos"
          >
            <ToggleButton value="uploads" variant="contained">
              Album
            </ToggleButton>
            <ToggleButton value="messages">Private</ToggleButton>
          </ToggleButtonGroup>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                mobile: "repeat(1, 1fr)",
                bigMobile: "repeat(2, 1fr)",
                tablet: "repeat(3, 1fr)",
                desktop: "repeat(4, 1fr)",
              },
              gap: "5px",
              [`& .${imageListItemClasses.root}`]: {
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            {photos.length > 0 ? (
              photos.map((photo) => (
                <StyledImageListItem key={photo}>
                  <img
                    src={photo}
                    srcSet={`${photo}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt="photo"
                    loading="lazy"
                  />
                  <div
                    className="buttons text-center"
                    style={{
                      position: "absolute",
                      backgroundColor: "rgba(97, 96, 90, 0.4)",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      display: "none",
                    }}
                  >
                    <Tooltip title="Delete" arrow>
                      <IconButton></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton>
                        <DeleteIcon sx={{ color: "white" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Set Profile Picture" arrow>
                      <IconButton
                        onClick={() => {
                          props.setGallerySelectedPhoto(photo);
                          props.setIsGalleryOpen(false);
                        }}
                      >
                        <AccountCircleIcon sx={{ color: "white" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </StyledImageListItem>
              ))
            ) : (
              <div className="position-absolute w-100 mt-3 p-2 d-flex justify-content-around">
                <Typography variant="h6">
                  Empty folder — Go back and add some photos!
                </Typography>
              </div>
            )}
          </Box>
        </DialogContent>
      </ThemeProvider>
    </BootstrapDialog>
  );
}

export default Gallery;
