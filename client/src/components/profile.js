import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../App";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import StyledImageListItem from "../styled_components/styledImageListItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditProfile from "./editProfile";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import StyledAlert from "../styled_components/styledAlert";
function Profile(props) {
  let id = props.id;
  let { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [removedPhoto, setRemovedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState("uploads");
  const [alignment, setAlignment] = useState("uploads");
  const [userPhotos, setUserPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const handleChange = async (event, newAlignment) => {
    setAlignment(newAlignment);
    let key = event.target.value;
    if (key === "uploads") {
      setPhotos(userPhotos.uploads);
      setType("uploads");
    }
    if (key === "messages") {
      setPhotos(userPhotos.messages);
      setType("messages");
    }
  };

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
  const handleConfirmRemovePhoto = async (e) => {
    let url = "http://localhost:3001/api/user/editProfile/removePicture";
    let photoType = type;
    try {
      let res = await axios.post(url, {
        userId: user._id,
        photoURL: removedPhoto,
        photoType: photoType,
      });
      let success = res.data.success;
      if (success) {
        let updatedUser = res.data.user;
        setUserPhotos(updatedUser.pictures);
        if (type === "uploads") {
          setPhotos(updatedUser.pictures.uploads);
        } else {
          setPhotos(updatedUser.pictures.messages);
        }
        setRemovedPhoto(null);
        setUser(updatedUser);
        localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirmPhotoChange = async (e) => {
    let url = "http://localhost:3001/api/user/editProfile/changeAvatar";
    try {
      let res = await axios.post(url, {
        userId: user._id,
        photoURL: selectedPhoto,
      });
      let success = res.data.success;
      if (success) {
        setSelectedPhoto(null);
        console.log(selectedPhoto);
        let updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.log(error);
    }
  };
  //------------------------------------------
  useEffect(() => {
    if (user._id === id) {
      setIsMyProfile(true);
    }
  }, []);
  useEffect(() => {
    const getProfileUser = async () => {
      let url = "http://localhost:3001/api/users/user";
      try {
        let res = await axios.post(url, {
          userId: id,
        });
        setProfileUser(res.data.user);
      } catch (error) {
        console.log(error.msg);
      }
    };
    setIsLoading(true);
    getProfileUser();
  }, []);
  useEffect(() => {
    if (profileUser) {
      setUserPhotos(profileUser.pictures);
      setPhotos(profileUser.pictures.uploads);
      setIsLoading(false);
    }
  }, [profileUser]);
  /*
  useEffect(() => {
    if (selectedPhoto) {
      handleConfirmPhotoChange();
      setSelectedPhoto(null);
    }
  }, [selectedPhoto]);
*/
  /*
  useEffect(() => {
    if (removedPhoto) {
      handleConfirmRemovePhoto();
      setRemovedPhoto(null);
    }
  }, [removedPhoto, type]);*/
  useEffect(() => {
    if (isMyProfile) {
      setUserPhotos(user.pictures);
    }
  }, [user]);
  return (
    <div className="modal-fullscreen">
      {isLoading || profileUser === null ? (
        <div> NOW LOADING ............ 87%</div>
      ) : isEditing ? (
        <EditProfile setIsEditing={setIsEditing} />
      ) : (
        <div className="row  px-4 ">
          <div className="col-xl-10 col-md-11 col-sm-12 mx-auto">
            <div className="bg-white shadow rounded overflow-hidden">
              <div className="px-4 pt-0 pb-4 bg-dark">
                <IconButton
                  className="text-white mt-3"
                  onClick={() => {
                    props.setIsProfileOpen(false);
                  }}
                >
                  <ArrowBack color="#FFFFFF" />
                </IconButton>
                <div className="  profile-header mb-md-n5  row ">
                  <div className="profile me-3 d-flex flex-column col-lg-3 col-md-4 col-sm-4 col-5">
                    <img
                      src={isMyProfile ? user.avatarURL : profileUser.avatarURL}
                      alt="profile picture"
                      className="rounded mb-2 img-thumbnail "
                    />
                    <div className="text-center">
                      <h3 className="fw-bold text-capitalize">
                        {isMyProfile ? user.username : profileUser.username}
                      </h3>
                    </div>
                  </div>
                  <div className="col-3 text-white d-flex justify-content-center align-items-center pb-2"></div>
                </div>
              </div>

              <div className="bg-light p-4 d-flex justify-content-end text-center ">
                <div>
                  {isMyProfile ? (
                    <Button
                      style={{
                        backgroundColor: "#2196f3",
                        color: "white",
                        "&:hover": { backgroundColor: "#1976d2", color: "red" },
                      }}
                      className="btn  btn-sm container btn-md-md btn-block my-2 "
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit profile
                    </Button>
                  ) : profileUser.friends.includes(user._id) ? (
                    <a className="btn btn-dark btn-sm container btn-md-md btn-block my-2 ">
                      Unfollow
                    </a>
                  ) : (
                    <a className="btn btn-dark btn-sm container btn-md-md btn-block my-2 ">
                      Follow
                    </a>
                  )}

                  <ul className="list-inline mb-0 ">
                    <li className="list-inline-item me-5">
                      <h5 className="font-weight-bold mb-0 d-block">
                        {userPhotos.uploads.length}
                      </h5>
                      <small className="text-muted">
                        {" "}
                        <i className="fa fa-picture-o mr-1"></i>Photos
                      </small>
                    </li>
                    <li className="list-inline-item">
                      <h5 className="font-weight-bold mb-0 d-block">
                        {profileUser.friends.length}
                      </h5>
                      <small className="text-muted">
                        {" "}
                        <i className="fa fa-user-circle-o mr-1"></i>Followers
                      </small>
                    </li>
                    <li className="list-inline-item "></li>
                  </ul>
                </div>
              </div>

              <div class="py-4 px-4">
                <ThemeProvider theme={theme}>
                  <ToggleButtonGroup
                    variant="contained"
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Photos"
                    className="mb-3"
                  >
                    <ToggleButton value="uploads" variant="contained">
                      Album
                    </ToggleButton>
                    {isMyProfile && (
                      <ToggleButton value="messages">Private</ToggleButton>
                    )}
                  </ToggleButtonGroup>
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
                          <img src={photo} alt="photo" loading="lazy" />
                          {isMyProfile && (
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
                                <IconButton
                                  onClick={() => {
                                    setRemovedPhoto(photo);
                                  }}
                                >
                                  <DeleteIcon sx={{ color: "white" }} />
                                </IconButton>
                              </Tooltip>

                              {removedPhoto && (
                                <StyledAlert
                                  title="Delete photo"
                                  content={
                                    <>
                                      You are about to delete photo. continue to
                                      delete?
                                    </>
                                  }
                                  handleClose={() => {
                                    setRemovedPhoto(null);
                                  }}
                                  handleConfirm={handleConfirmRemovePhoto}
                                />
                              )}
                              <Tooltip title="Set Profile Picture" arrow>
                                <IconButton
                                  onClick={() => {
                                    setSelectedPhoto(photo);
                                  }}
                                >
                                  <AccountCircleIcon sx={{ color: "white" }} />
                                </IconButton>
                              </Tooltip>
                              {selectedPhoto !== null && (
                                <StyledAlert
                                  title="Set profile picture"
                                  content={
                                    <>
                                      Continue to set this photo as a profile
                                      picture?
                                    </>
                                  }
                                  handleClose={() => {
                                    setSelectedPhoto(null);
                                  }}
                                  handleConfirm={handleConfirmPhotoChange}
                                />
                              )}
                            </div>
                          )}
                        </StyledImageListItem>
                      ))
                    ) : (
                      <div className="text-center text-nowrap">
                        <Typography variant="h6">
                          Empty folder — Go back and add some photos!
                        </Typography>
                      </div>
                    )}
                  </Box>
                </ThemeProvider>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
