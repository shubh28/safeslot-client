// Menu.js
import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from '../../styles/burgerMenu';

const Menu = ({ open, displayLogout, logOut }) => {
  return (
    <StyledMenu open={open}>
      {displayLogout ? (
        <a href="#" className="logout" onClick={logOut}>
          Logout
        </a>
      ) : (
        <a href="/login">Login</a>
      )}
      <a href="/">Home</a>
      <a href="/map">Map</a>
      <a href="/bookings">Bookings</a>
      <a href="/about">About Us</a>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired
};

export default Menu;
