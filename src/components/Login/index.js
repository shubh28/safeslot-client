import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function Login() {
  
  const [showLogin,setShowLogin] = useState(true);
  function toggleLogin () {
    setShowLogin(!showLogin);
  }

    return (
      <Container>
        <div className="home-login">
          <Link to="/">
            <span className="material-icons">home</span> Home
          </Link>
        </div>
        <div className="login-wrapper">
          <h4>
            Welcome!<br></br> Login / Register to continue
          </h4>
          <div className="login-form">
            {showLogin ? (
              <LoginForm
                toggleLogin={toggleLogin}
              />
            ) : (
              <SignUpForm
                toggleLogin={toggleLogin}
              />
            )}
          </div>
        </div>
      </Container>
    );
}
