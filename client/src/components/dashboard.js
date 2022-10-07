import React from "react";
import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../App";
import PeerProvider, { usePeer } from "../context/peerProvider";
import SocketProvider, { useSocket } from "../context/socketProvider";
import BottomNavbar from "./bottomNavbar";
import ContactSection from "./contactsSection";
import Home from "./home";
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import ChatBox from "./chatBox";
import CallModal from "./callModal";
import GettingCall from "./GettingCall";
import Calling from "./Calling";
import VideoPlayer from "./videoPlayer";
import Settings from "./settings";
function Dashboard() {
  var user = useContext(UserContext);
  var id = user._id;
  var socket = useSocket();
  var myPeer = usePeer();
  var currentCallRef = useRef();
  var localVideoRef = useRef();
  var remoteVideoRef = useRef();
  const [localVideo, setLocalVideo] =useState(null);
  const [remoteVideo, setRemoteVideo] = useState(null)
  const [currentCall, setCurrentCall] = useState(null)
  const [key, setKey] = useState("chats");
  const [openChat, setOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isGettingCall, setIsGettingCall] = useState(false);
  const [isCallEnded, setIsCallEnded] =useState(false)
  const [call, setCall] = useState();
  const [callChatRoom, setCallChatRoom ] =useState(null)
  const [answer, setAnswer] = useState(false);
  const [decline, setDecline] = useState(false);
  const [chatRooms, setChatRooms] = useState(null);
  const [isCallAnswered, setIsCallAnswered] =useState(false);
  const[callRecipient, setCallRecipient] = useState(null)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getChatRoomByCallerId = async(callerId) =>{
      var myID = user._id;
      var friendId = callerId;
      try {
        var userIds = [myID, friendId];
        var res = await axios.post(
          "http://localhost:3001/api/rooms/chat/chat-open",
          {
            userIds,
          }
        );
        var chatRoom = await res.data.chatRoom.room;
        socket.emit("end call", {
          room: chatRoom._id,
        }); 
        setCallChatRoom(chatRoom)
      }
      catch(error){
        console.log(error)
      }
  }

  // call
  const makeVideoCall = async (friendId) => {
    setIsCalling(true); 
    
    socket.roomId = selectedChat._id
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
        const call = myPeer.call(friendId, localStream);
        currentCallRef.current = call;
        setLocalVideo(localStream);

        call.on("stream", (remoteStream) => {
          setIsCallAnswered(true);
          setRemoteVideo(remoteStream)
        });
        call.on("error", (err) => {
          console.log(err);
        });
        call.on("close", () => {
          endCall();
        });
        // save the close function
        setCurrentCall(call)
        
      }
    );
  };
  const canelCall =() => {
    setIsGettingCall(false);
    setIsCalling(false);
    setIsCallAnswered(false);
    if (!currentCall) return;
    try { 
     
      // close cam and mic
      for (const track of localVideoRef.current.srcObject.getTracks()) {
        track.stop();
      }
      for (const track of remoteVideoRef.current.srcObject.getTracks()) {
        track.stop();   console.log(5)
      } 
      
      localVideoRef.current.srcObject=null
      remoteVideoRef.current.srcObject =null

      
      // close the call from my end
      //currentCallRef.close()
     
      getChatRoomByCallerId(currentCall.peer);
      
      
      currentCall.close();
      setCurrentCall(null);
      // reset answer / decline
      // close call from other end
        console.log('chat room emits') 
     
    } catch {}
    currentCallRef.current = undefined;
  }
  function endCall() {
    console.log(currentCallRef.current)
      setIsCallAnswered(false);
      setIsGettingCall(false);
      setIsCalling(false);
    if (!currentCallRef.current) return;
    try { 
     console.log('try')
      // close cam and mic
      for (const track of localVideoRef.current.srcObject.getTracks()) {
        track.stop(); console.log('closed')
      }
      for (const track of remoteVideoRef.current.srcObject.getTracks()) {
        track.stop();   console.log(2)
      } 
      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
      for (const track of localVideo.getTracks()) {
        track.stop(); console.log('closed2')
      }
      for (const track of remoteVideo.getTracks()) {
        track.stop();   console.log(22)
      } 
      setLocalVideo(null)
      setRemoteVideo(null)
      
      // close the call from my end
      //currentCallRef.close()
     
      getChatRoomByCallerId(currentCall.peer);
     
      
       // close the call from my end
       currentCallRef.current.close();
       currentCallRef.current = null;
      currentCall.close();
      setCurrentCall(null);
     
    } catch {}
    currentCallRef.current = undefined;
  }

  // Answer Call
  const answerCall = (call) => {
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
        call.answer(localStream);
        setLocalVideo(localStream)
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play();
      }
    );
    call.on("stream", (remoteStream) => {
      setRemoteVideo(remoteStream)
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
    //currentCallRef.current = call;
    setCurrentCall(call)
  };

 
  // --------------------useEffect Section----------------------------------------
  useEffect(() => {
    const getAllChatRooms = async () => {
      var userId = user._id;
      var url = "http://localhost:3001/api/user/all-rooms/join";
      try {
        var res = await axios.post(
          `http://localhost:3001/api/${userId}/all-rooms/join`
        );
        var rooms = await res.data.rooms;
        setChatRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    };
    getAllChatRooms();
  }, []);
  useEffect(() => {
    if (chatRooms !== null) {
      socket.emit("join rooms", chatRooms);
    }
  }, [chatRooms]);

  useEffect(() => {
    if(socket){ 
      socket.on("recieve end call", (data) => {
        console.log('got end call')
        endCall();
        
      });
  
    }
   if (myPeer) {
    myPeer.on("error", (error) => console.log(error));
    myPeer.on("open", (data) => console.log(data));
    myPeer.on("call", (call) => {
      setIsGettingCall(true);
      setCurrentCall(call)
      currentCallRef.current = call;
    });
   }
    
  },[socket, myPeer]);

  useEffect(()=>{
    if(decline){
      endCall()
    }
  },[decline]);
  useEffect(()=>{ 
    if(localVideoRef.current&&remoteVideoRef.current){
      localVideoRef.current.srcObject=localVideo;
      remoteVideoRef.current.srcObject=remoteVideo;
    } 
  },[localVideo, remoteVideo])
  
  return (
    <div>
      
          {isCallAnswered?
            <VideoPlayer
              ref={{localVideoRef,remoteVideoRef}}
              setIsCallEnded={setIsCallEnded}
              endCall={endCall}
            />

          :isGettingCall?
          <GettingCall isGettingCall={isGettingCall} setIsGettingCall={setIsGettingCall} 
            setDecline={setDecline} 
            endCall={endCall}
            setIsCallAnswered={setIsCallAnswered}
            answerCall={answerCall}
            currentCall={currentCall}
          />
          :isCalling?
          <Calling 
            isCalling={isCalling}
            setIsCalling={setIsCalling}
            callRecipient={callRecipient}
            endCall={endCall}
           
          />
         : openChat === true && selectedChat !== null ? (
            <div style={{ minHeight: "100vh" }}>
              <ChatBox
                setOpenChat={setOpenChat}
                openChat={openChat}
                selectedChat={selectedChat}
                setIsCalling={setIsCalling}
                setIsCallAnswered={setIsCallAnswered}
                makeVideoCall={makeVideoCall}
                setCallRecipient={setCallRecipient}
                ref={{localVideoRef, remoteVideoRef}}
              />
            </div>
          ) : (
            <div>
      
              <Box sx={{ flexGrow: 1 }}>
                  <Paper elevation='20' sx={{ position: 'static', top: 0, left: 0, right: 0 }} >
                  <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Shady
                    </Typography>
                    <Typography variant="h4" component="div" color='primary' sx={{ flexGrow: 1 }}>
                    {key}
                    </Typography>
                      <div>
                        <IconButton
                          size="large"
                          aria-label="account of current user"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleMenu}
                          color="inherit"
                        >
                          <Image
                      roundedCircle="ture"
                      style={{ width: "50px" }}
                      src={require("../images/unknown.jpg")}
                    />
                        </IconButton>
                        <Menu
                          id="menu-appbar"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem >Profile</MenuItem>
                          <MenuItem >My account</MenuItem>
                        </Menu>
                      </div>
                  </Toolbar>
                  </Paper>
              </Box>

              <Container className="mt-5">
                {key === "chats" ? (
                  <ContactSection
                    setOpenChat={setOpenChat}
                    setSelectedChat={setSelectedChat}
                  />
                ) : key === "calls" ? (
                  "calls"
                ) : key === "contacts" ? (
                  "people"
                ) : (
                  <Settings />
                )}
              </Container>

              <BottomNavbar setKey={setKey} />
            </div>
          )}
    </div>
  );
}

export default Dashboard;
