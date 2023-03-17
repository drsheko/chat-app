import React, { useContext } from 'react';
import {useState, useEffect} from 'react'
import axios from 'axios';
import { UserContext } from '../App';
import CallCard from './callCard';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card'
function Calls(props) {
    let {user, setUser} =useContext(UserContext);
    const [calls, setCalls] =useState([]);

useEffect(()=>{
    const getUserCalls = async() => {
        let url="http://localhost:3001/api/calls//user/mycalls";
        try{
            var res = await axios.post(url,{
                userId:user._id
            });
            console.log(res.data.calls)
            setCalls(res.data.calls)
        }
        catch(error){
            console.log(error)
        }
    }
    getUserCalls();
   
},[])
    return (
        <Card className='mb-5'>
            {calls.length>0 && calls.map(c => 
            <>
                <CallCard call={c}  openProfile={props.openProfile} makeVideoCall={props.makeVideoCall}  setCallRecipient={props.setCallRecipient}/>
                <Divider variant="middle" style={{ background: 'gray' }}  />

                </>
            ) }
        </Card>
    );
}

export default Calls;