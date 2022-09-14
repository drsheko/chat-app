import React from 'react';
import axios from 'axios'
import {useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { UserContext } from '../App';
import ContactCard from './contactCard';
import { useSocket } from '../context/socketProvider';

function Contacts(props) {
    var user = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [chatRooms, setChatRooms] =useState([])
    const [error, setError] = useState(null);
    const socket =useSocket();
    
    const startChat= async(frndID)=> {
        var myID = user._id;
        var friendId = frndID;
        try{
            var userIds = [myID, friendId];
           var res = await axios.post('http://localhost:3001/api/rooms/chat/chat-open',{
                userIds
            })
            var chatRoom =await res.data.chatRoom.room
           props.setSelectedChat(chatRoom)
           props.setOpenChat(true) 
           // join room 
           socket.emit('join', chatRoom)
        }
        catch(err){
            setError(err)
        }
    }
    
    useEffect(() => {
        const getFriends = async() => {
            try{
                var id = user._id;
                var url = `http://localhost:3001/api/contacts/${id}/friends`;
                var res = await axios.post(url)
                var data = await res.data.friends;
                setFriends(data)
            }
            catch(err){
                setError(err)
            }
        }
        const getAllChatRooms = async() => {
            var userId = user._id;
             var url = "http://localhost:3001/api/user/all-rooms/join"
            try{
               var res = await axios.post(`http://localhost:3001/api/${userId}/all-rooms/join`)
               var rooms = await res.data.rooms;
              
               setChatRooms(rooms)
               console.log(rooms)
            }
            catch(error){
             console.log(error)
            }
        }
        getAllChatRooms();
        getFriends()
    }, [])

    useEffect(()=>{
        if(props.addedFriend){
            setFriends(prevState => [props.addedFriend,...prevState ])
        } 
    }, [props.addedFriend])
    
    return (
        <div>
            __friends
            {friends.length>0?
               <>
                {friends.map(fr=>
                        <div>
                            <div>{fr.username}</div>
                            <button onClick={()=>startChat(fr._id)}> chat</button>
                        </div>
                )}
               </>   
                :'No friends'
            }

            __COnversations
             {chatRooms.length>0?
               <>
                {chatRooms.map(r=>
                        <div>
                            
                            {friends.length>0?
                                friends.map((fr)=>fr._id ==r.userIds.filter(uId => uId !==user._id)?
                                    <div>
                                        <div>{fr.username}</div>
                                         <button onClick={()=>startChat(fr._id)}> chat</button>
                                         
                                         
                                    </div>
                                    :'')
                                :''
                            }
                            {r.messages.length>0?
                            <div>{r.messages[r.messages.length-1].message}</div>
                                          
                                        :''}
                            
                        </div>
                )}
               </>   
                :'No chats'
            }
        </div>
    );
}

export default Contacts;