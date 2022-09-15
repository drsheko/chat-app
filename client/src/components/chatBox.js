import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../App";
import { useSocket } from "../context/socketProvider";


function ChatBox(props) {
  var user = useContext(UserContext);
  var socket = useSocket();
  var chat = props.selectedChat;
  var bottom = useRef(null)
  const [messages, setmessages] = useState(chat.messages);
  const [recipients, setRecipients] = useState(null);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    bottom.current.scrollIntoView({behavior:'smooth'})
  }
  const handleInputChange = (e) => {
    setInput(e.target.value);
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
      message: input,
    });
    createMessage(input);
    setmessages((prevState) => [
      ...prevState,
      { message: input, postedBy: user },
    ]);
    setInput("");
   
  };

  useEffect(() => {
    getRecipients();

    socket.on("message", (data) => { console.log('got a message')
      if (data.postedBy._id !== user._id) {
        setmessages((prevState) => [...prevState, data]);
      }
    });
  }, []);

  useEffect(() => {
    getRecipients();
    setmessages(chat.messages);
    // console.log('hii',chat.messages)
  }, [chat]);

  useEffect(()=>{
    scrollToBottom()
  },[messages])
  return (
    <div>
      <Card className="text-center m-3 " style={{ height: "90%",maxHeight:'100vh' }}>
        <Card.Header>
          {recipients !== null
            ? recipients.map((ele) => <div>{ele.username}</div>)
            : ""}
          <CloseButton onClick={closeChat} className="text-end" />{" "}
        </Card.Header>

        <Card.Body>
          <Card style={{ minHeight: "300px", maxHeight:'300px', overflowY:'scroll' }}>
            
                <div>
                    {messages.length > 0
                    ? messages.map((m) => (
                        <div>
                            <h3>{m.message}</h3>
                            <h6>{m.postedBy.username}</h6>
                        </div>
                        ))
                    : ""}
                    
                </div>
                <div ref={bottom}></div>
            
             
          </Card>
        </Card.Body>
        <Card.Footer className="text-muted">
          <Form className="row g-2">
            <Form.Control
              type="text"
              value={input}
              className="col"
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              variant="primary"
              className="col-2 ms-1"
              onClick={sendMessage}
              
            >
              Send
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ChatBox;
