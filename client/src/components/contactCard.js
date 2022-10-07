import React from "react";
import axios from 'axios'
import { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { UserContext } from "../App";

function ContactCard(props) {
  var user = useContext(UserContext);

  var contactId = props.id;

    const startChat = ()=> {
        
    }

  const addFriend = async (e) => {
    e.preventDefault();
    try {
      var url = `http://localhost:3001/api/${user._id}/${contactId}`;
      var res = await fetch(url, {
        method: "Post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

    } catch {}
  };
  return (
    <div>
        <h5>{props.username}</h5>
        <button onClick={addFriend}>add</button>
        <button onClick={startChat}> Chat</button>
    </div>
  );
}

export default ContactCard;
/*
<>
    <Container className="m-2">
      <Row>
        <Col>
          <Image
            roundedCircle="true"
            className="position-relative"
            style={{ height: "3em", width: "3em" }}
            src={require(`../images/unknown.jpg`)}
          />
          <Badge bg="success" className=" avatar-badge rounded-circle ">
            2
          </Badge>
        </Col>
        <Col>{props.username}</Col>
        <Col>
          <Button variant="success" onClick={addFriend}>add</Button>
        
        
        </Col>
      </Row>
    </Container>
    </>*/