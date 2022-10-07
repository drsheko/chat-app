import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CallModal({setAnswer, setDecline, setIsCalling, isCalling, setResponse, callRecipients}) {
    const [fullscreen, setFullscreen] = useState(true);
    const answer = () =>{
        setResponse(true);
        setAnswer(true);
        setIsCalling(false);
    }
    const decline = () =>{
        setResponse(true);
        setDecline(true);
        setIsCalling(false);
    }
  return (
    <div>
    <Modal
      show={isCalling}
      onHide = {()=>{setIsCalling(false)}}
      fullscreen={fullscreen}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            {callRecipients.length >0? 
              callRecipients.map(r =>
                <div>
                  {r.username}
                </div>)
                :''
          }
         Ringing.......
         CAll Modal Component
        </Modal.Title>
        
      </Modal.Header>
      <Modal.Body>
        <Button variant = 'success' onClick={answer}>Answer</Button>
        <Button variant='danger' onClick={decline}>Decline</Button>
      </Modal.Body>
      
    </Modal>
    </div>
  );
}

export default CallModal ;


