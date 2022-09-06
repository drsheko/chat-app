import React from 'react';
import {useState, useEffect, useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row';
import { UserContext } from '../App';
import ContactCard from './contactCard';


function Search(props) {
    var user = useContext(UserContext)
    const [form, setForm] = useState('')
    const [ search, setSearch] = useState([]);

    const handleChange = (e) => {
        setForm(e.target.value)
    }
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
            setSearch(data.result)
            setForm('')
        }
        catch(err){
            console.log(err)
        }
        
    } 
    return (
        <Form onSubmit={searchContacts}> 
           <Container>
                <Row>
                    <Col>
                        <Form.Control type='text' value={form} onChange={handleChange} placeholder='search ....'  required/> 
                    </Col>
                    <Col>
                        <Button type="submit" variant='secondary'><i className="bi bi-search"></i></Button>
                    </Col>                
                </Row>
           </Container>
           
           {search.length>0?
            search.map(e=>
                <ContactCard 
                    id={e._id}
                    username={e.username}
                    isOnline={e.isOnline}
                    avatar={e.avatarURL}
                
                />)
                :''
            }
        </Form>
    );
}

export default Search;