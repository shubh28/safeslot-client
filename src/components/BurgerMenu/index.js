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
        <Link to="#" onClick={logOut}>
          Logout
        </Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <Link to="/">Home</Link>
      <Link to="/map">Map</Link>
      {displayLogout ? <Link to="/bookings">Bookings</Link> : null}
      {user && user.isStoreOwner ? <Link to="/owners">owners</Link> : null}
      <Link to="/about">About Us</Link>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired
};

export default Menu;
