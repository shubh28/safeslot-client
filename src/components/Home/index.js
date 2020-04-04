import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Map from './../Map';
import { loadState } from '../../helpers/LocalStorage';

export default function Home() {
  const history = useHistory();
  const [displayMap, setDisplayMap] = useState(false);
  useEffect(() => {
    const token =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').id;
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;

    if (token) {
      axios
        .get(`https://safeslot-backend.herokuapp.com/api/users/${userId}`)
        .then(res => {
          if (res.data.isStoreOwner) {
            setDisplayMap(false);
            history.push('/owners');
          } else {
            setDisplayMap(true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setDisplayMap(true);
    }
  }, []);
  return (
    <div className="wrapper">
      <div style={{ marginBottom: '100px' }}>{displayMap && <Map />}</div>
    </div>
  );
}
