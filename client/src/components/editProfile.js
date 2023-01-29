import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ChangePasswordForm from "./changePasswordForm";
import ChangeProfileInfo from "./changeProfileInfo";
import { UserContext } from "../App";
import Gallery from "./gallery";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsIcon from "@mui/icons-material/Collections";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import resizePhoto from "../tools/compressUpload";
const Accordion = styled((props) => (
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

const AccordionSummary = styled((props) => (
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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
function EditProfile(props) {
  let { user, setUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = React.useState("panel1");
  const [upload, setUpload] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [gallerySelectedPhoto, setGallerySelectedPhoto] = useState(null);
  const [success, setSuccess] = useState("");

  const handleUploadFile = async (e) => {
    var file = e.target.files[0];
    console.log("file before:", file);
    file = await resizePhoto(file);
    console.log("file after: ", file);
    setUpload(file);
    setIsSelected(true);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(file));
    }
    setIsPhotoSelected(false);
  };
  const handleCancelPhotoUpload = () => {
    setUpload(null);
    setIsSelected(false);
    setImage(null);
    setIsPhotoSelected(false);
    setGallerySelectedPhoto(null);
  };
  const handleConfirmPhotoUpload = async () => {
    var uploadedFileURL;
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("avatar", upload);
    try {
      setIsLoading(true);
      const response = await axios({
        method: "post",
        url: "http://localhost:3001/api/user/editProfile/uploadAvatar",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsLoading(false);
      let success = response.data.success;
      if (success) {
        setSuccess(true);
        setUpload(null);
        setIsSelected(false);
        let updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      setSuccess(false);
    }
  };

  const handleConfirmPhotoChange = async () => {
    setIsLoading(true);
    let url = "http://localhost:3001/api/user/editProfile/changeAvatar";
    try {
      let res = await axios.post(url, {
        userId: user._id,
        photoURL: gallerySelectedPhoto,
      });
      let success = res.data.success;
      if (success) {
        setSuccess(true);
        setIsPhotoSelected(false);
        let updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      setSuccess(false);
    }
    setIsLoading(false);
  };

  const changePhoto = async () => {
    if (isSelected) {
      handleConfirmPhotoUpload();
    }
    if (isPhotoSelected) {
      handleConfirmPhotoChange();
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleClose = () => {
    props.setIsEditing(false);
  };

  useEffect(() => {
    if (gallerySelectedPhoto) {
      setIsSelected(false);
      setIsPhotoSelected(true);
      setImage(gallerySelectedPhoto);
    }
  }, [gallerySelectedPhoto]);
  return (
    <>
      {isGalleryOpen ? (
        <Gallery
          setIsGalleryOpen={setIsGalleryOpen}
          setGallerySelectedPhoto={setGallerySelectedPhoto}
        />
      ) : (
        <Dialog fullScreen open={open} onClose={handleClose} scroll="body">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {user.username}
              </Typography>
              <Button autoFocus color="inherit">
                Edit profile
              </Button>
            </Toolbar>
          </AppBar>
          <Card sx={{}}>
            <div className="text-center p-4">
              {success === true ? (
                <Alert
                  severity="success"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setSuccess("");
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Success — Profile picture has been updated!
                </Alert>
              ) : success === false ? (
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setSuccess("");
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  Error — Please try again later!!!
                </Alert>
              ) : (
                ""
              )}
              <Badge
                className="m-2"
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Box class="btn-group dropend">
                    <i
                      class="bi bi-camera-fill"
                      type="button"
                      id="demo-positioned-button"
                      aria-controls={
                        openMenu ? "demo-positioned-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={handleClickMenu}
                    ></i>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleCloseMenu}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem>
                        <label
                          htmlFor="file-input"
                          className="d-flex flex-row"
                          style={{ cursor: "pointer" }}
                        >
                          <ListItemIcon>
                            <FileUploadRoundedIcon
                              color="primary"
                              className="px-0"
                            />
                          </ListItemIcon>
                          <ListItemText primary="Upload photo" />
                        </label>
                        <input
                          id="file-input"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            handleCloseMenu();
                            handleUploadFile(e);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                          }}
                        />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleCloseMenu();
                          setIsGalleryOpen(true);
                        }}
                      >
                        {" "}
                        <ListItemIcon>
                          <CollectionsIcon color="primary" className="px-0" />
                        </ListItemIcon>
                        <ListItemText primary="Open Gallery" />
                      </MenuItem>
                    </Menu>
                  </Box>
                }
              >
                <Avatar
                  alt={user.username}
                  src={image ? image : user.avatarURL}
                  sx={{ width: 100, height: 100 }}
                />
              </Badge>
              {isLoading ? (
                <Box className="text-center">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {isPhotoSelected || isSelected ? (
                    <div>
                      <Button onClick={changePhoto}>Confirm</Button>
                      <Button onClick={handleCancelPhotoUpload}>Cancel</Button>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>

            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Change User Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChangeProfileInfo />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>Change password</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ChangePasswordForm />
              </AccordionDetails>
            </Accordion>
          </Card>
        </Dialog>
      )}
    </>
  );
}

export default EditProfile;
