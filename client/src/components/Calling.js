import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';

import ring from '../sounds/calling.mp3'
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Calling({setIsCalling, isCalling, callRecipient,endCall,getChatRoomByCallerId, cancelCall, sendCallIsCancelled}) {
    const [fullscreen, setFullscreen] = useState(true);
    
    const localCancelCall =async() => {
      sendCallIsCancelled()
      cancelCall()
    }
    useEffect(()=>{
      const audio = document.querySelector('audio')
      audio.addEventListener('ended', ()=>{audio.play()})
    });
    return (
        <div>
          <audio  src={ring} autoPlay />
           <Dialog
        fullScreen
        open={isCalling}
        onClose={()=>{setIsCalling(false)}}
        TransitionComponent={Transition}
        overlayStyle={{backgroundColor: ''}}
      >
        <AppBar sx={{ position: 'relative'}} color='primary' >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              
              onClick={()=>{setIsCalling(false)}}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" display="inline" component="div">
             Calling {
             callRecipient.length >0? 
                callRecipient.map(r =>
                    r.username
                 )
                  :''
              } <span
                  class="spinner">
                    <div class="bounce1"></div>
                    <div class="bounce2"></div>
                    <div class="bounce3"></div>
                 </span>
            
            </Typography>
            <IconButton autoFocus style={{backgroundColor:'red'}} color='inherit' onClick={localCancelCall} >
            <PhoneDisabledIcon/> 
            </IconButton>
          </Toolbar>
        </AppBar>
        <List style={{alignSelf:'center',textAlign:'center', margin:'2rem auto'}}>   
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: '8rem', height: '8rem',margin:'1rem auto'}}
          />

            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" display="inline" component="div">
              {callRecipient.length >0? 
                callRecipient.map(r =>
                  r.username
                  )
                :''
              } <span
              class="spinner">
                <div class="bounce1" style={{backgroundColor:'black'}}></div>
                <div class="bounce2" style={{backgroundColor:'black'}}></div>
                <div class="bounce3" style={{backgroundColor:'black'}} ></div>
             </span>
        
            </Typography>
        </List>
      </Dialog>
        </div>
    );
}

export default Calling;