import { useState } from 'react';
import axios from 'axios';
import { saveState } from '../helpers/LocalStorage';
import { useHistory, useLocation } from 'react-router-dom';
import { URL_REFS } from '../common/consts';
export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const history = useHistory();
  const location = useLocation();
  const params = location ? new URLSearchParams(location.search) : undefined;
  const referrer = params ? params.get('ref') : undefined;
  function login(email, password) {
    if (email && password) {
      setLoading(true);
      axios
        .post('https://safeslot-backend.herokuapp.com/api/users/login', {
          email,
          password
        })
        .then(res => {
          saveState('userAuthenticationDetails', res.data);
          axios
            .get(
              `https://safeslot-backend.herokuapp.com/api/users/${res.data.userId}`
            )
            .then(response => {
              saveState('userInfo', response.data);
              if (!response.data.isStoreOwner) {
                if (referrer === URL_REFS.stores) {
                  history.replace('/stores');
                } else if (referrer === URL_REFS.referStore) {
                  history.replace('/refer');
                } else {
                  history.replace('/');
                }
              } else if (response.data.isStoreOwner && !response.data.storeId) {
                history.push('/onboard');
              } else {
                history.push('/owners');
              }
            });
        })
        .catch(err => {
          setError('Error logging in');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Error logging in');
    }
  }

  return { loading, error, login };
}
