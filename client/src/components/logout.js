import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import Button  from '@mui/material/Button';
import { UserContext } from '../App';

function Logout(props) {
    let {setUser} =useContext(UserContext);   
    const handleLogout = async(e) => {
        e.preventDefault();
        let url = "http://localhost:3001/api/logout"
        const res = await axios.get(url);
        if(res.data.success){
            localStorage.removeItem("CHAT_APP_user");
            setUser(null)
        }  
    }
    return (
        <div>
            <Button variant='outlined' color='primary' onClick={handleLogout}>Log out</Button>
        </div>
    );
}

export default Logout;