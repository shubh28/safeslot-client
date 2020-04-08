import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';

export default function Splash() {
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
    <div style={{ paddingTop: '40%', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <strong style={{ fontSize: '4rem' }}>SafeSlot</strong>

        <Link style={{ margin: '1rem 0' }} to={'/login'}>
          <Button> Login</Button>
        </Link>
        <Link to={'/map'}> skip</Link>
      </div>
    </div>
  );
}
