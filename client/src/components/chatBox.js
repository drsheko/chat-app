import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Popover from "@mui/material/Popover";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../App";
import { useSocket } from "../context/socketProvider";
import { Peer } from "peerjs";
import { usePeer } from "../context/peerProvider";
import CallModal from "./callModal";
import ChatMsg from "./chatMsg";
import InputEmoji from "react-input-emoji";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import CollectionsIcon from "@mui/icons-material/Collections";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import KeyboardVoiceSharpIcon from '@mui/icons-material/KeyboardVoiceSharp';
import CircularProgress from "@mui/material/CircularProgress";
import { red, blue } from "@mui/material/colors";
import { Container, Stack } from "@mui/material";
import Calling from "./Calling";
import AudioRecorder from "./audioRecorder";
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
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [scroll, setScroll] = useState("paper");
  const [messages, setmessages] = useState(chat.messages);
  const [recipients, setRecipients] = useState(null);
  const [input, setInput] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [calling, setCalling] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [decline, setDecline] = useState(false);
  const [upload, setUpload] = useState(null);
  const [uploadURL, setUploadURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [audioRecorder, setAudioRecorder] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState(null);
  const [voiceMsgURL, setVoiceMsgURL] = useState(null)

function toggleAudioRecorder(){
  setAudioRecorder(!audioRecorder);
  console.log('recorder')
}

  function handleOnEnter(text) {
    console.log("enter", text);
  }

  const handleUploadFile = async (e) => {
    var file = e.target.files[0];

    setUpload(file);
    scrollToBottom();
    setIsSelected(true);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(file));
    }
  };
  const localMakeVideoCall = (friendId) => {
    props.setIsCalling(true);
    props.setCallRecipient(recipients);
    props.makeVideoCall(friendId);
  };

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

  const createCallSummaryMessage = async (message) => {
    var url = "http://localhost:3001/api/messages/newMessage/create";
    try {
      var res = await axios.post(url, {
        chatId: chat._id,
        message,
        sender: user._id,
        type:'call'
      });
      var newMessage = await res.data.msg;
      return newMessage

    } catch (error) {
      console.log(error);
    }
  };

  const createPhotoMsg = async (message) => {
    
    var uploadedFileURL;
    const formData = new FormData();
    formData.append("photoMsg", upload);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3001/api/messages/photo-msg/upload",
        data: formData,
      
        headers: { "Content-Type": "multipart/form-data" },
        
      });

      uploadedFileURL = await response.data.URL;
      setUploadURL(uploadedFileURL);
      setUpload(null);
      setIsSelected(false);
    } catch (error) {
      console.log(error);
    }
    var url = "http://localhost:3001/api/messages/newMessage/create";
    try {
      var res = await axios.post(url, {
        chatId: chat._id,
        message: uploadedFileURL,
        sender: user._id,
        type: "photo",
      });
      var newMessage = await res.data.msg;
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  };
  const createVoiceMsg = async (message) => {
    console.log('local createVoiceMsg- blob' , message)
    var uploadedVoiceURL;
    const formData = new FormData();
    formData.append("voiceMsg", message);
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3001/api/messages/voice-msg/upload",
        data: formData,
      
        headers: { "Content-Type": "multipart/form-data" },
        
      });

      uploadedVoiceURL = await response.data.URL;
     
      setVoiceMsgURL(await uploadedVoiceURL);
      console.log('VOICE URL :', uploadedVoiceURL)
      console.log('in first try voiceMSGURL', voiceMsgURL)
      
      //setVoiceMsg(null)
    } catch (error) {
      console.log(error);
    }
    var url = "http://localhost:3001/api/messages/newMessage/create";
    try {
      console.log('second try, voiceMsgURL', uploadedVoiceURL)
      var res = await axios.post(url, {
        chatId: chat._id,
        message: uploadedVoiceURL,
        sender: user._id,
        type: "voice",
      });
      var newMessage = await res.data.msg;
      return newMessage;
    } catch (error) {
      console.log(error);
    }
  };

  const sendPhotoMessage = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    var newMessage = await createPhotoMsg();
    console.log(newMessage);

    socket.emit("chat photo message", {
      newMessage,
      /*room: chat._id,
      sender: user,
      message: uploadURL,
      type:'photo'*/
    });
    setIsUploading(false);
    setmessages((prevState) => [
      ...prevState,
      {
        message:newMessage.message,
        postedBy:{_id:newMessage.postedBy},
        type:newMessage.type,
        chatRoom:newMessage.chatRoom,
        timestamp:newMessage.timestamp}
    ]);
    console.log('user', user)
    console.log('MESSAGES HERE:', messages[messages.length-1]);
    console.log(messages)
  };
  const sendVoiceMessage = async (e,message) => {
    e.preventDefault();
    
    var newMessage = await createVoiceMsg(message);
    console.log('Voice message created',newMessage);

    socket.emit("chat voice message", {
      newMessage,
      /*room: chat._id,
      sender: user,
      message: uploadURL,
      type:'photo'*/
    });
    
    setmessages((prevState) => [
      ...prevState,
      {
        message:newMessage.message,
        postedBy:{_id:newMessage.postedBy},
        type:newMessage.type,
        chatRoom:newMessage.chatRoom,
        timestamp:newMessage.timestamp}
    ]);
    
  };
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", {
      room: chat._id,
      sender: user,
      message: text,
      type:'text'
    });
    createMessage(text);
    setmessages((prevState) => [
      ...prevState,
      { message: text, postedBy: user, type:'text' },
    ]);
    setText("");
  };
  const sendCallSummaryMessage =async(message) => {
    //e.preventDefault();
    socket.emit("chat message", {
      room: chat._id,
      sender: user,
      message: message,
      type:'call'
    });
   var newMessage = await  createCallSummaryMessage(message);
   setmessages((prevState) => [
      ...prevState,
        newMessage
    ]);
    
  };
  const getChatMessagesByRoomId = async(chatId) => {
    var url = "http://localhost:3001/api/rooms/chat/active-chat";
    try {
      var res = await axios.post(url, {
        roomId : chatId
        
      });
      var messages = await res.data.room.messages
      setmessages(messages)
    } catch (error) {
      console.log(error);
    } 
  }
  // -------------useEffect section ---------------------------

  useEffect(() => {
    scrollToBottom();
    getRecipients();

    socket.on("message", (data) => {
      if (data.postedBy._id !== user._id) {
        console.log('text msg received ',data)
        setmessages((prevState) => [...prevState, data]);
      }
    });
  }, []);
  useEffect(() => {
    socket.on("photo message", (data) => {
      if (data.msg.postedBy !== user._id) {
        setmessages((prevState) => [...prevState, data.msg]);
      }
    });
  }, []);
  useEffect(() => {
    socket.on("voice message", (data) => { console.log('receieved voice msg ',data.msg)
      if (data.msg.postedBy !== user._id) {
        setmessages((prevState) => [...prevState, data.msg]);
      }
    });
  }, []);
  /*useEffect((e)=>{
    if(voiceMsg != null){
      console.log('voice message detected')
      sendVoiceMessage(e);
      setVoiceMsg(null)
    }
  },[voiceMsg])*/
  useEffect(() => {
    if (document.readyState === "complete") {
      console.log("readiiiiiiiiiiiiiii");
      scrollToBottom();
    }
  }, [document.readyState]);

  // send message on call canecl 
 /*useEffect(()=>{
    if(props.callSummaryMessage) {
      console.log('cancel message seeeeent', props.callSummaryMessage);
      console.log(messages)
      setmessages((prevState) => [...prevState, props.callSummaryMessage]);
    }
    else{
      console.log('No Cancel')
    }
  },[props.callSummaryMessage])*/

  useEffect(() => {
    if (currentCallRef.current) {
      answerCall(currentCallRef.current);
    }
  }, [answer]);

  useEffect(() => {
    getRecipients();
    setmessages(chat.messages);
  }, [chat]);

  useEffect(()=>{
    const getChatMessagesByRoomId = async(chatId) => {
      var url = "http://localhost:3001/api/rooms/chat/active-chat";
      try {
        var res = await axios.post(url, {
          roomId : chatId
        });
        var messages = await res.data.room.messages;
        setmessages(messages)
      } catch (error) {
        console.log(error);
      } 
    }
    if(props.callSummaryMessage){
      console.log('updatemessages')
     getChatMessagesByRoomId(chat._id);
     props.setCallSummaryMessage(null)
    }
  },[props.callSummaryMessage])
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
    scrollToBottom();
  }, [props.openChat]);
  return (
    <div>
      {isLoading ? (
        "Loading..........."
      ) : (
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
              <Button
                color="inherit"
                onClick={() => localMakeVideoCall(recipients[0]._id)}
              >
                <CallIcon />
              </Button>
              <Button
                color="inherit"
                onClick={() => localMakeVideoCall(recipients[0]._id)}
              >
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
                style={{ padding: 20, minHeight: 60 }}
              >
                {messages.length > 0
                  ? messages.map((m) => (
                      <div>
                        <ChatMsg message={m} userId={user._id} />
                      </div>
                    ))
                  : ""}
                {isSelected ? (
                  <Stack direction="row" sx={{ alignSelf: "end" }}>
                    {isUploading ? (
                      <Box sx={{ display: "flex" }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "0 5px",
                        }}
                      >
                        <Button
                          variant="contained"
                          endIcon={<SendIcon />}
                          size="small"
                          onClick={sendPhotoMessage}
                        >
                          Send
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<DeleteIcon />}
                          size="small"
                          onClick={() => {
                            setIsSelected(false);
                            setUpload(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                    <img
                      src={image ? image : require("../images/unknown.jpg")}
                      className="rounded float-end "
                      height="150"
                      width="150"
                    />
                  </Stack>
                ) : (
                  ""
                )}
                <div ref={bottom}></div>
              </Card>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Paper
              component="form"
              sx={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div class="image-upload">
                <label for="file-input">
                  <CollectionsIcon className="fileInput-icon" />
                </label>
               
                <input
                  id="file-input"
                  type="file"
                  onChange={handleUploadFile}
                />
              </div>
             <audio hidden={!audioRecorder} controls></audio>
             <AudioRecorder  sendVoiceMessage={sendVoiceMessage}/>
             
              <InputEmoji
                value={text}
                onChange={setText}
                cleanOnEnter
                onEnter={handleOnEnter}
                placeholder="Type a message"
              />
              <Divider orientation="vertical" />

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
