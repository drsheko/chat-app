import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle'
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
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green, purple } from '@mui/material/colors';

export const UserContext = createContext();
export const ThemeContext = createContext();
function App() {
  
    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState(null);
    const [darkMode, setDarkMode] =useState(false);
    const darkTheme = createTheme({
      breakpoints: {
        values: {
          mobile: 0,
          bigMobile: 350,
          tablet: 650,
          desktop: 900,
        },
      },
      palette: {
        mode: 'dark',
        grey:{
          100:'#616161'
        },
        warning:{
          main:'#fff176'
        },
        background:{
          default:'#212121'
        },
        

      },
  
    });
    const lightTheme = createTheme({
      breakpoints: {
        values: {
          mobile: 0,
          bigMobile: 350,
          tablet: 650,
          desktop: 900,
        },
      },
    })
   /* useEffect(()=>{
      const loggedUser = localStorage.getItem("CHAT_APP_user");
      if(loggedUser===null){
        console.log('app if2  user', loggedUser)
        setUser(null)
      }else{  console.log('app else2  user', loggedUser)
        const foundUser = JSON.parse(loggedUser);
        setUser(foundUser);
      }
    },[]);*/

    useEffect(()=> {
        if(user){
          setUserId(user._id)
        }  
    }, [user])

  return(
    <UserContext.Provider value={{user, setUser}}>
      <ThemeContext.Provider value ={{darkMode, setDarkMode}}>
      <ThemeProvider theme={darkMode?darkTheme:lightTheme}>
      
     
      <Routes>
        <Route path='/' element={<Home userId={userId}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />  
        <Route path='/profile/:id' element={<Profile />} />  
        </Routes>
       
      </ThemeProvider>
      </ThemeContext.Provider>
    </UserContext.Provider>
    
  )
}

export default App;
