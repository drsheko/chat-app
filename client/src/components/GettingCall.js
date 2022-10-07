import React from 'react';
import {useState, useEffect, useContext, useRef} from 'react'
import { useSocket } from '../context/socketProvider';
import { usePeer } from '../context/peerProvider';
import { UserContext } from '../App';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function GettingCall(props) {

    
    var currentCallRef = useRef(null);
    const [fullscreen, setFullscreen] =useState(false)
    
    const [answer, setAnswer] = useState(false);
    
    const answerVideoCall=(call)=>{
        props.answerCall(call);
        props.setIsCallAnswered(true)
    }

 
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
        <Button variant='danger' onClick={props.endCall}>Decline</Button>
      </Modal.Body>
      
    </Modal>
        </div>
    );
}

export default GettingCall;