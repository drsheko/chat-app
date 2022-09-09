import React from "react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";
import ChatBox from "./chatBox";
import ContactCard from "./contactCard";
import Contacts from "./contacts";
import Search from "./search";

function ContactSection(props) {
  const [openChat, setOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [addedFriend, setAddedFriend] =useState(null);
  
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
