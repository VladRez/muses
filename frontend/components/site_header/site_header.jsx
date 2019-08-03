import React from 'react';
import { Link } from 'react-router-dom';


const SiteHeader = (props) => {

    const navHead = () => {
       return (<button onClick={props.logout}>Log Out</button>)
    }
    
    return props.currentUser === undefined ? <div></div> : navHead()
}

export default SiteHeader