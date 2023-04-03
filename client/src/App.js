import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import Dashboard from "./components/dashboard";
import Home from "./components/home";
import Profile from "./components/profile";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "./themes/darkTheme";
import lightTheme from "./themes/lightTheme";

export const UserContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <Routes>
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </ThemeProvider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
