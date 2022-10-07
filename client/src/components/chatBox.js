import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Popover from '@mui/material/Popover';
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../App";
import { useSocket } from "../context/socketProvider";
import { Peer } from "peerjs";
import { usePeer } from "../context/peerProvider";
import CallModal from "./callModal";
import ChatMsg from "./chatMsg";
import InputEmoji from 'react-input-emoji'
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { TransitionProps } from "@mui/material/transitions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SendIcon from "@mui/icons-material/Send";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { red, blue } from "@mui/material/colors";
import { Container } from "@mui/material";
import Calling from "./Calling";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

function ChatBox(props) {
  var user = useContext(UserContext);
  var socket = useSocket();
  var myPeer = usePeer();
  var chat = props.selectedChat;
  const descriptionElementRef = useRef(null);
  var bottom = useRef(null);
  var currentCallRef = useRef(null);
  var localVideoRef = useRef(null);
  var remoteVideoRef = useRef(null);
  const [ text, setText ] = useState('')
  const [fullscreen, setFullscreen] = useState(true);
  const [scroll, setScroll] = useState("paper");
  const [messages, setmessages] = useState(chat.messages);
  const [recipients, setRecipients] = useState(null);
  const [input, setInput] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [calling, setCalling] = useState(false)
  const [answer, setAnswer] = useState(false);
  const [decline, setDecline] = useState(false);
  const [response, setResponse] = useState(null);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  function handleOnEnter (text) {
    console.log('enter', text)
  }
  

  const localMakeVideoCall = (friendId) => {
    props.setIsCalling(true);
    props.setCallRecipient(recipients);
    props.makeVideoCall(friendId)
  }

  // Answer Call
  const answerCall = (call) => {
    console.log(call);
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      {
        video: true,
        audio: true,
      },
      (localStream) => {
        console.log("local stream created");
        call.answer(localStream);
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play();
      }
    );
    call.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
      var playPromise = remoteVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            // Automatic playback has already started!
            // Show playing UI.
          })
          .catch((error) => {
            // Automatic play was stopped
            // Show paused UI.
          });
      }
    });
    //call.on('close',endCall())
    currentCallRef.current = call;
  };

  function endCall() {
    console.log("call end working");
    if (!currentCallRef) return;
    try {
      // close cam and mic
      for (const track of localVideoRef.current.srcObject.getTracks()) {
        track.stop();
      }
      for (const track of remoteVideoRef.current.srcObject.getTracks()) {
        track.stop();
      }
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;

      // close the call from my end
      currentCallRef.current.close();
      currentCallRef.current = null;

      // reset answer / decline
      setAnswer(false);
      setDecline(false);
      // close call from other end
      socket.emit("end call", {
        room: chat._id,
      });
    } catch {}
    currentCallRef.current = undefined;
  }

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      sendMessage();
    }
  };
  const scrollToBottom = () => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  const closeChat = () => {
    props.setOpenChat(false);
  };

  const getRecipients = () => {
    var recipientsArr = chat.userIds.filter(
      (recipient) => recipient._id !== user._id
    );
    setRecipients(recipientsArr);
  };

  const createMessage = async (message) => {
    var url = "http://localhost:3001/api/messages/newMessage/create";
    try {
      var res = await axios.post(url, {
        chatId: chat._id,
        message,
        sender: user._id,
      });
      var newMessage = await res.data.msg;
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      room: chat._id,
      sender: user,
      message: text,
    });
    createMessage(text);
    setmessages((prevState) => [
      ...prevState,
      { message: text, postedBy: user },
    ]);
    setText("");
  };

  useEffect(() => {
    getRecipients();
    
    socket.on("message", (data) => {
      if (data.postedBy._id !== user._id) {
        setmessages((prevState) => [...prevState, data]);
      }
    });
    
  }, []);

  useEffect(() => {
    if (currentCallRef.current) {
      answerCall(currentCallRef.current);
    }
  }, [answer]);

  useEffect(() => {
    getRecipients();
    setmessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (props.openChat) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
       
      }
    }
    scrollToBottom()

  }, [props.openChat]);
  return (
    <div>
      {(
        <Dialog
          fullScreen
          open={props.openChat}
          onClose={closeChat}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={closeChat}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>

              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </StyledBadge>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {recipients !== null
                  ? recipients.map((ele) => <div>{ele.username}</div>)
                  : ""}
              </Typography>
              <Button color="inherit" onClick={() => localMakeVideoCall(recipients[0]._id)}>
                <CallIcon />
              </Button>
              <Button color="inherit" onClick={() => localMakeVideoCall(recipients[0]._id)}>
                <VideocamIcon />
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent dividers="true">
            <DialogContentText>
              <Card
                variant="outlined"
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
                style={{ padding: 20 , minHeight:60}}
              >
                {messages.length > 0
                  ? messages.map((m) => (
                      <div>
                        <ChatMsg message={m} userId={user._id} />
                      </div>
                    ))
                  : ""}
                <div ref={bottom}></div>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Paper
              component="form"
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >

                <InputEmoji
                  value={text}
                  onChange={setText}
                  cleanOnEnter
                  onEnter={handleOnEnter}
                  placeholder="Type a message"
                />
                <Divider orientation="vertical"/>
              

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                color="primary"
                sx={{ p: "10px" }}
                aria-label="directions"
                onClick={sendMessage}
                onKeyDown={handleKeyPress}
              >
                <SendIcon />
              </IconButton>
            </Paper>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default ChatBox;
