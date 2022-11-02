import React, { useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook'
function Timer(props) {
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        
      } = useStopwatch({ autoStart: true });
    
    useEffect(()=>{
      props.setDuration(`${hours} : ${minutes} : ${seconds}`)
    },[seconds,minutes,hours])
      return (
        <div style={{textAlign: 'center' , position:'absolute', top:'0', left:'0' ,backgroundColor:'white'}}>
          <div style={{fontSize: '20px'}}>
           <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
          
          
        </div>
      );
}

export default Timer;