import React, { useContext } from "react";
import { UserContext } from "../App";
import Dashboard from "./dashboard";
import Login from "./login";
import PeerProvider from "../context/peerProvider";
import SocketProvider from "../context/socketProvider";
function Home() {
  var { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <SocketProvider id={user._id}>
          <PeerProvider id={user._id}>
            <Dashboard />
          </PeerProvider>
        </SocketProvider>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Home;
