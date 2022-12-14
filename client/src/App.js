import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from 'react'
import {useState, useEffect, createContext} from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Header from './components/header';

import Dashboard from './components/dashboard';
import Home from './components/home';
import SideNav from './components/sideNav';
import ChatBox from './components/chatBox';
import Profile from './components/profile';
import { useSocket } from './context/socketProvider';
import { usePeer } from './context/peerProvider';


export const UserContext = createContext();

function App() {
  
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null);
    
    const getUser = (currUser) => {
      setUser(currUser)
    }

    useEffect(() => {
      const loggedUser = localStorage.getItem("CHAT_APP_user");
      if (loggedUser) {
        const foundUser = JSON.parse(loggedUser);
        setUser(foundUser);
      }
    }, []);
    useEffect(()=> {
        if(user){
          setUserId(user._id)
        }
        
    }, [user])

  return(
    <UserContext.Provider value={user}>
      <Routes>
        <Route path='/' element={<Home userId={userId}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login getUser={getUser} />} />
        <Route path='/dashboard' element={<Dashboard/>} />  
        <Route path='/profile/:id' element={<Profile />} />  
        </Routes>

    </UserContext.Provider>
    
  )
}

export default App;
