import React from 'react';
import {useContext,useEffect,useState , createContext} from 'react'
import { Peer} from 'peerjs'

const PeerContext = createContext();

export function usePeer(){
    return useContext(PeerContext)
}
export function PeerProvider({id, children}) {
    const [peer, setPeer] = useState()
    
    useEffect(()=> {
        const myPeer = new Peer(id, {
            host:'https://chat-app-pi46.onrender.com/peerjs',
           // path:'/peerjs',
        });
        setPeer(myPeer);
        
        return () => myPeer.destroy()
    }, [id])

    return (
        <PeerContext.Provider value={peer}>
            {children}
        </PeerContext.Provider>
    );
}

export default PeerProvider;