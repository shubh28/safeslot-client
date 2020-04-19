// Menu.js
import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from '../../styles/burgerMenu';
import { Link } from 'react-router-dom';

const Menu = ({ open, displayLogout, logOut }) => {
  return (
    <StyledMenu open={open}>
      {displayLogout ? (
        <Link to="#" onClick={() => logOut()}>
          Logout
        </Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <Link to="/">Home</Link>
      <Link to="/map">Map</Link>
      {displayLogout ? <Link to="/bookings">Bookings</Link> : null}
      <Link to="/about">About Us</Link>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired
};

export default Menu;
