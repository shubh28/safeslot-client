import React, { useState, useEffect } from 'react';
import { Header as StyledHeader } from './../../styles';
import { Link, useHistory } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

import { loadState } from '../../helpers/LocalStorage';
import { DEFAULT_LOCATION } from '../../common/consts';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
function Header({ heading, backPath }) {
  const history = useHistory();
  const [displayLogout, setDisplayLogout] = useState(false);
  const { resetLocation, resetStoreSlotId } = useLocationAndStoreContext();
  function logOut() {
    localStorage.clear();
    resetLocation();
    resetStoreSlotId();
    history.push('/');
  }

  useEffect(() => {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;
    if (token) {
      setDisplayLogout(true);
    } else {
      setDisplayLogout(false);
    }
  }, []);

  var styles = {
    bmBurgerButton: {
      position: 'relative',
      left: 0,
      top: 0,
      width: '36px',
      height: '30px'
    },
    bmBurgerBars: {
      background: '#fff'
    },
    bmBurgerBarsHover: {
      background: '#000'
    },
    bmCrossButton: {
      height: '30px',
      width: '30px'
    },
    bmCross: {
      background: '#fff',
      height: '30px'
    },
    bmMenuWrap: {
      position: 'fixed',
      height: '100%'
    },
    bmMenu: {
      width: 'auto',
      background: '#17a2b8',
      padding: '2.5em 1.5em 0'
      // fontSize: '1.15em'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmItem: {},
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  };

  return (
    <StyledHeader>
      <Link to={backPath}>
        <span className="material-icons">arrow_back</span>
      </Link>

      <h2 className="text-center">{heading}</h2>
      <Menu right styles={styles}>
        {displayLogout ? (
          <a href="#" className="logout" onClick={logOut}>
            Logout
          </a>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <a href="/bookings" className="menu-item">
          Bookings
        </a>
        <a href="/map">Map</a>
        <a href="/about">About</a>
      </Menu>
    </StyledHeader>
  );
}

export default Header;
