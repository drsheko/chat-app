import React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import Timer from "./timer";
import IconButton from "@mui/material/IconButton";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallEndIcon from '@mui/icons-material/CallEnd';
import Card from '@mui/material/Card';
const VideoPlayer = (props, ref) => {
  const [duration, setDuration] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const localCallEnd = async () => {
    props.endCall();
    props.sendCallIsEnded();
  };
  const toggleAudio = () => {
    props.muteAudio();
    setAudioEnabled(!audioEnabled);
  };
  const toggleVideo = () => {
    props.turnCameraOff();
    setVideoEnabled(!videoEnabled);
  };
  useEffect(() => {
    props.setCallDuration(duration);
  }, [duration]);

  return (
    <Card style={{height:'100vh', width:'100vw', position:'relative'}}>
      
      <video className="local abs" autoPlay muted ref={ref.localVideoRef} />
      <video
        className="remote"
        autoPlay
        ref={ref.remoteVideoRef}
        style={{ width:'100%',height:'100%' ,objectFit:'cover' }}
      />
      <div className="timer"></div>
      
      <div
        className=" d-flex flex-column justify-content-around pt-1 pb-2"
        style={{
          position: "absolute",
          backgroundColor: "rgba(97, 96, 90, 0.2)",
          right: 0,
          bottom: 0,
          width: "100%"
        }}
      >
        <div className="d-flex justify-content-center">
        <Timer setDuration={setDuration}  />
      </div>
          
        <div className="d-flex justify-content-around">

        
      <IconButton
        style={{ backgroundColor: "gray" }}
        size="large"
        onClick={toggleAudio}
      >
        {audioEnabled ? (
          <KeyboardVoiceIcon fontSize="large" style={{ color: "white" }} />
        ) : (
          <MicOffIcon fontSize="large" style={{ color: "white" }} />
        )}
      </IconButton>
      
   
      <IconButton
        style={{ backgroundColor: "red" }}
        onClick={() => {
          localCallEnd();
        }}
        size="large"
      >
        <CallEndIcon fontSize="large" style={{ color: "white" }} />
      </IconButton>
      
     
      {videoEnabled ? (
        <IconButton
        style={{ backgroundColor: "gray" }}
          size="large"
          onClick={toggleVideo}
        >
          <VideocamIcon fontSize="large" style={{ color: "white" }} />
        </IconButton>
      ) : (
        <IconButton
        style={{ backgroundColor: "gray" }}
          size="large"
          onClick={toggleVideo}
        >
          <VideocamOffRoundedIcon fontSize="large" style={{ color: "white" }} />
        </IconButton>
      )}
      </div>
      
        </div>
      

      
    </Card>
  );
};

export default React.forwardRef(VideoPlayer);
