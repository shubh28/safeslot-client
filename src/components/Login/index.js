import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true
    };
  }

  toggleLogin = () => {
    this.setState({ showLogin: !this.state.showLogin });
  };

  render() {
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
            {this.state.showLogin ? (
              <LoginForm
                toggleLogin={this.toggleLogin}
                history={this.props.history}
              />
            ) : (
              <SignUpForm
                toggleLogin={this.toggleLogin}
                history={this.props.history}
              />
            )}
          </div>
        </div>
      </Container>
    );
  }
}
