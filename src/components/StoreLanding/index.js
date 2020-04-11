import React from 'react';
import styled from 'styled-components';
import { Button, Row, Col, Container } from 'reactstrap';

import logo from '../../assets/logo.png';
import correctTiming from '../../assets/feature-display-correct-timing.png';
import socialDistancing from '../../assets/feature-social-distancing.png';
import crowdManagement from '../../assets/feature-crowd-management.png';
import bannerImage from '../../assets/home.jpg';
import { Link } from 'react-router-dom';
import Typist from 'react-typist';
const StoreLandingWrapper = styled(Container)`
  .header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 130px;
    }
  }

  .banner-font {
    font-size: 2rem;
  }

  section {
    margin-bottom: 1rem;
    text-align: center;
  }
  .slider {
    height: 300px;
    margin: 0 -15px;
    position: relative;

    img {
      height: 100%;
      width: 100%;
    }

    .overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: rgb(0, 0, 0, 0.5);
      color: #fff;
    }

    .slider-register-button {
      background-color: #fff;
      color: rgb(0, 0, 0, 0.75);
      font-weight: 500;
    }
    /* background-color: #ccc;
    background-image: url(../../assets/home.jpg);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center; */
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

  .banner-text {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function StoreLanding() {
  return (
    <StoreLandingWrapper>
      <div className="header">
        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>

      <section>
        <div className="slider">
          <img src={bannerImage} width="100%" />
          <div className="overlay">
            <div className="banner-text">
              <strong className="banner-font">
                Register your
                <Typist avgTypingDelay={100} startDelay={0}>
                  Grocery
                  <Typist.Backspace count={7} delay={2000} />
                  Pharmacy
                  <Typist.Backspace count={8} delay={2000} />
                  Food
                </Typist>
                Store
              </strong>
            </div>
            <Link to="/login">
              <Button className="register-button slider-register-button">
                {' '}
                Register Now
              </Button>
            </Link>
          </div>
        </div>
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

        <h5>
          Abhilash : <a href="tel:+919034432424">+91 9034432424</a>{' '}
        </h5>
        <h5>
          Hardik : <a href="tel:+919873378665">+91 9873378665</a>{' '}
        </h5>

        <p>
          <strong> Let's fight against #corona a.k.a. #covid19 together</strong>
        </p>

        <p>
          <strong>
            PS: The service is completely FREE. It's a community driven idea to
            fight against this pandemic
          </strong>
        </p>
      </section>
    </StoreLandingWrapper>
  );
}
