import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
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
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import ChangePasswordForm from "./changePasswordForm";
import ChangeProfileInfo from "./changeProfileInfo";
import MenuItem from "@mui/material/MenuItem";
import { UserContext } from "../App";
import Gallery from "./gallery";
import { Alert, Backdrop, Box, CircularProgress } from "@mui/material";
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

  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = React.useState("panel1");
  const [anchorEl, setAnchorEl] = useState(null);
  const [upload, setUpload] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [gallerySelectedPhoto, setGallerySelectedPhoto] = useState(null);
  const [success, setSuccess] = useState("");
  const openMenu = Boolean(anchorEl);

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
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
                  <div class="btn-group dropend">
                    <i
                      class="bi bi-camera-fill"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></i>
                    <ul class="dropdown-menu">
                      <li>
                        <div class="image-upload dropdown-item">
                          <label for="file-input">
                            <i class="bi bi-upload fileInput-icon"></i>
                            Upload photo
                          </label>

                          <input
                            id="file-input"
                            type="file"
                            onClick={(e) => {
                              e.target.value = null;
                            }}
                            onChange={handleUploadFile}
                          />
                        </div>
                      </li>
                      <li>
                        <button
                          class="dropdown-item ps-4"
                          type="button"
                          onClick={() => {
                            setIsGalleryOpen(true);
                          }}
                        >
                          <i class="bi bi-images"></i>
                          Open Gallery
                        </button>
                      </li>
                    </ul>
                  </div>
                }
              >
                <Avatar
                  alt="Travis Howard"
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
