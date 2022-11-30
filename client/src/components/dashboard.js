import React from "react";
import axios from "axios";
import { useState, useEffect, useContext, useRef , useCallback} from "react";
import { Link } from "react-router-dom";
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
import Profile from "./profile";
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
  const [callRecipient, setCallRecipient] = useState(null)
  const [ callSummaryMessage, setCallSummaryMessage] =useState(null);
  const [callDuration, setCallDuration] = useState('');
  const [isProfileOpen, setIsProfileOpen] =useState(false);
  const [profileId, setProfileId] = useState(null);
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
       
        setCallChatRoom(chatRoom)
        return chatRoom
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

  const createMessage = async (message,chat) => {
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
  const sendCallIsCancelled =async() => {
    var chatRoom =await getChatRoomByCallerId(callRecipient[0]._id);
    var newMessage = await createMessage('missed', chatRoom);
    setCallSummaryMessage(newMessage);
    
    socket.emit('cancel call', {room:chatRoom._id, message:newMessage});
  }
  const sendCallIsDeclined =async() => {
    var chatRoom =await getChatRoomByCallerId(currentCall.peer);
    var newMessage = await createMessage('missed', chatRoom);
    setCallSummaryMessage(newMessage);
    socket.emit('decline call', {room:chatRoom._id,message:newMessage});
    setIsGettingCall(false);
    setCurrentCall(null)
    currentCallRef.current = null;
  }

  const sendCallIsEnded = async() =>{
    var chatRoom =await getChatRoomByCallerId(currentCall.peer);
    var newMessage = await createMessage(callDuration, chatRoom);
    setCallSummaryMessage(newMessage);
    socket.emit("end call", {
      room: chatRoom._id,
      message: newMessage
    }) 
  }
  const cancelCall =async() => {
    setIsGettingCall(false);
    setIsCalling(false);
    setIsCallAnswered(false);
    try { 
      
      for (const track of currentCallRef.current.localStream.getTracks()) {
        track.stop();  
      } 
      localVideoRef.current.srcObject=null
      remoteVideoRef.current.srcObject =null
      currentCall.close();
      setCurrentCall(null);
      setIsGettingCall(false);
    } catch {}
    currentCallRef.current = undefined;
  }
  
  const endCall= async() => {
      setIsCallAnswered(false);
      setIsGettingCall(false);
      setIsCalling(false);
    if (!currentCallRef.current) return;
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
      for (const track of localVideo.getTracks()) {
        track.stop();
      }
      for (const track of remoteVideo.getTracks()) {
        track.stop();   
      } 
      setLocalVideo(null)
      setRemoteVideo(null)
      
      // close the call from my end
      //currentCallRef.close()
      /*
     var chatRoom = await getChatRoomByCallerId(currentCall.peer)
     socket.emit("end call", {
      room: chatRoom._id,
    }) */
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
  const getAllChatRooms = useCallback(async () => {
    console.log('back')
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
  },[])

 /* useEffect(() => {
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
    // set profile Id == current user id
    setProfileId(user._id)
  }, []);*/
  useEffect(() => {
    if (chatRooms !== null) {
      socket.emit("join rooms", chatRooms);
    }
  }, [chatRooms]);

  useEffect(() => {
    if(socket){ 
      socket.on("recieve end call", (data) => {
        setCallSummaryMessage(data.data.message)
        endCall();
        
      });
      socket.on("cancel call request", (data) => {     
        setCallSummaryMessage(data.message)
        setIsGettingCall(false)
      })
      socket.on("decline call request", (data) => {       
        setCallSummaryMessage(data.data.message);
        cancelCall()
      })
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
          {
          isProfileOpen?
            <Profile id={profileId} setIsProfileOpen={setIsProfileOpen}/>

          
          :isCallAnswered?
            <VideoPlayer
              ref={{localVideoRef,remoteVideoRef}}
              setIsCallEnded={setIsCallEnded}
              setCallDuration ={setCallDuration}
              endCall={endCall}
              sendCallIsEnded ={sendCallIsEnded}
            />

          :isGettingCall?
          <GettingCall isGettingCall={isGettingCall} setIsGettingCall={setIsGettingCall} 
           
            setIsCallAnswered={setIsCallAnswered}
            answerCall={answerCall}
            currentCall={currentCall}
            sendCallIsDeclined={sendCallIsDeclined}
          />
          :isCalling?
          <Calling 
            isCalling={isCalling}
            setIsCalling={setIsCalling}
            callRecipient={callRecipient}
            cancelCall = {cancelCall}
            sendCallIsCancelled={sendCallIsCancelled}
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
                callSummaryMessage ={callSummaryMessage}
                setCallSummaryMessage={setCallSummaryMessage}
              />
            </div>
          ) : (
            <div>
      
              <Box sx={{ flexGrow: 1 }}>
                  <Paper elevation='20' sx={{ position: 'static', top: 0, left: 0, right: 0 }} >
                  <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {user.username}
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
                      style={{ width: "50px" , height:'50px' }}
                      src={user.avatarURL}
                    />
                        </IconButton>
                        <Menu
                          id="menu-appbar"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={()=>{setIsProfileOpen(true)}}>
                            Profile
                          </MenuItem>
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
