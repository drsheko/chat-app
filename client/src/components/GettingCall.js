import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import CallIcon from "@mui/icons-material/Call";

function GettingCall(props) {
  const [caller, setCaller] = useState(null);
  const answerVideoCall = (call) => {
    props.answerCall(call);
    props.setIsCallAnswered(true);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.isGettingCall) {
        props.sendCallIsDeclined();
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const getCallerInfo = async () => {
      let url = "http://localhost:3001/api/users/user";
      try {
        let res = await axios.post(url, {
          userId: props.currentCall.peer,
        });
        setCaller(res.data.user);
      } catch (error) {
        console.log(error.msg);
      }
    };
    getCallerInfo();
  }, []);

  return (
    <div>
      {caller && (
        <Dialog
          fullScreen
          open={props.isGettingCall}
          onClose={() => {
            props.setIsGettingCall(false);
          }}
        >
          <AppBar sx={{ position: "relative" }} color="primary">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  props.setIsGettingCall(false);
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                sx={{ ml: 2, flex: 1 }}
                variant="h6"
                display="inline"
                component="div"
              >
                {caller.username} is calling
                <span class="spinner">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </span>
              </Typography>
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
              alt="Remy Sharp"
              src={caller.avatarURL}
              sx={{ width: "8rem", height: "8rem", margin: "1rem auto" }}
            />

            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              display="inline"
              component="div"
            >
              {caller.username}
              <span class="spinner">
                <div class="bounce1" style={{ backgroundColor: "black" }}></div>
                <div class="bounce2" style={{ backgroundColor: "black" }}></div>
                <div class="bounce3" style={{ backgroundColor: "black" }}></div>
              </span>
            </Typography>
          </List>
          <div className="d-flex justify-content-around py-5">
            <IconButton
              onClick={() => {
                answerVideoCall(props.currentCall);
              }}
              style={{ backgroundColor: "green" }}
            >
              <CallIcon fontSize="large" style={{ color: "white" }} />
            </IconButton>

            <IconButton
              style={{ backgroundColor: "red" }}
              onClick={props.sendCallIsDeclined}
            >
              <PhoneDisabledIcon fontSize="large" style={{ color: "white" }} />
            </IconButton>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export default GettingCall;
