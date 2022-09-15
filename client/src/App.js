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
import { useSocket } from './context/socketProvider';



export const UserContext = createContext();

function App() {
  var socket = useSocket()
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null);
    const [key, setKey] = useState('home')
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
      <Header setUser={setUser} />
      <SideNav setKey={setKey}/>
      {
        userId? <Dashboard currKey={key} />
        :''
      }
      
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login getUser={getUser} />} />
        <Route path='/dashboard' element={<Dashboard/>} />  
        </Routes>

    </UserContext.Provider>
    
  )
}

export default App;
