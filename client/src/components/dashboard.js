import React from 'react';
import {useState, useEffect} from 'react'
import ContactSection from './contactsSection';

function Dashboard({currKey}) {

    const [activeKey,setActiveKey] = useState(currKey)

    useEffect(()=>{
        setActiveKey(currKey)
    },[currKey])
    return (
        <div>
            {   activeKey =='home'?'home'
                : activeKey == 'profile'? 'profile'
                : activeKey=='contacts'? <ContactSection/>
                : activeKey =='pencil'? 'pencil'
                :'settings'
            }
        </div>
    );
}

export default Dashboard;