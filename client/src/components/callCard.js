import React, { useEffect, useState } from "react";
import { useContext } from "react";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import { UserContext } from "../App";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

function CallCard(c) {
  let { user } = useContext(UserContext);
  const [call, setCall] = useState(c.call);
  const [time, setTime] = useState(call.timestamps);
  useEffect(() => {
    console.log(new Date(Date.now()));
  }, [call]);
  return (
    <div className="d-flex flex-row px-2 mb-1">
      <div className="d-flex flex-column justify-content-center">
        <Avatar
          src={
            call.caller._id === user._id
              ? call.recipient.avatarURL
              : call.caller.avatarURL
          }
        />
      </div>
      <div className="d-flex flex-column mx-2  w-100">
        <Typography className="text-capitalize fw-bold mt-3">
          {call.caller._id === user._id
            ? call.recipient.username
            : call.caller.username}
        </Typography>
        <div className="d-flex flex-row justify-content-between ">
          <div className="d-flex flex-row me-auto">
            {call.type === "video" ? (
              call.status === "answered" ? (
                <VideocamIcon style={{ color: "green", height:'24px', width:'24px' }} />
              ) : (
                <VideocamIcon style={{ color: "red", height:'24px', width:'24px' }} />
              )
            ) : call.status === "answered" ? (
              <CallEndIcon style={{ color: "green", height:'24px', width:'24px' }} />
            ) : (
              <CallEndIcon style={{ color: "red", height:'24px', width:'24px' }} />
            )}
            <p className="text-muted">
              {call.caller._id === user._id ? <CallMadeIcon/> : <CallReceivedIcon />}
            </p>

            {call.status === "answered" ? (
              call.duration
            ) : (
              <p className="text-capitalize">{call.status}</p>
            )}
          </div>
          <div className="align-content-end text-muted fs-6">
            {moment(call.timestamps).format("MMM Do YY") ===
            moment(new Date()).format("MMM Do YY")
              ? moment(call.timestamps).format(" h:mm a")
              : moment(call.timestamps).format(" h:mm a, MMM D, YY")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallCard;
