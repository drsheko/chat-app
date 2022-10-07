import React from 'react';
import {useState, useEffect, useRef, forwardRef} from 'react'
import Timer from './timer';
const VideoPlayer =(props,ref) => {

    return (
        <div>     
            <Timer />   
           <video className='local abs' autoPlay  muted ref={ref.localVideoRef} />
           <video className='remote' autoPlay ref={ref.remoteVideoRef} style={{width:'100%',height:'100%'}} />
           <div className='timer'></div>
            <button onClick={()=>{props.endCall()}}>End Call</button>
        </div>
    );
}

export default React.forwardRef(VideoPlayer);