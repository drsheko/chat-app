import React from 'react';
import {useContext,useEffect,useState , createContext} from 'react'
import { io } from "socket.io-client";
import axios from 'axios'
const SocketContext = createContext();

export function useSocket(){
    return useContext(SocketContext)
}
export function SocketProvider({id, children}) {
    const [socket, setSocket] = useState()
    
    useEffect(()=> {
        const newSocket = io('http://localhost:3001', {query: {id}} );
        setSocket(newSocket);
        const switchToOnline = async(id) => {
            var userId = id;
                var url = "http://localhost:3001/api/user/user-online"
               try{
                  var res = await axios.put(url, {userId})
               }
               catch(error){
                console.log(error)
               }
          }
          switchToOnline(id)
        return () => newSocket.close()
    }, [id])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;