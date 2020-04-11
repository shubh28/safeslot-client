import React from 'react';
import styled from 'styled-components';
import { Button, Row, Col, Container } from 'reactstrap';

import logo from '../../assets/logo.png';
import correctTiming from '../../assets/feature-display-correct-timing.png';
import socialDistancing from '../../assets/feature-social-distancing.png';
import crowdManagement from '../../assets/feature-crowd-management.png';
import { Link } from 'react-router-dom';
const StoreLandingWrapper = styled(Container)`
  .header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .logo {
      width: 130px;
    }
  }

  section {
    margin: 1rem 0;
    text-align: center;
  }
  .slider {
    height: 300px;
    background-color: #ccc;
  }
  .feature-section {
    text-align: center;
  }
  .feature {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    align-items: center;
    .feature-img {
      width: 200px;
      margin: 1rem;
    }
  }
  .register-button {
    font-size: 1.5rem;
  }
`;

export default function StoreLanding() {
  return (
    <StoreLandingWrapper>
      <div className="header">
        <img src={logo} alt="logo" className="logo" />

        <Button>Login</Button>
      </div>
      <section>
        <div className="slider"></div>
      </section>
      <section className="feature-section">
        <h2>Benefits of SafeSlot</h2>
        <h4>for your store</h4>
        <Row>
          <Col sm="12">
            <div className="feature">
              <img
                src={socialDistancing}
                alt="enable social distancing"
                className="feature-img"
              />
              <h3 className="feature-title"> Enable Social Distancing</h3>
            </div>
          </Col>
          <Col sm="12">
            <div className="feature">
              <img
                src={correctTiming}
                alt="display correct timing"
                className="feature-img"
              />
              <h3 className="feature-title"> Display Correct Timing</h3>
            </div>
          </Col>

          <Col sm="12">
            <div className="feature">
              <img
                src={crowdManagement}
                alt="Better Crowd Management"
                className="feature-img"
              />
              <h3 className="feature-title"> Better Crowd Management</h3>
            </div>
          </Col>
        </Row>

        <Link to="/login">
          <Button className="register-button"> Register Now</Button>
        </Link>
      </section>

      <hr />

      <section>
        <h3>For Help, please call us</h3>

        <h4>
          Abhilash : <a href="+91 9034432424">+91 9034432424</a>{' '}
        </h4>
        <h4>
          Hardik : <a href="+91 9873378665">+91 9873378665</a>{' '}
        </h4>

        <p>
          <strong> Let's fight #corona a.k.a. #covid19 together</strong>
        </p>

        <p>
          <strong>
            PS: The Service is FREE for store owners. It's a community driven
            idea to fight against this pandemic
          </strong>
        </p>
      </section>
    </StoreLandingWrapper>
  );
}
