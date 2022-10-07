import React from 'react';
import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import CloseButton from 'react-bootstrap/CloseButton'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import { UserContext } from '../App';
import ContactCard from './contactCard';


function Search(props) {
    var user = useContext(UserContext)
    const [form, setForm] = useState('')
    const [resultOpen, setResultOpen] = useState(false);
    const [ searchResult, setSearchResult] = useState([]);

    const handleChange = (e) => {
        setForm(e.target.value)
    }
    const closeResult = () => {
        setResultOpen(false)
    }
    const addFriend = async (e) => {
        e.preventDefault();
        try {
            var contactId = searchResult[0]._id
            var url = `http://localhost:3001/api/${user._id}/${contactId}`;
            var res = await axios.post(url)
        
            var data = await res.data
            props.setAddedFriend(data.addedFriend);
            closeResult()
          
        } catch {}
      };
    const searchContacts = async(e) => {
        e.preventDefault(); 
        try{ 
            var url = "http://localhost:3001/api/contacts-search";
           
            var res = await fetch(url, {
                method:'Post',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                body: new URLSearchParams({
                    search: form
                })
            })
            var data =await res.json()
            setResultOpen(true)
            setSearchResult(data.result)
            setForm('')
        }
        catch(err){
            console.log(err)
        }
        
    } 
    return (
        <div>
        <Form onSubmit={searchContacts}> 
           <Container>
                <Row>
                    <Col>
                        <Form.Control type='search' value={form} onChange={handleChange} placeholder='search ....'  required/> 
                    </Col>
                    <Col>
                        <Button type="submit" variant='secondary'><i className="bi bi-search"></i></Button>
                    </Col>                
                </Row>
           </Container>
        </Form>
        {
            resultOpen?
            <Container >
                <CloseButton  onClick={closeResult}/>
                {searchResult.length>0?
                    searchResult.map(e=>
                        <>
                            <div>{e.username}</div>
                            {user.friends.includes(e._id)?''
                            :<button onClick={addFriend} >Add</button>}
                        </>
                    )
                    :'No item found'
                }
            </Container>
            :''
        }      
        </div>
    );
}

export default Search;