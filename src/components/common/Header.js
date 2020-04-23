import React, { useState, useEffect, useRef } from 'react';
import { Header as StyledHeader } from './../../styles';
import { Link, useHistory } from 'react-router-dom';
import Burger from '../BurgerMenu/burger';
import Menu from '../BurgerMenu';

import { loadState } from '../../helpers/LocalStorage';
import { DEFAULT_LOCATION } from '../../common/consts';
import { useLocationAndStoreContext } from '../../contexts/location-and-store-context';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
function Header({ heading, backPath }) {
  const history = useHistory();
  const [displayLogout, setDisplayLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const { resetLocation, resetStoreSlotId } = useLocationAndStoreContext();
  function logOut() {
    localStorage.clear(); // is this correct?
    //  Are we gonna clear all of local storage and potentially
    //  interfere with othre applications using localstorage?
    resetLocation();
    resetStoreSlotId();
    history.push('/');
  }
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));
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
  return (
    <StyledHeader>
      <Link to={backPath}>
        <span className="material-icons">arrow_back</span>
      </Link>

      <h2 className="text-center">{heading}</h2>
      <div ref={node} className="mapMenuContainer">
        <Burger open={open} setOpen={setOpen} />
        <Menu
          open={open}
          setOpen={setOpen}
          displayLogout={displayLogout}
          logOut={logOut}
        />
      </div>
    </StyledHeader>
  );
}

export default Header;
