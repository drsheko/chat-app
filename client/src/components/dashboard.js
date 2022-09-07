import React from 'react';
import {useState, useEffect} from 'react'
import ContactSection from './contactsSection';
import Home from './home';

function Dashboard({currKey}) {

    const [activeKey,setActiveKey] = useState(currKey)

    useEffect(()=>{
        setActiveKey(currKey)
    },[currKey])
    return (
        <div>
            {   activeKey =='home'? <Home/>
                : activeKey == 'profile'? 'profile'
                : activeKey=='contacts'? <ContactSection/>
                : activeKey =='pencil'? 'pencil'
                :'settings'
            }
        </div>
    );
}

export default Dashboard;