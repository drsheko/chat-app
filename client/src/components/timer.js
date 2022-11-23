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
     // props.setDuration(`${hours} : ${minutes} : ${seconds}`);
      var callSummary 
      if(hours ==0 &&minutes==0){
        callSummary = `${seconds} secs`
      }
      else if(hours==0){
         callSummary =`${minutes} mins ${seconds} secs`
      }else{
         callSummary =`${hours} hr ${minutes} mins ${seconds} secs`
      }
      props.setDuration(callSummary)
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