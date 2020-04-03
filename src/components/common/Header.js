import React from 'react';
import {Header as StyledHeader} from './../../styles'
import {Link,useHistory} from 'react-router-dom';


function Header ({heading, backPath}){
    const history = useHistory();
    function logOut() {
        localStorage.clear();
        history.push('/');
      };
    return (

        <StyledHeader>
         
            <Link to={backPath}>
                <span className="material-icons">arrow_back</span>
            </Link>
         
            <h2 className="text-center">{heading}</h2>
            <a href="#" className="logout" onClick={logOut} >
            Logout
            </a>
      </StyledHeader>
        
    )
}

export default Header;