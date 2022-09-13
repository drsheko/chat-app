import React from "react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import SocketProvider from "../context/socketProvider";
import ContactSection from "./contactsSection";
import Home from "./home";

function Dashboard({ currKey }) {
  const [activeKey, setActiveKey] = useState(currKey);
var user = useContext(UserContext);
var id = user._id
  useEffect(() => {
    setActiveKey(currKey);
  }, [currKey]);
  return (
    <SocketProvider id={id}>
      <div>
        {activeKey == "home" ? (
          <Home />
        ) : activeKey == "profile" ? (
          "profile"
        ) : activeKey == "contacts" ? (
          <ContactSection />
        ) : activeKey == "pencil" ? (
          "pencil"
        ) : (
          "settings"
        )}
      </div>
    </SocketProvider>
  );
}

export default Dashboard;
