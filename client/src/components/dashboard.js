import React from 'react';
import {useState} from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import Contacts from './contacts';
function Dashboard() {

     const [key, setKey] = useState('contacts')   
    return (
        <Tabs activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 col-5 " fill> 
        <Tab eventKey= 'contact'  title='contact'>
            <Contacts/>
        </Tab>

        <Tab eventKey='chats' title='chats'>
            <div>active chats</div>
        </Tab>
        </Tabs>
    );
}

export default Dashboard;