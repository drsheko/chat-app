import React from 'react';
import axios from 'axios'
import {useContext, useState, useEffect} from 'react';
import { UserContext } from '../App';
import ContactCard from './contactCard';

function Contacts(props) {
    var user = useContext(UserContext);
    const [friends, setFriends] = useState([])

    useEffect(() => {
        const getFriends = async() => {
            try{
                var id = user._id;
                console.log(id)
                var url = `http://localhost:3001/api/contacts/${id}/friends`;
                var res = await axios.get(url)
                var data = await res.data;
                setFriends(data.friends)
             console.log(friends.length)
            
            }
            catch{
            }
        }
        getFriends()
    }, [])
    return (
        <div>
            {friends.length>0?
                friends.map(f=>{
                   
                    <div>
                        <div>{f.username}</div>
                        <div>{f._id}</div>
                       
                    </div>
                })
                
                :'No friends'
            }
        </div>
    );
}

export default Contacts;