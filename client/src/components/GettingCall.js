import React from 'react';
import {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function GettingCall(props) {
    const [fullscreen, setFullscreen] =useState(false) 
    const answerVideoCall=(call)=>{
        props.answerCall(call);
        props.setIsCallAnswered(true)
    }
    useEffect(()=>{
      // decline call if no response after 20 sec
     /* setTimeout(()=> {
        if(props.isGettingCall){
          console.log(props.isGettingCall)
          props.sendCallIsDeclined()
        }
      }, 20000)*/
      const timer = setTimeout(() => {
        if(props.isGettingCall){
          console.log(props.isGettingCall)
          props.sendCallIsDeclined()
        }
      }, 20000);
      return () => clearTimeout(timer);
    },[])

    return (
        <div>
            <Modal
      show={props.isGettingCall}
      onHide = {()=>{props.setIsGettingCall(false)}}
      fullscreen={fullscreen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            is calling .....
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant = 'success' 
            onClick={()=>{answerVideoCall(props.currentCall)}}
        >Answer</Button>
        <Button variant='danger' onClick={props.sendCallIsDeclined}>Decline</Button>
      </Modal.Body>
      
    </Modal>
        </div>
    );
}

export default GettingCall;