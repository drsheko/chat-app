import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import ring from "../sounds/calling.mp3";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Calling({
  setIsCalling,
  isCalling,
  callRecipient,
  cancelCall,
  sendCallIsCancelled,
  sendCallIsDeclined,
}) {
  const [fullscreen, setFullscreen] = useState(true);

  const localCancelCall = async () => {
    sendCallIsCancelled();
    cancelCall();
  };
  useEffect(() => {
    const audio = document.querySelector("audio");
    audio.addEventListener("ended", () => {
      audio.play();
    });
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCalling) {
        sendCallIsDeclined();
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <audio src={ring} autoPlay />
      <Dialog
        fullScreen
        open={isCalling}
        onClose={() => {
          setIsCalling(false);
        }}
        TransitionComponent={Transition}
        overlayStyle={{ backgroundColor: "" }}
      >
        {callRecipient.length > 0 &&
          callRecipient.map((r) => (
            <>
              <AppBar sx={{ position: "relative" }} color="primary">
                <Toolbar>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      setIsCalling(false);
                    }}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>

                  <Typography
                    sx={{ ml: 2, flex: 1 }}
                    variant="h6"
                    display="inline"
                  >
                    Calling
                    <span className="mx-1">{r.username}</span>
                    <span className="spinner">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </span>
                  </Typography>
                  <IconButton
                    autoFocus
                    style={{ backgroundColor: "red" }}
                    color="inherit"
                    onClick={localCancelCall}
                  >
                    <PhoneDisabledIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <List
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  margin: "2rem auto",
                }}
              >
                <Avatar
                  alt={r.username}
                  src={r.avatarURL}
                  sx={{ width: "8rem", height: "8rem", margin: "1rem auto" }}
                />

                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  display="inline"
                >
                  {r.username}
                  <span className="spinner">
                    <div
                      className="bounce1"
                      style={{ backgroundColor: "black" }}
                    ></div>
                    <div
                      className="bounce2"
                      style={{ backgroundColor: "black" }}
                    ></div>
                    <div
                      className="bounce3"
                      style={{ backgroundColor: "black" }}
                    ></div>
                  </span>
                </Typography>
              </List>
            </>
          ))}
      </Dialog>
    </div>
  );
}

export default Calling;
