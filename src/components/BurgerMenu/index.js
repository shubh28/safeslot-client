// Menu.js
import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from '../../styles/burgerMenu';
import { Link } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';

const Menu = ({ open, displayLogout, logOut }) => {
  const [loading, user, error] = useCurrentUser();
  return (
    <StyledMenu open={open}>
      {displayLogout ? (
        <Link open={open} to="#" onClick={logOut}>
          Logout
        </Link>
      ) : (
        <Link open={open} to="/login">
          Login
        </Link>
      )}
      <Link open={open} to="/">
        Home
      </Link>
      <Link open={open} to="/map">
        Map
      </Link>
      {displayLogout ? (
        <Link open={open} to="/bookings">
          Bookings
        </Link>
      ) : null}
      {user && user.isStoreOwner ? (
        <Link open={open} to="/owners">
          owners
        </Link>
      ) : null}
      <Link open={open} to="/about">
        About Us
      </Link>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired
};

export default Menu;
