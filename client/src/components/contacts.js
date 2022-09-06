import React from 'react';
import ContactCard from './contactCard';
import Search from './search';

function Contacts(props) {

    return (
        <div>
           <Search/>
           <ContactCard/>
        </div>
    );
}

export default Contacts;