import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { URL_REFS } from '../../common/consts';

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);
  const location = useLocation();

  const params = location ? new URLSearchParams(location.search) : undefined;
  const referrer = params ? params.get('ref') : undefined;
  function toggleLogin() {
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
          Welcome!<br></br> Login / Register to{' '}
          {`${referrer === URL_REFS.referStore ? 'refer a store' : 'continue'}`}
        </h4>
        <div className="login-form">
          {showLogin ? (
            <LoginForm toggleLogin={toggleLogin} />
          ) : (
            <SignUpForm toggleLogin={toggleLogin} />
          )}
        </div>
      </div>
    </Container>
  );
}
