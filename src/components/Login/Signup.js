import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { URL_REFS } from '../../common/consts';

export default function Login() {
  const location = useLocation();

  const params = location ? new URLSearchParams(location.search) : undefined;
  const referrer = params ? params.get('ref') : undefined;
  const queryParams = new URLSearchParams(location.search);
  const isStorePage = queryParams.get('store') == 'true';
  console.log(isStorePage)

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
          <SignUpForm isStorePage={isStorePage} />
        </div>
      </div>
    </Container>
  );
}
