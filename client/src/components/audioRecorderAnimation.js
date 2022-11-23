import React from 'react';
import { useStopwatch } from 'react-timer-hook'
function AudioRecorderAnimation(props) {
    const {
        seconds,
        minutes,
       
        
      } = useStopwatch({ autoStart: true });

    return (
        <div className='soundwave' >
           
            <span className='soundbar soundbar1'></span> 
            <span className='soundbar soundbar2'></span>
            <span className='soundbar soundbar3'></span>
            <span className='soundbar soundbar4'></span>
            <span className='soundbar soundbar5'></span>
            <span className='soundbar soundbar6'></span>
            <span className='soundbar soundbar7'></span>
            <span className='soundbar soundbar8'></span>
            <span className='soundbar soundbar9'></span>
            <span className='soundbar soundbar10'></span>
            <span className='soundbar soundbar11'></span>
            <span className='soundbar soundbar12'></span>
            <span style={{color:'white', margin:'0 1'}}>{minutes}:{seconds}</span>
        </div>
    );
}

export default AudioRecorderAnimation;