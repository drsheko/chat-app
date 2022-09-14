import React from "react";
import axios from 'axios'
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import ChatBox from "./chatBox";
import ContactCard from "./contactCard";
import Contacts from "./contacts";
import Search from "./search";
import { useSocket } from "../context/socketProvider";

function ContactSection(props) {
  var user = useContext(UserContext);
  var socket = useSocket();
  const [openChat, setOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [addedFriend, setAddedFriend] =useState(null);
  const [chatRooms, setChatRooms] = useState(null)
  
  useEffect(()=>{
    const getAllChatRooms = async() => {
       var userId = user._id;
        var url = "http://localhost:3001/api/user/all-rooms/join"
       try{
          var res = await axios.post(`http://localhost:3001/api/${userId}/all-rooms/join`)
          var rooms = await res.data.rooms;
         
          setChatRooms(rooms)
          console.log(rooms)
       }
       catch(error){
        console.log(error)
       }
    }
    getAllChatRooms();
   
    
  },[])
  useEffect(()=>{ 
    if(chatRooms !== null){
      socket.emit('join rooms', chatRooms)
    }
    
  },[chatRooms])
  return (
    <div className="row">
      <div className="col">
        <Search setAddedFriend= {setAddedFriend}  addedFriend={addedFriend}
        />
        <Contacts setOpenChat={setOpenChat} setSelectedChat={setSelectedChat}
        addedFriend ={addedFriend}
         />
      </div>

      {openChat === true && selectedChat !== null ? (
        <div className="col">
          <ChatBox setOpenChat={setOpenChat} selectedChat={selectedChat} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ContactSection;
