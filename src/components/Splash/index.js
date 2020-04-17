import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';
const logo = require('../../assets/logo.png');
const grocery = require('../../assets/grocery1.png');
const chemist = require('../../assets/chemist.png');

export default function Splash() {
  const [loadCount, setLoadCount] = React.useState(0);
  const [loading, user, error] = useCurrentUser();
  const history = useHistory();
  useEffect(() => {
    if (user) {
      if (user.isStoreOwner) {
        history.replace('/owners');
      } else {
        history.replace('/map');
      }
    }
  }, [user]);
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
    >
      {loadCount < 3 ? (
        <div id="loading-overlay">
          <div id="loading-text">loading...</div>
        </div>
      ) : null}
      <img
        onLoad={e => setLoadCount(loadCount + 1)}
        src={logo}
        style={{
          margin: 'auto',
          marginTop: '5rem',
          width: '65%',
          height: '65%'
        }}
      />
      <span style={{ marginBottom: '3rem' }}>
        getting essentials safely during crisis
      </span>
      <h5>Buy Essentials</h5>
      <Link style={{ marginBottom: '2rem' }} to={'/login'}>
        <Button> Login/Register</Button>
      </Link>
      <h5>I'm a Store Owner</h5>
      <Link style={{ marginBottom: '2rem' }} to={'/register-your-store'}>
        <Button> Login/Register</Button>
      </Link>
      <Link to={'/map'}>
        <Button color="info">SKIP</Button>
      </Link>
      <div
        style={{
          marginTop: '5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
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
    </div>
  );
}
