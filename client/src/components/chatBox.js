import React from "react";
import { useState, useEffect, useContext } from "react";
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
  var socket = useSocket()
  var chat = props.selectedChat;
  const [messages, setmessages] = useState([])
  const [recipients, setRecipients] = useState(null);
  const [input, setInput] =useState('');
  

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const closeChat = () => {
    props.setOpenChat(false);
  };

  const getRecipients = () => {
    var recipientsArr = chat.userIds.filter(
      (recipient) => recipient._id !== user._id
    );
    setRecipients(recipientsArr);

  };

  const sendMessage = (e) => {
    e.preventDefault()

        
    socket.emit('chat message',{room:chat._id, sender:user, message:input});
    setmessages(prevState => [ ...prevState, {message:input, sender:user}]) ;
   
    setInput('')
  }

  useEffect(() => {
    getRecipients();
    console.log('connected to room:', chat._id)
    socket.on('message', (data) =>{
        if(data.sender._id !==user._id){
            setmessages(prevState => [ ...prevState,data]);
            
        }
       
        console.log(messages)
       
    })
  }, []);
  /*useEffect(() => {
    getRecipients();
    
  }, [chat])*/;

  return (
    <div>
        <Card className="text-center m-3 " style={{ height: "90%" }}>
          <Card.Header>
            {recipients !== null
                    ? recipients.map((ele) => <div>{ele.username}</div>)
                    : ""}
            <CloseButton onClick={closeChat} className="text-end" />{" "}
          </Card.Header>

          <Card.Body>
            <Card style={{ height: "85%" }}>
                {
                    messages.length>0?
                    messages.map(m=> 
                        <div>
                        <h3>{m.message}</h3>
                        <h6>{m.sender.username}</h6>
                        </div>
                    )
                    :''
                }
            </Card>
          </Card.Body>
          <Card.Footer className="text-muted">
            <Form className="row g-2">
              <Form.Control type="text" value={input} className="col" onChange={handleInputChange}/>
              <Button type='submit' variant="primary"  className="col-2 ms-1" onClick={sendMessage} >
                Send
              </Button>
            </Form>
          </Card.Footer>
        </Card>
    </div>
  );
}

export default ChatBox;
