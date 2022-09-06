import React from 'react';
import{ useContext, useState, useEffect} from 'react'
import { UserContext } from '../App';
import ContactCard from './contactCard';
import Contacts from './contacts';
import Search from './search';

function ContactSection(props) {

    return (
        <div>
           <Search/>
           <Contacts/>

        </div>
    );
}

export default ContactSection;