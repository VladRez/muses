import React from 'react';
import { Link } from 'react-router-dom';


const SiteHeader = (props) => {

    const navHead = () => {
       return (<div className="siteHeader">
           <div className="headerInner">
               <div className="headerLogo">
                   <a href="/">
                       <span>Muses</span>
                   </a>
                  
               </div>

            <div className="headerContents">
            <button onClick={props.logout}>Log Out</button>
            </div>
            <div className="headerNav"></div>
            <div className="rightContents"></div>
            <div className="searchBar"></div>
            <div className="headerProfile"></div>
            <div className="askWrapper"></div>
           </div>
       </div>)
    }
    
    return props.currentUser === undefined ? <div></div> : navHead()
}

export default SiteHeader

//