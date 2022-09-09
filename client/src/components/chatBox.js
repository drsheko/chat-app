import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../App";

function ChatBox(props) {
  var user = useContext(UserContext);
  var chat = props.selectedChat;
  const [recipients, setRecipients] = useState(null);

  const closeChat = () => {
    props.setOpenChat(false);
  };

  const getRecipients = () => {
    var recipientsArr = chat.userIds.filter(
      (recipient) => recipient._id !== user._id
    );
    setRecipients(recipientsArr);
    console.log(recipientsArr);
  };

  useEffect(() => {
    getRecipients();
  }, []);
  useEffect(() => {
    getRecipients();
  }, [chat]);

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
             
            </Card>
          </Card.Body>
          <Card.Footer className="text-muted">
            <Form className="row g-2">
              <Form.Control type="text" className="col" />
              <Button variant="primary" className="col-2 ms-1">
                Send
              </Button>
            </Form>
          </Card.Footer>
        </Card>
    </div>
  );
}

export default ChatBox;
