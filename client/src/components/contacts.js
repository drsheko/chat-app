import React from "react";
import axios from "axios";
import moment from 'moment'
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import { useSocket } from "../context/socketProvider";
import Image from "react-bootstrap/Image";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import  ListItem  from "@mui/material/ListItem";
import Avatar  from "@mui/material/Avatar";
import ListItemAvatar  from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
function Contacts(props) {
  var user = useContext(UserContext);
  const socket = useSocket();
  const [friends, setFriends] = useState([]);
  const [localSelectedChat, setLocalSelectedChat] = useState(null)
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);
  
  const startChat = async (frndID) => {
    var myID = user._id;
    var friendId = frndID;
    try {
      var userIds = [myID, friendId];
      var res = await axios.post(
        "http://localhost:3001/api/rooms/chat/chat-open",
        {
          userIds,
        }
      );
      var chatRoom = await res.data.chatRoom.room;
      
      if(res.data.chatRoom.isNew){ console.log('created room')
        
        setChatRooms(prevState => [chatRoom, ...prevState])
      }
      // send selected chat info to open it 
      props.setSelectedChat(chatRoom);
      props.setOpenChat(true);
    // mark all messages as readed in db when chat opens
      var chatRoomId = chatRoom._id;
      markMessagesAsReaded(myID, chatRoomId);

      // join room
      socket.emit("join", chatRoom);
    } catch (err) {
      setError(err);
    }
  };

  const markMessagesAsReaded = async(userId, chatRoomId) => {
    try{
        var res = await axios.post(
            "http://localhost:3001/api/messages/chatRoom/mark-read",
            {
                userId:userId,
                chatRoomId:chatRoomId
            }
        )
    }
    catch(err){
       setError(err)
    }
}
  const getUnreadedMessages = async(userId, chatRoomId) => {
        try{
            var res = await axios.post(
                "http://localhost:3001/api/messages/all/unread",
                {
                    userId:userId,
                    chatRoomId:chatRoomId
                }
            )
            var messagesCount = await res.data.msgs.length;
            return messagesCount;
        }
        catch(err){
           setError(err)
        }
  }

  useEffect(() => {
    const getFriends = async () => {
      try {
        var id = user._id;
        var url = `http://localhost:3001/api/contacts/${id}/friends`;
        var res = await axios.post(url);
        var data = await res.data.friends;
        setFriends(data);
      } catch (err) {
        setError(err);
      }
    };
    const getAllChatRooms = async () => {
      var userId = user._id;
      var url = "http://localhost:3001/api/user/all-rooms/join";
      try {
        var res = await axios.post(
          `http://localhost:3001/api/${userId}/all-rooms/join`
        );
        var rooms = await res.data.rooms;
            // set unreaded messages for each chat
            rooms = await Promise.all(rooms.map(async(room)=>{
                var roomId = room._id;
                var count = await getUnreadedMessages(user._id,roomId);
                room.unreadedMessages = count
                return room
            }))
        setChatRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    };
    getAllChatRooms();
    
    getFriends();
  }, []);

  useEffect(() => {
    if(socket){
      socket.on("message", (message) => {
        console.log('got msg', message)
      var updatedChatRooms = chatRooms.map((room) => {
        if (room._id == message.chatRoom) {
           
          room.messages = [...room.messages, message];
          room.unreadedMessages +=1;
          
          return room;
        }
        return room;
      });
      
      console.log('rooms',updatedChatRooms)
      if (updatedChatRooms.length>0) {
        console.log('update rooms')
        setChatRooms(updatedChatRooms);
        console.log("updated", updatedChatRooms);
      }
    });
    socket.on("photo message", (message) => {
      console.log('got msg', message)
    var updatedChatRooms = chatRooms.map((room) => {
      if (room._id == message.msg.chatRoom) {
         
        room.messages = [...room.messages, message.msg];
        room.unreadedMessages +=1;
        
        return room;
      }
      return room;
    });
    
    console.log('rooms',updatedChatRooms)
    if (updatedChatRooms.length>0) {
      console.log('update rooms')
      setChatRooms(updatedChatRooms);
      console.log("updated", updatedChatRooms);
    }
  });
  socket.on("voice message", (message) => {
    console.log('got msg', message)
  var updatedChatRooms = chatRooms.map((room) => {
    if (room._id == message.msg.chatRoom) {
       
      room.messages = [...room.messages, message.msg];
      room.unreadedMessages +=1;
      
      return room;
    }
    return room;
  });
  
  console.log('rooms',updatedChatRooms)
  if (updatedChatRooms.length>0) {
    console.log('update rooms')
    setChatRooms(updatedChatRooms);
    console.log("updated", updatedChatRooms);
  }
});
    }
    
  }, []);

  useEffect(() => {
    if (props.addedFriend) {
      setFriends((prevState) => [props.addedFriend, ...prevState]);
    }
  }, [props.addedFriend]);

  return (
    <div>
      <div className="my-2 p-2 bg-light">
        {friends.length > 0 ? (
          
          <div className="d-flex">
            {friends.map((fr) => (
                <div onClick={() => startChat(fr._id)} className='mx-2' > 
                  <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                    >
                      <Image className="avatar"  src={require('../images/unknown.jpg')} />
                  </StyledBadge>
                  <div>{fr.username}</div>
                </div>
              ))}
          </div>
        ) : (
          "No friends"
        )}
      </div>
      <div>
      {chatRooms.length > 0 ? (
        <>
          {chatRooms.map((r) => (
            <div>
              {friends.length > 0
                ? friends.map((fr) =>
                    fr._id == r.userIds.filter((uId) => uId !== user._id) ? (
                      <div >
                        
                        <ListItem button onClick={() => startChat(fr._id)} >
                          <ListItemAvatar>
                            <Avatar alt="Profile Picture" src={require('../images/unknown.jpg')} />
                          </ListItemAvatar>
                          <ListItemText primary={fr.username}
                              secondary={r.messages.length > 0 ? 
                                
                                  r.messages[r.messages.length - 1].type ==='photo'?
                                  <div>PHOTO MESSAGE</div>
                                  : r.messages[r.messages.length - 1].type ==='voice'?
                                  <div>VOICE MESSAGE</div>
                                  :
                                  <div>{r.messages[r.messages.length - 1].message}</div>
                                
                               
                              : (
                                ""
                              )}
                          />
                          {r.unreadedMessages>0?(
                            <div className="bg-primary rounded-circle text-light text-center me-5" style={{width:'22px', height:'22px'}}>
                              <div className="fs-6 fw-bold">{ r.unreadedMessages} </div>
                              </div>
                            )   
                                :''
                            }
                          <div>
                          {r.messages.length > 0 ? (
                                <div>
                                  {moment(r.messages[r.messages.length - 1].timestamp).format('MMM Do YY') === moment(new Date()).format('MMM Do YY')?
                                    moment(r.messages[r.messages.length - 1].timestamp).format(' h:mm a')
                                    : moment(r.messages[r.messages.length - 1].timestamp).format(' h:mm a, MMM Do YY')
                                }
                                </div>
                              ) : (
                                ""
                              )}
                          </div>
                         

                          
                        </ListItem>
                      </div>
                      
                    ) : (
                      ""
                    )
                  )
                : ""}
                 
              
              
            </div>
          ))}
        </>
      ) : (
        "No chats"
      )}
      </div>
    </div>
  );
}

export default Contacts;
