import React from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import Contacts from "./contacts";
import Search from "./search";
import { useSocket } from "../context/socketProvider";

function ContactSection(props) {
  var { user } = useContext(UserContext);
  var socket = useSocket();
  const [openChat, setOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [addedFriend, setAddedFriend] = useState(null);
  const [chatRooms, setChatRooms] = useState(null);

  useEffect(() => {
    const getAllChatRooms = async () => {
      var userId = user._id;
      try {
        var res = await axios.post(
          `https://chat-app-pi46.onrender.com/api/${userId}/all-rooms/join`
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
    props.setOpenChat(openChat);
    props.setSelectedChat(selectedChat);
  }, [openChat, selectedChat]);
  return (
    <div className="row my-3">
      <div className="col">
        <Search
          setAddedFriend={setAddedFriend}
          addedFriend={addedFriend}
          openProfile={props.openProfile}
        />
        <Contacts
          setOpenChat={setOpenChat}
          setSelectedChat={setSelectedChat}
          addedFriend={addedFriend}
        />
      </div>
    </div>
  );
}

export default ContactSection;
