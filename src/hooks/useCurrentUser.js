import { useState, useEffect } from 'react';
import { loadState } from '../helpers/LocalStorage';
import axios from 'axios';

export default function useCurrentUser() {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const userId =
      loadState('userAuthenticationDetails') &&
      loadState('userAuthenticationDetails').userId;

    axios
      .get(
        `https://safeslot-backend.herokuapp.com/api/users/${userId}?filter={"include": "stores"}`
      )
      .then(res => {
        const user = res.data;
        setUser(user);
      })
      .catch(() => {
        setError(`Some error ocurred`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [loading, user, error];
}
