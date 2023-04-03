
import React, { useState, useCallback } from 'react';
import useLongPress from '../hooks/useLongPress';
import { invokeSaveAsDialog } from "recordrtc";
import useRecorderPermission from "./recorderPermession";
import KeyboardVoiceSharpIcon from '@mui/icons-material/KeyboardVoiceSharp';
import Chip from '@mui/material/Chip';
import AudioRecorderAnimation from './audioRecorderAnimation';
import Stack from '@mui/material/Stack';

const AudioRecorder = (props) => {
    const [recording, setRecording] =useState(false);
    const[audioURL, setAudioURL] = useState(null);
  const recorder = useRecorderPermission();
  const startRecording = async (e) => {
    
    e.preventDefault()
    setRecording(true)
    recorder.startRecording();
  };
  const stopRecording = async (e) => {
   e.preventDefault()
    await recorder.stopRecording();
    let blob = await recorder.getBlob();
    let audioSrc = window.URL
              .createObjectURL(blob);
    setAudioURL(audioSrc) 
    if(blob){
      props.sendVoiceMessage(e,blob)
    }    
        
    
    setRecording(false)
  };

  const onClick = (e)=>{
    if(recording){
      stopRecording(e)
    }
  }

  const useLongPressEvent = useLongPress(startRecording, onClick, stopRecording)
 
  return (
    <Stack direction="row" justifyContent="center"
    alignItems="center" spacing={2}>
       
       
      <KeyboardVoiceSharpIcon {...useLongPressEvent} className='mic' color='primary'/>
      {recording && <AudioRecorderAnimation/>}
    </Stack>
  );
};

export default AudioRecorder