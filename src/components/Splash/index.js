import React, { useEffect } from 'react';
import { Button, Spinner } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';
import logo from '../../assets/logo.png'
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
import { StyledSplash } from '../../styles/splash';
import { logout } from '../../actions/user';
import { useDispatch } from 'react-redux';
const grocery = require('../../assets/grocery1.png');
const chemist = require('../../assets/chemist.png');

export default function Splash() {
  const [loadCount, setLoadCount] = React.useState(0);
  const [loading, user, error] = useCurrentUser();
  const { resetLocation, resetStoreSlotId } = useLocationAndStoreContext();
  const history = useHistory();
  const dispatch = useDispatch();
  function logOut() {
    localStorage.clear(); // is this correct?
    //  Are we gonna clear all of local storage and potentially
    //  interfere with othre applications using localstorage?
    resetLocation();
    resetStoreSlotId();
    dispatch(logout());
  }
  return (
    <StyledSplash>
      {loadCount < 3 ? (
        <div id="loading-overlay">
          <div className="spinner-border text-info" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          Please Wait...
        </div>
      ) : null}
      <div>
        <img src={logo} onLoad={e => setLoadCount(loadCount + 1)} />
        <span>getting essentials safely during crisis</span>
      </div>
      {user ? (
        <div className="splashBody">
          {user.isStoreOwner ? (
            <>
              <h5>Manage My Stores</h5>
              <Link to={'/owners'}>
                <Button>Manage Stores</Button>
              </Link>
              <Link to={'/managebookings'}>
                <Button>Manage Bookings</Button>
              </Link>
            </>
          ) : (
            <>
              <h5>Know a Store Near You?</h5>
              <Link to={'/refer'}>
                <Button> Refer a Store</Button>
              </Link>
            </>
          )}
          <h5>Manage your Bookings</h5>
          <div className="doubleButton">
            <Link to={'/bookings'}>
              <Button>My Bookings</Button>
            </Link>
            <Link to={'/map'}>
              <Button> New Booking</Button>
            </Link>
          </div>
          <h5>Currently logged in as {user.email}</h5>
          <Button
            style={{ width: 'min-content', alignSelf: 'center' }}
            onClick={() => logOut()}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="splashBody">
          <h5>Buy Essentials</h5>
          <Link to={'/login'}>
            <Button> Login/Register</Button>
          </Link>
          <h5>I'm a Store Owner</h5>
          <Link to={'/register-your-store'}>
            <Button> Login/Register</Button>
          </Link>
          <Link to={'/map'}>
            <Button color="info">SKIP</Button>
          </Link>
        </div>
      )}
      <div className={'splashFooter'}>
        <Link to={'/map'}>
          <img
            onLoad={e => setLoadCount(loadCount + 1)}
            src={grocery}
            width="80"
          />
        </Link>
        <Link to={'/map'}>
          <img
            onLoad={e => setLoadCount(loadCount + 1)}
            src={chemist}
            width="80"
          />
        </Link>
      </div>
    </StyledSplash>
  );
}
