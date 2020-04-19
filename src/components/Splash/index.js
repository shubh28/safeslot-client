import React from 'react';
import { Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
import { StyledSplash } from '../../styles/splash';
import { logout } from '../../actions/user';
import { useDispatch } from 'react-redux';
const logo = require('../../assets/logo.png');
const grocery = require('../../assets/grocery1.png');
const chemist = require('../../assets/chemist.png');

export default function Splash() {
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
      <div>
        <img src={logo} />
        <span>getting essentials safely during crisis</span>
      </div>
      {user ? (
        <div className="splashBody">
          {user.isStoreOwner ? (
            <>
              <h5>Manage My Stores</h5>
              <Link to={'/owners'}>Manage Store/s</Link>
            </>
          ) : null}
          <h5>Know a Store Near You?</h5>
          <Link to={'/refer'}>
            <Button> Refer a Store</Button>
          </Link>
          <h5>Manage your Bookings</h5>
          <Link to={'/bookings'}>
            <Button> Bookings</Button>
          </Link>
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
          <img src={grocery} width="80" />
        </Link>
        <Link to={'/map'}>
          <img src={chemist} width="80" />
        </Link>
      </div>
    </StyledSplash>
  );
}
