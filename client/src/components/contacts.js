import React from 'react';
import axios from 'axios'
import {useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { UserContext } from '../App';
import ContactCard from './contactCard';

function Contacts(props) {
    var user = useContext(UserContext);
    const [friends, setFriends] = useState([])
    const [error, setError] = useState(null)
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
        </div>
    );
}

export default Contacts;