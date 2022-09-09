import React from 'react';
import axios from 'axios'
import {useContext, useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
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
                var res = await axios.post(url)
                var data = await res.data.friends;
                setFriends(data,console.log(data))
            }
            catch{
            }
        }
        getFriends()
    }, [])
    useEffect(()=>{console.log(friends.length)},[friends])
    return (
        <div>
            {friends.length>0?
               <>
                {friends.map(fr=>
                    <Link to={`chatBox/${fr.username}`}>
                        <ContactCard 
                            id={fr._id}
                            username = {fr.username}
                            avatar ={fr.avatarURL}
                            isOnline = {fr.isOnline}
                        
                        />
                    </Link>
                )}
               </>
                
                :'No friends'
            }
        </div>
    );
}

export default Contacts;