import React from 'react';
import{ useContext, useState, useEffect} from 'react'
import { UserContext } from '../App';
import ChatBox from './chatBox';
import ContactCard from './contactCard';
import Contacts from './contacts';
import Search from './search';

function ContactSection(props) {

    return (
        <div className='row'>
            <div className='col'>
            <Search/>
           <Contacts/>
            </div>
            
            <div className='col'>
            <ChatBox/>
            </div>
           
          

        </div>
    );
}

export default ContactSection;